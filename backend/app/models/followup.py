import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class FollowUp(Base):
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    email_id = Column(Integer, ForeignKey("email_metadata.id", ondelete="SET NULL"), nullable=True)
    recipient = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="No response", index=True)  # No response, Resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="followups")
    email_metadata = relationship("EmailMetadata", back_populates="followups")
