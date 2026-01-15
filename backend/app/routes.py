from flask import Blueprint, request, jsonify, redirect, abort
from .services import create_short_url_mapping, get_long_url
from .extensions import limiter

bp = Blueprint('main', __name__)

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@bp.route('/api/v1/shorten', methods=['POST'])
@limiter.limit("5 per minute")
def shorten_url():
    data = request.get_json()
    long_url = data.get('long_url')

    if not long_url:
        return jsonify({"error": "long_url is required"}), 400
    
    response, status_code = create_short_url_mapping(long_url)
    return jsonify(response), status_code

@bp.route('/<short_code>', methods=['GET'])
def redirect_to_long_url(short_code):
    long_url = get_long_url(short_code)
    if long_url:
        return redirect(long_url)
    else:
        abort(404)
