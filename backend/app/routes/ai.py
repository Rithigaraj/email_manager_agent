from flask import Blueprint, request, jsonify
from app.utils.auth_helpers import token_required
from app.services.ai_service import AIService

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate', methods=['POST'])
@token_required
def generate_email(current_user):
    data = request.get_json() or {}
    prompt = data.get('prompt', '').strip()
    tone = data.get('tone', 'Professional')
    recipient = data.get('recipient', '').strip()
    category = data.get('category', 'general')

    if not prompt:
        return jsonify({'message': 'Prompt is required to generate AI email.'}), 400

    result = AIService.generate_email_content(
        prompt=prompt,
        tone=tone,
        recipient=recipient,
        category=category
    )
    return jsonify(result), 200

@ai_bp.route('/summarize', methods=['POST'])
@token_required
def summarize(current_user):
    data = request.get_json() or {}
    body = data.get('body', '').strip()

    if not body:
        return jsonify({'message': 'Body is required for summarization.'}), 400

    summary = AIService.summarize_email(body)
    return jsonify({'summary': summary}), 200
