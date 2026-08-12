from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.template import Template
from app.schemas.template import TemplateCreate, TemplateOut

router = APIRouter(prefix="/templates", tags=["Templates"])

DEFAULT_TEMPLATES = [
    {
        "name": "Sales Intro & Value Prop",
        "subject_template": "Quick question regarding {company} email workflows",
        "body_template": "Hi {first_name},\n\nI noticed {company} is scaling your team. We help organizations streamline email outreach using AI automation.\n\nWould you be open to a 10-minute chat this Thursday?\n\nBest regards,\nMailPilot Team",
        "category": "sales"
    },
    {
        "name": "Meeting Request & Alignment",
        "subject_template": "Follow-up & Next Steps: {topic}",
        "body_template": "Hi {name},\n\nThank you for taking the time to speak today regarding {topic}.\n\nI have summarized our main action points below. Please let me know if Friday at 2 PM works for our next check-in.\n\nBest regards,\nMailPilot Team",
        "category": "inquiry"
    },
    {
        "name": "Customer Support Resolution",
        "subject_template": "[Resolved] Ticket #{ticket_id} - {topic}",
        "body_template": "Dear {customer_name},\n\nWe have investigated your issue regarding {topic} and applied a resolution.\n\nPlease confirm if everything is working smoothly on your end.\n\nSincerely,\nSupport Team",
        "category": "support"
    }
]

def seed_default_templates(db: Session, user: User):
    count = db.query(Template).filter(Template.user_id == user.id).count()
    if count == 0:
        for tpl_data in DEFAULT_TEMPLATES:
            tpl = Template(
                user_id=user.id,
                name=tpl_data["name"],
                subject_template=tpl_data["subject_template"],
                body_template=tpl_data["body_template"],
                category=tpl_data["category"]
            )
            db.add(tpl)
        db.commit()

@router.get("", response_model=dict)
def list_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_default_templates(db, current_user)
    templates = db.query(Template).filter(Template.user_id == current_user.id).order_by(Template.created_at.desc()).all()
    template_list = [
        {
            "id": t.id,
            "user_id": t.user_id,
            "name": t.name,
            "subject_template": t.subject_template,
            "body_template": t.body_template,
            "category": t.category,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in templates
    ]
    return {"templates": template_list}

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_template(
    payload: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template = Template(
        user_id=current_user.id,
        name=payload.name,
        subject_template=payload.subject_template,
        body_template=payload.body_template,
        category=payload.category or "general"
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return {
        "message": "Template created successfully!",
        "template": {
            "id": template.id,
            "user_id": template.user_id,
            "name": template.name,
            "subject_template": template.subject_template,
            "body_template": template.body_template,
            "category": template.category,
            "created_at": template.created_at.isoformat() if template.created_at else None
        }
    }

@router.delete("/{template_id}")
def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template = db.query(Template).filter(Template.id == template_id, Template.user_id == current_user.id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found.")
    
    db.delete(template)
    db.commit()
    return {"status": "success", "message": "Template deleted successfully!"}
