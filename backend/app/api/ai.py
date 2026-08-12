from typing import Dict, Any
from fastapi import APIRouter, Depends, Body
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.groq_service import groq_service
from app.services.ai_service import AIService
from app.schemas.ai import (
    SummarizeRequest, SummarizeResponse,
    ClassifyRequest, ClassifyResponse,
    ExtractActionsRequest, ExtractActionsResponse,
    NLSearchRequest, NLSearchResponse
)

router = APIRouter(prefix="/ai", tags=["AI Operations"])

@router.post("/summarize")
async def summarize_email(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user)
):
    body = payload.get("body") or ""
    subject = payload.get("subject") or ""
    sender = payload.get("sender") or ""
    if body:
        summary_text = AIService.summarize_email(body)
        return {"summary": summary_text, "category": "General", "important": False, "action_items": []}
    return await groq_service.summarize_email(
        subject=subject,
        sender=sender,
        body=body
    )

@router.post("/classify", response_model=ClassifyResponse)
async def classify_email(
    request: ClassifyRequest,
    current_user: User = Depends(get_current_user)
):
    return await groq_service.classify_email(
        subject=request.subject,
        body=request.body
    )

@router.post("/extract-actions", response_model=ExtractActionsResponse)
async def extract_actions(
    request: ExtractActionsRequest,
    current_user: User = Depends(get_current_user)
):
    return await groq_service.extract_action_items(
        subject=request.subject,
        body=request.body
    )

@router.post("/generate")
@router.post("/generate-reply")
async def generate_email_content(
    payload: Dict[str, Any] = Body(...),
    current_user: User = Depends(get_current_user)
):
    prompt = payload.get("prompt")
    tone = payload.get("tone") or payload.get("intent") or "Professional"
    recipient = payload.get("recipient") or payload.get("original_sender") or ""
    category = payload.get("category") or "general"
    
    if prompt:
        result = AIService.generate_email_content(
            prompt=prompt,
            tone=tone,
            recipient=recipient,
            category=category
        )
        result["draft"] = f"Subject: {result.get('subject')}\n\n{result.get('body')}"
        result["intent"] = tone
        return result
    
    # Handle reply generation format
    orig_subj = payload.get("original_subject", "Message")
    orig_sender = payload.get("original_sender", "sender")
    orig_body = payload.get("original_body", "")
    reply_res = await groq_service.generate_reply(
        subject=orig_subj,
        sender=orig_sender,
        body=orig_body,
        intent=tone
    )
    return {
        "subject": f"Re: {orig_subj}",
        "body": reply_res.draft,
        "draft": reply_res.draft,
        "sentiment": AIService._derive_sentiment(tone),
        "intent": tone
    }

@router.post("/nl-search", response_model=NLSearchResponse)
async def nl_search(
    request: NLSearchRequest,
    current_user: User = Depends(get_current_user)
):
    return await groq_service.convert_nl_search_to_gmail_query(prompt=request.prompt)
