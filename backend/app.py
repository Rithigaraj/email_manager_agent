import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from app.main import app

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print(f"-> MailPilot Backend Server running on http://127.0.0.1:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)