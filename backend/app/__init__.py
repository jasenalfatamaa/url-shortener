from flask import Flask
from flask_cors import CORS
import redis
from config import Config
from .extensions import db, limiter, redis_client
from .routes import bp as main_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    limiter.init_app(app)
    
    # Initialize Redis
    storage_uri = app.config.get('LIMITER_STORAGE_URI', 'redis://redis:6379')
    limiter.storage_uri = storage_uri
    
    # We need to initialize the global redis_client used in services
    # Ideally, we should wrap this in a proper extension class strictly,
    # but for now, we assign it to the extensions module global.
    from . import extensions
    if storage_uri.startswith('redis'):
        try:
            extensions.redis_client = redis.Redis.from_url(storage_uri)
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
    else:
        # Mock redis client for testing/fallback
        class FakeRedis:
            def setex(self, *args, **kwargs): pass
            def get(self, *args, **kwargs): return None
        extensions.redis_client = FakeRedis()

    CORS(app)

    # Register Blueprints
    app.register_blueprint(main_bp)

    with app.app_context():
        if not app.config.get('TESTING'):
            db.create_all()

    return app
