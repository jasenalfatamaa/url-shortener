import redis
import random
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import redirect, abort, request, jsonify
from flask_cors import CORS

from config import Config

# inisialisasi Ekstensi
db = SQLAlchemy()
redis_client = None
limiter = Limiter(key_func=get_remote_address)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # inisialisasi ekstensi dengan aplikasi FLask
    db.init_app(app)
    
    storage_uri = app.config.get('LIMITER_STORAGE_URI', 'redis://redis:6379')
    global redis_client
    if storage_uri.startswith('redis'):
        redis_client = redis.Redis.from_url(storage_uri)
    else:
        # Mock redis client untuk testing tanpa redis beneran
        class FakeRedis:
            def setex(self, *args, **kwargs): pass
            def get(self, *args, **kwargs): return None
        redis_client = FakeRedis()
    
    limiter.init_app(app)
    limiter.storage_uri = storage_uri
    
    CORS(app) # Enable CORS for all routes

    with app.app_context():
        if not app.config.get('TESTING'):
            db.create_all()
            
    # Import and register routes inside factory to avoid global app issues
    register_routes(app)
    
    return app

def register_routes(app):
    @app.route('/api/v1/shorten', methods=['POST'])
    @limiter.limit("5 per minute")
    def shorten_url():
        data = request.get_json()
        long_url = data.get('long_url')

        if not long_url:
            return jsonify({"error": "long_url is required"}), 400
        
        for _ in range(5): 
            short_code = generate_random_code()
            if not URLMapping.query.filter_by(short_code=short_code).first():
                try:
                    new_mapping = URLMapping(long_url=long_url, short_code=short_code)
                    db.session.add(new_mapping)
                    db.session.commit()
                    redis_client.setex(short_code, 86400, long_url)
                    return jsonify({
                        "short_url": f"http://localhost:{Config.FLASK_PORT}/{short_code}",
                        "short_code": short_code
                    }), 201
                except Exception as e:
                    db.session.rollback()
                    return jsonify({"error": "Internal Server Error"}), 500
        return jsonify({"error": "Failed to generate unique short code after multiple attempts"}), 503

    @app.route('/<short_code>', methods=['GET'])
    def redirect_to_long_url(short_code):
        long_url_from_cache = redis_client.get(short_code)
        if long_url_from_cache:
            return redirect(long_url_from_cache.decode('utf-8'))
        mapping = URLMapping.query.filter_by(short_code=short_code).first()
        if mapping:
            redis_client.setex(short_code, 86400, mapping.long_url)
            mapping.click_count += 1
            db.session.commit()
            return redirect(mapping.long_url)
        else:
            abort(404)

# Model Database
class URLMapping(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    short_code = db.Column(db.String(10), unique=True, nullable=False)
    long_url = db.Column(db.String(512), nullable=False)
    click_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.now())

BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def generate_random_code():
    length = random.randint(4,6)
    return ''.join(random.choice(BASE62_CHARS) for _ in range(length))

# app = create_app()

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5003)