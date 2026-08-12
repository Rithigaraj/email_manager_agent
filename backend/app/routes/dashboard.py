from flask import Blueprint, jsonify
from app.models import Email, Template
from app.utils.auth_helpers import token_required

from app.routes.emails import seed_user_emails_if_empty

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    seed_user_emails_if_empty(current_user)
    user_emails = Email.query.filter_by(user_id=current_user.id).all()
    templates_count = Template.query.filter_by(user_id=current_user.id).count()

    total_emails = len(user_emails)
    sent_count = sum(1 for e in user_emails if e.status == 'sent')
    draft_count = sum(1 for e in user_emails if e.status == 'draft')
    scheduled_count = sum(1 for e in user_emails if e.status == 'scheduled')

    category_counts = {}
    for e in user_emails:
        cat = e.category or 'general'
        category_counts[cat] = category_counts.get(cat, 0) + 1

    recent_emails = Email.query.filter_by(user_id=current_user.id).order_by(Email.created_at.desc()).limit(5).all()

    return jsonify({
        'stats': {
            'total_emails': total_emails,
            'sent_count': sent_count,
            'draft_count': draft_count,
            'scheduled_count': scheduled_count,
            'templates_count': templates_count,
            'category_breakdown': category_counts
        },
        'recent_activity': [e.to_dict() for e in recent_emails]
    }), 200
