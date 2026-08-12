import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class EmailMetadata(Base):
    __tablename__ = "email_metadata"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    gmail_message_id = Column(String(255), index=True, nullable=False)
    thread_id = Column(String(255), nullable=True)
    sender = Column(String(255), nullable=True)
    recipient = Column(String(255), nullable=True)
    subject = Column(String(500), nullable=True)
    snippet = Column(Text, nullable=True)
    received_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    category = Column(String(100), default="Other", index=True)
    is_important = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    has_attachments = Column(Boolean, default=False)
    folder = Column(String(50), default="INBOX", index=True)

    # Relationships
    user = relationship("User", back_populates="emails")
    summary = relationship("EmailSummary", back_populates="email_metadata", uselist=False, cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="email_metadata", cascade="all, delete-orphan")
    followups = relationship("FollowUp", back_populates="email_metadata", cascade="all, delete-orphan")

class EmailSummary(Base):
    __tablename__ = "email_summaries"

    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(Integer, ForeignKey("email_metadata.id", ondelete="CASCADE"), nullable=False, unique=True)
    summary = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    action_item_text = Column(Text, nullable=True)
    deadline = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    email_metadata = relationship("EmailMetadata", back_populates="summary")
