from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.action_service import ActionService
from app.schemas.action import ActionItemCreate, ActionItemUpdate, ActionItemOut

router = APIRouter(prefix="/actions", tags=["Action Items"])

@router.get("", response_model=List[ActionItemOut])
def get_action_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ActionService(db=db, user=current_user)
    return service.get_action_items()

@router.post("", response_model=ActionItemOut)
def create_action_item(
    request: ActionItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ActionService(db=db, user=current_user)
    item = service.create_action_item(
        task=request.task,
        deadline=request.deadline,
        priority=request.priority,
        email_id=request.email_id
    )
    return item

@router.put("/{action_id}")
def update_action_item(
    action_id: int,
    request: ActionItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ActionService(db=db, user=current_user)
    updated = service.update_action_item(
        item_id=action_id,
        status=request.status,
        priority=request.priority
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Action item not found.")
    return updated
