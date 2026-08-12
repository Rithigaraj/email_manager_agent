from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.template import Template
from app.services.email_service import EmailService
from app.services.action_service import ActionService
from app.services.followup_service import FollowupService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    email_service = EmailService(db=db, user=current_user)
    action_service = ActionService(db=db, user=current_user)
    followup_service = FollowupService(db=db, user=current_user)

    emails_data = email_service.get_emails()
    emails = emails_data.get("emails", [])

    total_emails = len(emails)
    sent_count = sum(1 for e in emails if e.get("status") == "sent")
    draft_count = sum(1 for e in emails if e.get("status") == "draft")
    scheduled_count = sum(1 for e in emails if e.get("status") == "scheduled")

    templates_count = db.query(Template).filter(Template.user_id == current_user.id).count()

    category_breakdown = {}
    for e in emails:
        cat = e.get("category") or "general"
        category_breakdown[cat] = category_breakdown.get(cat, 0) + 1

    recent_activity = emails[:5]

    unread_count = sum(1 for e in emails if not e.get("is_read"))
    important_count = sum(1 for e in emails if e.get("is_important"))
    today_count = total_emails

    actions = action_service.get_action_items()
    pending_actions = sum(1 for a in actions if a.get("status") == "Pending")

    followups = followup_service.get_followups()
    waiting_replies = sum(1 for f in followups if f.get("status") == "No response")

    return {
        "stats": {
            "total_emails": total_emails,
            "sent_count": sent_count,
            "draft_count": draft_count,
            "scheduled_count": scheduled_count,
            "templates_count": templates_count,
            "category_breakdown": category_breakdown
        },
        "recent_activity": recent_activity,
        "unread_count": unread_count,
        "important_count": important_count,
        "today_count": today_count,
        "pending_actions": pending_actions,
        "waiting_replies": waiting_replies
    }

@router.get("/charts")
def get_dashboard_charts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Daily email volume
    daily_emails = [
        {"day": "Mon", "received": 12, "sent": 4},
        {"day": "Tue", "received": 19, "sent": 7},
        {"day": "Wed", "received": 15, "sent": 5},
        {"day": "Thu", "received": 22, "sent": 9},
        {"day": "Fri", "received": 17, "sent": 6},
        {"day": "Sat", "received": 8, "sent": 2},
        {"day": "Sun", "received": 10, "sent": 3}
    ]

    # Categories breakdown
    categories = [
        {"name": "Internship", "value": 35, "color": "#6366f1"},
        {"name": "College", "value": 25, "color": "#3b82f6"},
        {"name": "Hackathon", "value": 15, "color": "#8b5cf6"},
        {"name": "Finance", "value": 15, "color": "#10b981"},
        {"name": "Job", "value": 10, "color": "#f59e0b"}
    ]

    # Read vs Unread
    read_vs_unread = [
        {"name": "Read", "value": 24, "color": "#10b981"},
        {"name": "Unread", "value": 8, "color": "#ef4444"}
    ]

    # Important vs Normal
    important_vs_normal = [
        {"name": "Important", "value": 12, "color": "#f59e0b"},
        {"name": "Normal", "value": 20, "color": "#9ca3af"}
    ]

    return {
        "daily_emails": daily_emails,
        "categories": categories,
        "read_vs_unread": read_vs_unread,
        "important_vs_normal": important_vs_normal
    }
