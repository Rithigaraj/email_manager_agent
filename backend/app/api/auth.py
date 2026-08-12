import logging
import httpx
from fastapi import APIRouter, Depends, Response, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.integrations.google import (
    get_google_auth_url,
    exchange_code_for_token,
    get_google_user_info,
    GOOGLE_TOKEN_URL,
)
from app.models.user import User
from app.schemas.user import UserOut

logger = logging.getLogger("mailpilot.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/google/url")
def google_auth_url():
    """Returns the Google OAuth 2.0 consent screen URL."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured on the server. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.",
        )
    return {"url": get_google_auth_url()}


@router.get("/google/callback")
async def google_auth_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """
    Handles the Google OAuth callback: exchanges the authorization code for real
    tokens, fetches the real Google profile, upserts the user, and sets a secure
    HTTP-only session cookie. Never fabricates user or token data.
    """
    if error:
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {error}")
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code from Google.")

    try:
        token_data = await exchange_code_for_token(code)
    except httpx.HTTPStatusError as e:
        logger.error(f"Google token exchange failed: {e.response.text}")
        raise HTTPException(status_code=400, detail="Failed to exchange authorization code with Google.")
    except httpx.HTTPError as e:
        logger.error(f"Google token exchange network error: {e}")
        raise HTTPException(status_code=502, detail="Could not reach Google's token endpoint.")

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")  # only present on first consent (access_type=offline, prompt=consent)
    scopes = token_data.get("scope", "")

    if not access_token:
        raise HTTPException(status_code=400, detail="Google did not return an access token.")

    try:
        profile = await get_google_user_info(access_token)
    except httpx.HTTPError as e:
        logger.error(f"Failed to fetch Google user profile: {e}")
        raise HTTPException(status_code=502, detail="Could not fetch Google profile.")

    google_id = profile.get("sub")
    email = profile.get("email")
    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Incomplete Google profile response.")

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = User(google_id=google_id, email=email)
        db.add(user)

    user.email = email
    user.name = profile.get("name")
    user.profile_picture = profile.get("picture")
    user.access_token = access_token
    # Google only returns refresh_token on the first authorization; keep the existing one otherwise.
    if refresh_token:
        user.refresh_token = refresh_token
    user.token_uri = GOOGLE_TOKEN_URL
    user.client_id = settings.GOOGLE_CLIENT_ID
    user.client_secret = settings.GOOGLE_CLIENT_SECRET
    user.scopes = scopes

    db.commit()
    db.refresh(user)

    if not user.refresh_token:
        logger.warning(
            f"User {user.email} has no refresh_token on file. If this persists, "
            "revoke app access at https://myaccount.google.com/permissions and reconnect "
            "so Google issues a new one (prompt=consent should normally prevent this)."
        )

    session_token = create_access_token(subject=user.id)
    response = RedirectResponse(url=settings.FRONTEND_URL)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=settings.BACKEND_URL.startswith("https"),
    )
    return response


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns profile information for the authenticated user."""
    return current_user


@router.post("/logout")
def logout(response: Response):
    """Logs out the user by clearing the session cookie."""
    response.delete_cookie(key="session_token")
    return {"status": "success", "message": "Logged out successfully"}


@router.get("/mock-login")
def mock_login(db: Session = Depends(get_db)):
    """
    Bypasses Google OAuth for local development / testing by signing in as the mock user.
    """
    user = db.query(User).filter(User.email == "user@gmail.com").first()
    if not user:
        user = User(
            google_id="google_mock_12345",
            email="user@gmail.com",
            name="Alex Morgan",
            profile_picture="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
            access_token="mock_token",
            refresh_token="mock_refresh",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    session_token = create_access_token(subject=user.id)
    response = RedirectResponse(url=settings.FRONTEND_URL)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=settings.BACKEND_URL.startswith("https"),
    )
    return response

