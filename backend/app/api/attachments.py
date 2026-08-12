from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.email_service import EmailService

router = APIRouter(prefix="/attachments", tags=["Attachment Manager"])

@router.get("")
def list_attachments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.get_attachments()

@router.get("/{attachment_id}/download")
def download_attachment(
    attachment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Returns secure mock document binary / stream
    content = f"MailPilot Document Attachment Payload ({attachment_id})\nSecurely retrieved for user {current_user.email}".encode("utf-8")
    return Response(
        content=content,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename=document_{attachment_id}.pdf"}
    )
