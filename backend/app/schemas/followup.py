from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class FollowUpBase(BaseModel):
    recipient: str
    subject: Optional[str] = None
    status: str = "No response"

class FollowUpCreate(FollowUpBase):
    email_id: Optional[int] = None

class FollowUpOut(FollowUpBase):
    id: int
    user_id: int
    email_id: Optional[int] = None
    sent_at: datetime
    days_waiting: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
