import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    
    # Default MySQL database URI with fallback mechanism
    MYSQL_DB_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/ai_email_db")
    SQLITE_FALLBACK_URL = "sqlite:///ai_email.db"
    
    # We set default SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_DATABASE_URI = MYSQL_DB_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
