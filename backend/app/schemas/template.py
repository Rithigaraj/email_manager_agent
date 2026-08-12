from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class TemplateCreate(BaseModel):
    name: str
    subject_template: str
    body_template: str
    category: Optional[str] = "general"

class TemplateOut(BaseModel):
    id: int
    user_id: int
    name: str
    subject_template: str
    body_template: str
    category: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
