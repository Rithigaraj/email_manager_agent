from flask import Blueprint, request, jsonify
from app.utils.auth_helpers import token_required
from app.services.gmail_sync import GmailSyncService
from app.models import db, Email
from app.services.ai_service import AIService

gmail_bp = Blueprint('gmail', __name__)

@gmail_bp.route('/sync', methods=['POST'])
@token_required
def sync_gmail(current_user):
    data = request.get_json() or {}
    gmail_user = data.get('gmail_user', '').strip()
    app_password = data.get('app_password', '').strip()

    if not gmail_user or not app_password:
        return jsonify({'message': 'Gmail address and App Password are required.'}), 400

    result = GmailSyncService.fetch_live_gmail(
        user_id=current_user.id,
        gmail_user=gmail_user,
        app_password=app_password
    )

    if not result['success']:
        return jsonify(result), 400

    return jsonify(result), 200

@gmail_bp.route('/send', methods=['POST'])
@token_required
def send_gmail(current_user):
    data = request.get_json() or {}
    gmail_user = data.get('gmail_user', '').strip()
    app_password = data.get('app_password', '').strip()
    recipient = data.get('recipient', '').strip()
    subject = data.get('subject', '').strip()
    body = data.get('body', '').strip()

    if not gmail_user or not app_password or not recipient or not subject or not body:
        return jsonify({'message': 'Gmail credentials, recipient, subject, and body are required.'}), 400

    # 1. Send live email via SMTP
    result = GmailSyncService.send_live_gmail(gmail_user, app_password, recipient, subject, body)
    if not result['success']:
        return jsonify(result), 400

    # 2. Save sent email into Database
    ai_summary = AIService.summarize_email(body)
    new_email = Email(
        user_id=current_user.id,
        recipient=recipient,
        subject=subject,
        body=body,
        status='sent',
        category='general',
        ai_sentiment='Live Sent via Gmail',
        ai_summary=ai_summary
    )
    db.session.add(new_email)
    db.session.commit()

    return jsonify(result), 200
