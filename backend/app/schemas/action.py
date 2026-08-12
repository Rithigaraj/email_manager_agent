from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ActionItemBase(BaseModel):
    task: str
    deadline: Optional[str] = None
    priority: str = "Medium"
    status: str = "Pending"

class ActionItemCreate(ActionItemBase):
    email_id: Optional[int] = None

class ActionItemUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[str] = None
    task: Optional[str] = None

class ActionItemOut(ActionItemBase):
    id: int
    user_id: int
    email_id: Optional[int] = None
    created_at: datetime
    email_subject: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
