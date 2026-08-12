from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

# tokenUrl is unused (we authenticate via the session cookie set by /auth/google/callback)
# but FastAPI's OpenAPI schema requires a value; auto_error=False lets us fall back to the cookie.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/google/url", auto_error=False)


def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Resolves the authenticated user from the Authorization header or, more
    commonly, the HTTP-only session cookie set after Google OAuth login.
    Raises 401 if there is no valid session -- there is no fallback/demo user.
    """
    session_token = token or request.cookies.get("session_token")

    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please sign in with Google.",
        )

    payload = decode_access_token(session_token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid. Please sign in again.",
        )

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists. Please sign in again.",
        )

    return user
