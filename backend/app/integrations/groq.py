import logging
import httpx
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("mailpilot.groq")

class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_chat_completion(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> Optional[str]:
        """
        Sends a request to Groq API using HTTPX async client.
        Falls back gracefully if API key is not set or network fails.
        """
        if not self.api_key or self.api_key.startswith("gsk_your") or self.api_key == "mock_groq_api_key":
            logger.warning("Groq API key not configured or set to mock. Returning None for AI fallback.")
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": 1024
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(self.base_url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Groq API returned error status {response.status_code}: {response.text}")
                    return None
        except Exception as e:
            logger.error(f"Failed to communicate with Groq API: {str(e)}")
            return None

groq_client = GroqClient()
