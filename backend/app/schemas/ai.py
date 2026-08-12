from typing import Optional, List
from pydantic import BaseModel

class SummarizeRequest(BaseModel):
    subject: str
    sender: str
    body: str

class SummarizeResponse(BaseModel):
    summary: str
    category: str
    important: bool
    action_items: List[str] = []
    deadline: Optional[str] = None

class ClassifyRequest(BaseModel):
    subject: str
    body: str

class ClassifyResponse(BaseModel):
    category: str
    confidence: float

class ActionItemExtracted(BaseModel):
    task: str
    deadline: Optional[str] = None
    priority: str = "Medium"

class ExtractActionsRequest(BaseModel):
    subject: str
    body: str

class ExtractActionsResponse(BaseModel):
    action_items: List[ActionItemExtracted]

class GenerateReplyRequest(BaseModel):
    original_subject: str
    original_sender: str
    original_body: str
    intent: str  # Professional, Short, Friendly, Accept, Decline, Request information, Follow-up

class GenerateReplyResponse(BaseModel):
    draft: str
    intent: str

class NLSearchRequest(BaseModel):
    prompt: str

class NLSearchResponse(BaseModel):
    gmail_query: str
    explanation: str
