import pytest
import json
import os

# Mock environment variables before importing app
os.environ['DB_USER'] = 'test'
os.environ['DB_PASSWORD'] = 'test'
os.environ['DB_NAME'] = 'test'
os.environ['LIMITER_STORAGE_URI'] = 'redis://localhost:6379'

from app import create_app, db, URLMapping

@pytest.fixture
def app():
    from config import Config
    class TestConfig(Config):
        TESTING = True
        SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
        RATELIMIT_ENABLED = False
        LIMITER_STORAGE_URI = "memory://"

    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_shorten_url(client):
    # Test valid shortening
    response = client.post('/api/v1/shorten', 
                          data=json.dumps({"long_url": "https://www.google.com"}),
                          content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'short_code' in data
    assert 'short_url' in data

def test_shorten_url_no_data(client):
    # Test missing long_url
    response = client.post('/api/v1/shorten', 
                          data=json.dumps({}),
                          content_type='application/json')
    assert response.status_code == 400

def test_redirect(client, app):
    # Create a mapping first
    with app.app_context():
        mapping = URLMapping(short_code="test", long_url="https://www.example.com")
        db.session.add(mapping)
        db.session.commit()

    response = client.get('/test')
    assert response.status_code == 302
    assert response.location == "https://www.example.com"

def test_redirect_404(client):
    response = client.get('/nonexistent')
    assert response.status_code == 404
