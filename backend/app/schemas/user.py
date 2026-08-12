from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class UserPreferenceBase(BaseModel):
    theme: str = "light"
    notification_enabled: bool = True
    default_category: str = "All"

class UserPreferenceOut(UserPreferenceBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: str
    username: Optional[str] = None
    name: Optional[str] = None
    profile_picture: Optional[str] = None

class UserOut(UserBase):
    id: int
    google_id: Optional[str] = None
    created_at: datetime
    preferences: Optional[UserPreferenceOut] = None

    model_config = ConfigDict(from_attributes=True)
