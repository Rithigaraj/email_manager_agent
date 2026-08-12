from flask import Blueprint, request, jsonify
from app.models import db, Email
from app.utils.auth_helpers import token_required
from app.services.ai_service import AIService

emails_bp = Blueprint('emails', __name__)

def seed_user_emails_if_empty(user):
    count = Email.query.filter_by(user_id=user.id).count()
    if count == 0:
        sample_emails = [
            Email(
                user_id=user.id,
                recipient='alex.dev@acme.corp',
                subject='Q4 Product Strategy & Roadmap Meeting Notes',
                body=f"Hi {user.username},\n\nThanks for attending our strategic alignment session. We agreed on focusing 60% of engineering bandwidth on AI-driven email automation and smart workflow tools.\n\nKey takeaways:\n1. Launch Gemini AI API integration by mid-quarter.\n2. Improve UI dashboard response time.\n3. Roll out automated email sentiment categorization.\n\nBest regards,\nSarah Jenkins\nHead of Product",
                status='sent',
                category='general',
                ai_sentiment='Confident & Productive',
                ai_summary='Summary of Q4 strategic roadmap alignment. Team agreed to focus 60% bandwidth on AI automation tools and Gemini API integration.'
            ),
            Email(
                user_id=user.id,
                recipient='client.services@globalinc.com',
                subject='Enterprise AI Email License & Security Questionnaire',
                body=f"Dear {user.username},\n\nWe received your inquiry regarding our enterprise security compliance and SLA guarantees. Our platform encrypts all credentials using AES-256 and supports OAuth2 / JWT authentication.\n\nPlease review the attached SOC2 Type II compliance summary at your earliest convenience.\n\nSincerely,\nGlobal Enterprise Tech Support",
                status='sent',
                category='support',
                ai_sentiment='Informative & Professional',
                ai_summary='Response to enterprise security inquiry confirming AES-256 encryption and SOC2 Type II compliance.'
            ),
            Email(
                user_id=user.id,
                recipient='marketing@techhub.io',
                subject='DRAFT: Launch Announcement - Next Gen Email Manager',
                body=f"Hi Subscribers,\n\nWe are thrilled to announce the official release of AI Email Hub! Streamline your outreach with AI-generated drafts, thread summarization, and interactive analytics.\n\nTry it free today!",
                status='draft',
                category='newsletter',
                ai_sentiment='Urgent & Persuasive',
                ai_summary='Draft release announcement for AI Email Hub highlighting AI generation and analytics.'
            ),
            Email(
                user_id=user.id,
                recipient='partner@investorgroup.com',
                subject='Partnership Proposal & Q3 Traction Metrics',
                body=f"Hi David,\n\nFollowing up on our discussion last week regarding investment opportunities in AI workflow tools. Our monthly active email volume grew by 140% month-over-month.\n\nLet us schedule a brief 15-minute call this Thursday.\n\nRegards,\n{user.username}",
                status='scheduled',
                category='sales',
                ai_sentiment='Optimistic',
                ai_summary='Follow-up email detailing 140% MoM growth in email volume and requesting a follow-up call on Thursday.'
            ),
            Email(
                user_id=user.id,
                recipient='customer.care@serviceportal.com',
                subject='Inquiry: Webhook Notification Callback Errors',
                body=f"Hello Engineering Team,\n\nWe noticed a few intermittent 504 gateway timeout errors on webhooks during peak traffic hours. Could you inspect the load balancer metrics?\n\nThanks,\n{user.username}",
                status='sent',
                category='inquiry',
                ai_sentiment='Neutral & Inquiry',
                ai_summary='Technical support request reporting intermittent 504 gateway timeouts on webhook callbacks during peak hours.'
            )
        ]
        db.session.add_all(sample_emails)
        db.session.commit()

@emails_bp.route('', methods=['GET'])
@token_required
def get_emails(current_user):
    seed_user_emails_if_empty(current_user)

    status = request.args.get('status')
    category = request.args.get('category')
    search = request.args.get('search')

    query = Email.query.filter_by(user_id=current_user.id)

    if status and status != 'all':
        query = query.filter_by(status=status)
    if category and category != 'all':
        query = query.filter_by(category=category)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter((Email.subject.ilike(search_fmt)) | (Email.recipient.ilike(search_fmt)) | (Email.body.ilike(search_fmt)))

    emails = query.order_by(Email.created_at.desc()).all()
    return jsonify({'emails': [email.to_dict() for email in emails]}), 200

@emails_bp.route('/<int:email_id>', methods=['GET'])
@token_required
def get_email(current_user, email_id):
    email = Email.query.filter_by(id=email_id, user_id=current_user.id).first()
    if not email:
        return jsonify({'message': 'Email not found.'}), 404
    return jsonify({'email': email.to_dict()}), 200

@emails_bp.route('', methods=['POST'])
@token_required
def create_email(current_user):
    data = request.get_json() or {}
    recipient = data.get('recipient', '').strip()
    subject = data.get('subject', '').strip()
    body = data.get('body', '').strip()
    status = data.get('status', 'draft')
    category = data.get('category', 'general')
    ai_sentiment = data.get('ai_sentiment', 'Neutral')

    if not recipient or not subject or not body:
        return jsonify({'message': 'Recipient, subject, and body are required fields.'}), 400

    # Auto generate summary using AI Service
    ai_summary = AIService.summarize_email(body)

    email = Email(
        user_id=current_user.id,
        recipient=recipient,
        subject=subject,
        body=body,
        status=status,
        category=category,
        ai_sentiment=ai_sentiment,
        ai_summary=ai_summary
    )
    db.session.add(email)
    db.session.commit()

    return jsonify({'message': 'Email created successfully!', 'email': email.to_dict()}), 201

@emails_bp.route('/<int:email_id>', methods=['PUT'])
@token_required
def update_email(current_user, email_id):
    email = Email.query.filter_by(id=email_id, user_id=current_user.id).first()
    if not email:
        return jsonify({'message': 'Email not found.'}), 404

    data = request.get_json() or {}
    email.recipient = data.get('recipient', email.recipient)
    email.subject = data.get('subject', email.subject)
    email.body = data.get('body', email.body)
    email.status = data.get('status', email.status)
    email.category = data.get('category', email.category)
    email.ai_sentiment = data.get('ai_sentiment', email.ai_sentiment)

    if 'body' in data:
        email.ai_summary = AIService.summarize_email(email.body)

    db.session.commit()
    return jsonify({'message': 'Email updated successfully!', 'email': email.to_dict()}), 200

@emails_bp.route('/<int:email_id>', methods=['DELETE'])
@token_required
def delete_email(current_user, email_id):
    email = Email.query.filter_by(id=email_id, user_id=current_user.id).first()
    if not email:
        return jsonify({'message': 'Email not found.'}), 404

    db.session.delete(email)
    db.session.commit()
    return jsonify({'message': 'Email deleted successfully!'}), 200
