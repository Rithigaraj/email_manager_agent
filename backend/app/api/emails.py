from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.email_service import EmailService

router = APIRouter(prefix="/emails", tags=["Emails"])

@router.get("")
def list_emails(
    status: Optional[str] = Query("all", description="Status filter (all, draft, sent, scheduled)"),
    category: Optional[str] = Query("all", description="Category filter (all, general, inquiry, sales, support, newsletter, etc.)"),
    search: Optional[str] = Query(None, description="Search query string"),
    folder: Optional[str] = Query("INBOX", description="Folder/label filter"),
    page_token: Optional[str] = None,
    max_results: int = Query(50, ge=1, le=500, description="Number of results per page (max 500)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.get_emails(folder=folder, status=status, category=category, search=search, page_token=page_token, max_results=max_results)

@router.get("/search")
def search_emails(
    q: str = Query(..., description="Search query or Gmail search string"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.get_emails(search=q)

@router.get("/{message_id}")
def get_email_detail(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    email = service.get_email_by_id(message_id)
    if not email:
        raise HTTPException(status_code=404, detail="Email message not found.")
    return email

@router.post("")
@router.post("/send")
def create_or_send_email(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.create_email(payload)

@router.put("/{message_id}")
def update_email(
    message_id: str,
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    result = service.update_email(message_id=message_id, data=payload)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result.get("message", "Email not found."))
    return result

@router.post("/{message_id}/reply")
def reply_email(
    message_id: str,
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    email = service.get_email_by_id(message_id)
    if not email:
        raise HTTPException(status_code=404, detail="Original email not found.")
    
    reply_to = email.get("sender") or email.get("recipient")
    reply_subject = f"Re: {email.get('subject')}" if not email.get('subject', '').startswith("Re:") else email.get('subject')
    body = payload.get("body", "")
    return service.create_email({"recipient": reply_to, "subject": reply_subject, "body": body, "status": "sent"})

@router.put("/{message_id}/read")
def mark_read(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.mark_read(message_id=message_id, is_read=True)

@router.put("/{message_id}/unread")
def mark_unread(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.mark_read(message_id=message_id, is_read=False)

@router.put("/{message_id}/star")
def star_email(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.set_starred(message_id=message_id, is_starred=True)

@router.put("/{message_id}/unstar")
def unstar_email(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.set_starred(message_id=message_id, is_starred=False)

@router.post("/{message_id}/archive")
def archive_email(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.archive(message_id=message_id)

@router.delete("/{message_id}")
def delete_email(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    return service.delete(message_id=message_id)

@router.put("/{message_id}/category")
def update_email_category(
    message_id: str,
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = EmailService(db=db, user=current_user)
    category = payload.get("category", "general")
    return service.update_email(message_id=message_id, data={"category": category})
