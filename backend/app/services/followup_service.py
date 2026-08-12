import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.followup import FollowUp
from app.models.user import User

class FollowupService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user

    def get_followups(self) -> List[dict]:
        followups = self.db.query(FollowUp).filter(FollowUp.user_id == self.user.id).all()
        if not followups:
            # Seed initial sample followups
            initial = [
                FollowUp(
                    user_id=self.user.id,
                    recipient="hr@innovate.co",
                    subject="Application for Software Engineer Position",
                    sent_at=datetime.datetime.utcnow() - datetime.timedelta(days=4),
                    status="No response"
                ),
                FollowUp(
                    user_id=self.user.id,
                    recipient="recruiter@techgig.com",
                    subject="Follow-up on Senior Developer Application",
                    sent_at=datetime.datetime.utcnow() - datetime.timedelta(days=7),
                    status="No response"
                )
            ]
            for f in initial:
                self.db.add(f)
            self.db.commit()
            followups = self.db.query(FollowUp).filter(FollowUp.user_id == self.user.id).all()

        results = []
        now = datetime.datetime.utcnow()
        for f in followups:
            days = (now - f.sent_at).days if f.sent_at else 0
            results.append({
                "id": f.id,
                "user_id": f.user_id,
                "email_id": f.email_id,
                "recipient": f.recipient,
                "subject": f.subject,
                "sent_at": f.sent_at,
                "days_waiting": days,
                "status": f.status,
                "created_at": f.created_at
            })
        return results

    def resolve_followup(self, followup_id: int) -> Optional[dict]:
        f = self.db.query(FollowUp).filter(FollowUp.id == followup_id, FollowUp.user_id == self.user.id).first()
        if f:
            f.status = "Resolved"
            self.db.commit()
            return {"id": f.id, "status": "Resolved"}
        return None
