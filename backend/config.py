import os
# from dotenv import load_dotenv

# load_dotenv()

class Config:
    # --- Database Configuration (PostgreSQL) ---
    # 1. Ambil Komponen Kredensial dari Environment Variables
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_NAME = os.environ.get('DB_NAME')
    
    # 2. Bangun URI koneksi menggunakan f-string
    # Hostname 'db' adalah nama service PostgreSQL di docker-compose.yml
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@db:5432/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- Redis & Rate Limiting Configuration ---
    # Ambil URI lengkap yang disuntikkan dari docker-compose.yml: redis://redis:6379
    # Jika tidak ada, gunakan fallback ke 'redis://redis:6379'
    LIMITER_STORAGE_URI = os.environ.get('LIMITER_STORAGE_URI') or "redis://redis:6379"

    LIMITER_DEFAULT = "5 per minute"

    # --- Flask Port (Opsional) ---
    FLASK_PORT = os.environ.get('FLASK_PORT', 5003)
