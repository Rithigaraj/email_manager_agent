import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MailPilot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment & URLs
    FRONTEND_URL: str = "http://localhost:8000"
    BACKEND_URL: str = "http://localhost:8000"
    
    # Database
    DATABASE_URL: str = "sqlite:///./mailpilot.db"
    
    # Security
    APP_SECRET_KEY: str = "mailpilot_super_secret_jwt_key_change_in_production_32_chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Google OAuth & Gmail
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    
    # Groq AI
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Google Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-flash-latest"
    
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), "..", "..", ".env"), case_sensitive=True, extra="ignore")

settings = Settings()
