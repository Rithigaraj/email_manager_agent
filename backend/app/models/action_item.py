import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    email_id = Column(Integer, ForeignKey("email_metadata.id", ondelete="SET NULL"), nullable=True)
    task = Column(Text, nullable=False)
    deadline = Column(String(255), nullable=True)
    priority = Column(String(50), default="Medium")  # High, Medium, Low
    status = Column(String(50), default="Pending", index=True)  # Pending, Completed, Overdue
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="action_items")
    email_metadata = relationship("EmailMetadata", back_populates="action_items")
