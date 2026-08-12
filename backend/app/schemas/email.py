from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class AttachmentInfo(BaseModel):
    id: str
    filename: str
    mime_type: str
    size: int

class EmailMetadataSchema(BaseModel):
    id: int | str
    gmail_message_id: str
    thread_id: Optional[str] = None
    sender: str
    recipient: Optional[str] = None
    subject: str
    snippet: str
    received_at: datetime | str
    category: str = "Other"
    is_important: bool = False
    is_read: bool = False
    is_starred: bool = False
    has_attachments: bool = False
    folder: str = "INBOX"

    model_config = ConfigDict(from_attributes=True)

class EmailDetailSchema(EmailMetadataSchema):
    body_text: Optional[str] = None
    body_html: Optional[str] = None
    cc: Optional[str] = None
    attachments: List[AttachmentInfo] = []

class EmailSendRequest(BaseModel):
    to: str
    subject: str
    body: str
    cc: Optional[str] = None

class EmailReplyRequest(BaseModel):
    body: str

class EmailUpdateCategoryRequest(BaseModel):
    category: str
