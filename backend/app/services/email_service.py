from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.email import EmailMetadata, EmailSummary
from app.services.gmail_service import GmailService, MOCK_EMAILS

class EmailService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user
        self.gmail = GmailService(user=user)

    def get_emails(self, folder: str = "INBOX", status: str = None, category: str = None, search: str = None, query: str = None, page_token: str = None, max_results: int = 50) -> Dict[str, Any]:
        search_query = search or query
        return self.gmail.fetch_emails(folder=folder, status=status, category=category, query=search_query, page_token=page_token, max_results=max_results)

    def get_email_by_id(self, message_id: str) -> Dict[str, Any]:
        return self.gmail.get_email_detail(message_id=message_id)

    def create_email(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self.gmail.create_email(data)

    def update_email(self, message_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self.gmail.update_email(message_id=message_id, data=data)

    def send_email(self, to: str, subject: str, body: str, cc: str = None) -> Dict[str, Any]:
        return self.gmail.send_email(to=to, subject=subject, body=body, cc=cc)

    def mark_read(self, message_id: str, is_read: bool = True):
        return self.gmail.update_email_status(message_id=message_id, is_read=is_read)

    def set_starred(self, message_id: str, is_starred: bool = True):
        return self.gmail.update_email_status(message_id=message_id, is_starred=is_starred)

    def archive(self, message_id: str):
        return self.gmail.update_email_status(message_id=message_id, is_archived=True)

    def delete(self, message_id: str):
        return self.gmail.delete_email(message_id=message_id)

    def get_attachments(self) -> List[Dict[str, Any]]:
        attachments = []
        for msg in MOCK_EMAILS:
            for att in msg.get("attachments", []):
                attachments.append({
                    "id": att["id"],
                    "filename": att["filename"],
                    "mime_type": att["mime_type"],
                    "size": att["size"],
                    "sender": msg.get("sender", ""),
                    "subject": msg.get("subject", ""),
                    "date": msg.get("received_at", ""),
                    "message_id": msg.get("gmail_message_id", "")
                })
        return attachments
