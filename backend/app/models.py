from .extensions import db

class URLMapping(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    short_code = db.Column(db.String(10), unique=True, nullable=False)
    long_url = db.Column(db.String(512), nullable=False)
    click_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.now())
