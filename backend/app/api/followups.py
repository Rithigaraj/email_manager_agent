from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.followup_service import FollowupService
from app.services.groq_service import groq_service
from app.schemas.followup import FollowUpOut

router = APIRouter(prefix="/followups", tags=["Follow-up Tracking"])

@router.get("", response_model=List[FollowUpOut])
def get_followups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FollowupService(db=db, user=current_user)
    return service.get_followups()

@router.post("/{followup_id}/resolve")
def resolve_followup(
    followup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FollowupService(db=db, user=current_user)
    res = service.resolve_followup(followup_id)
    if not res:
        raise HTTPException(status_code=404, detail="Followup item not found.")
    return res

@router.post("/{followup_id}/generate-draft")
async def generate_followup_draft(
    followup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = FollowupService(db=db, user=current_user)
    followups = service.get_followups()
    target = next((f for f in followups if f["id"] == followup_id), None)
    
    if not target:
        raise HTTPException(status_code=404, detail="Followup target not found.")

    subject = target.get("subject", "Following up on my previous message")
    recipient = target.get("recipient", "HR Team")
    
    reply = await groq_service.generate_reply(
        subject=subject,
        sender=recipient,
        body=f"Sent initial email regarding {subject} {target.get('days_waiting', 4)} days ago with no response.",
        intent="Follow-up"
    )
    
    return {
        "recipient": recipient,
        "subject": f"Follow-up: {subject}",
        "draft": reply.draft
    }
