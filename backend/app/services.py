import random
import redis
from .extensions import db, redis_client
from .models import URLMapping
from config import Config

BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def generate_random_code():
    length = random.randint(4,6)
    return ''.join(random.choice(BASE62_CHARS) for _ in range(length))

def create_short_url_mapping(long_url, max_retries=5):
    """
    Creates a new URL mapping with retry logic for collision handling.
    Returns: (dict_response, status_code)
    """
    for _ in range(max_retries): 
        short_code = generate_random_code()
        # Check if code already exists
        if not URLMapping.query.filter_by(short_code=short_code).first():
            try:
                new_mapping = URLMapping(long_url=long_url, short_code=short_code)
                db.session.add(new_mapping)
                db.session.commit()
                
                # Cache in Redis
                if redis_client:
                    redis_client.setex(short_code, 86400, long_url) # 24 hours
                
                # Return success response
                # Note: Flask 'request' context might be needed for full URL reconstruction
                # but we will return partial data and let controller handle formatting if needed,
                # or import Config to construct it.
                return {
                    "short_url": f"http://localhost:{Config.FLASK_PORT}/{short_code}",
                    "short_code": short_code
                }, 201
            except Exception as e:
                db.session.rollback()
                print(f"Error creating mapping: {e}")
                return {"error": "Internal Server Error"}, 500
    
    return {"error": "Failed to generate unique short code after multiple attempts"}, 503

def get_long_url(short_code):
    """
    Retrieves the long URL for a given short code, using Redis cache if available.
    Returns: long_url_string or None
    """
    # 1. Check Redis
    if redis_client:
        long_url_from_cache = redis_client.get(short_code)
        if long_url_from_cache:
            return long_url_from_cache.decode('utf-8')
    
    # 2. Check Database
    mapping = URLMapping.query.filter_by(short_code=short_code).first()
    if mapping:
        # Cache back to Redis
        if redis_client:
            redis_client.setex(short_code, 86400, mapping.long_url)
        
        # Increment click count (optional, can be async)
        mapping.click_count += 1
        db.session.commit()
        
        return mapping.long_url
    
    return None
