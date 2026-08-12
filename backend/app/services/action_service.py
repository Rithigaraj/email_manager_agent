from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.action_item import ActionItem
from app.models.user import User

class ActionService:
    def __init__(self, db: Session, user: User):
        self.db = db
        self.user = user

    def get_action_items(self) -> List[dict]:
        items = self.db.query(ActionItem).filter(ActionItem.user_id == self.user.id).all()
        if not items:
            # Seed initial sample action items for preview
            initial = [
                ActionItem(
                    user_id=self.user.id,
                    task="Submit updated resume and confirm interview availability for Data Science Internship",
                    deadline="August 12",
                    priority="High",
                    status="Pending"
                ),
                ActionItem(
                    user_id=self.user.id,
                    task="Review final AI capstone project rubric from Prof. Harrison",
                    deadline="August 20",
                    priority="Medium",
                    status="Pending"
                ),
                ActionItem(
                    user_id=self.user.id,
                    task="Complete AI Hackathon team pitch deck submission",
                    deadline="August 18",
                    priority="High",
                    status="Pending"
                )
            ]
            for item in initial:
                self.db.add(item)
            self.db.commit()
            items = self.db.query(ActionItem).filter(ActionItem.user_id == self.user.id).all()

        return [
            {
                "id": item.id,
                "user_id": item.user_id,
                "email_id": item.email_id,
                "task": item.task,
                "deadline": item.deadline,
                "priority": item.priority,
                "status": item.status,
                "created_at": item.created_at,
                "email_subject": "Data Science Internship Interview Shortlist" if item.id == 1 else "AI Project Rubric"
            }
            for item in items
        ]

    def create_action_item(self, task: str, deadline: Optional[str], priority: str, email_id: Optional[int] = None) -> ActionItem:
        item = ActionItem(
            user_id=self.user.id,
            email_id=email_id,
            task=task,
            deadline=deadline,
            priority=priority,
            status="Pending"
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_action_item(self, item_id: int, status: Optional[str] = None, priority: Optional[str] = None) -> Optional[ActionItem]:
        item = self.db.query(ActionItem).filter(ActionItem.id == item_id, ActionItem.user_id == self.user.id).first()
        if item:
            if status:
                item.status = status
            if priority:
                item.priority = priority
            self.db.commit()
            self.db.refresh(item)
        return item
