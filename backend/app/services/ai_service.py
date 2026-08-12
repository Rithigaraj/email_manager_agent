from app.core.config import settings

class AIService:
    @staticmethod
    def generate_email_content(prompt, tone="Professional", recipient="", category="general"):
        """
        Generates structured email subject and body using Google Gemini API or smart fallback.
        """
        api_key = (settings.GEMINI_API_KEY or "").strip()
        
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                system_instruction = f"You are an expert AI email copywriter. Write an effective email in a {tone} tone. The email is for category '{category}'."
                user_prompt = f"Target Recipient: {recipient}\nTopic/Instruction: {prompt}\nFormat output strictly as:\nSUBJECT: <Subject Line>\nBODY:\n<Email Body>"
                
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=f"{system_instruction}\n\n{user_prompt}"
                )
                
                text = response.text or ""
                subject, body = AIService._parse_ai_output(text, prompt)
                return {
                    "subject": subject,
                    "body": body,
                    "sentiment": AIService._derive_sentiment(tone),
                    "ai_generated": True
                }
            except Exception as e:
                print(f"[AIService Warning] Gemini API call failed: {str(e)}. Using fallback generator.")
        
        # Fallback AI Generator
        return AIService._fallback_generate(prompt, tone, recipient, category)

    @staticmethod
    def summarize_email(body):
        """
        Extracts key summary points and sentiment from email body.
        """
        api_key = (settings.GEMINI_API_KEY or "").strip()
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=f"Summarize this email into 2 concise sentences and analyze sentiment (Positive, Neutral, Urgent, or Persuasive):\n\n{body}"
                )
                return response.text.strip()
            except Exception as e:
                print(f"[AIService Warning] Gemini API call failed: {str(e)}")

        # Fallback Summary Logic
        sentences = [s.strip() for s in body.split('.') if len(s.strip()) > 5]
        summary = ". ".join(sentences[:2]) + "." if len(sentences) >= 2 else body[:150] + "..."
        return f"Summary: {summary}"

    @staticmethod
    def _parse_ai_output(text, fallback_prompt):
        subject = f"Follow-up regarding {fallback_prompt[:30]}"
        body = text
        if "SUBJECT:" in text and "BODY:" in text:
            parts = text.split("BODY:")
            subject_part = parts[0].replace("SUBJECT:", "").strip()
            body_part = parts[1].strip()
            if subject_part:
                subject = subject_part
            if body_part:
                body = body_part
        return subject, body

    @staticmethod
    def _derive_sentiment(tone):
        tone_map = {
            "Professional": "Confident",
            "Urgent": "Action-Required",
            "Persuasive": "Positive",
            "Friendly": "Warm & Positive",
            "Formal": "Neutral"
        }
        return tone_map.get(tone, "Neutral")

    @staticmethod
    def _fallback_generate(prompt, tone, recipient, category):
        greeting = f"Dear {recipient if recipient else 'Colleague'},"
        
        if tone.lower() == "urgent":
            subject = f"URGENT: {prompt[:40]}"
            body = f"{greeting}\n\nI am writing to urgently follow up on the following item:\n\n{prompt}\n\nPlease review this at your earliest convenience and let me know how we should proceed.\n\nBest regards,\nAI Email Assistant"
        elif tone.lower() == "persuasive":
            subject = f"Exciting Opportunity: {prompt[:40]}"
            body = f"{greeting}\n\nI hope this email finds you well. I wanted to highlight an incredible opportunity:\n\n{prompt}\n\nI would love to schedule a brief 10-minute call this week to discuss how we can collaborate.\n\nWarm regards,\nAI Email Assistant"
        elif tone.lower() == "friendly":
            subject = f"Checking in: {prompt[:40]}"
            body = f"Hi {recipient if recipient else 'there'},\n\nHope you're having a great week! Just reaching out regarding:\n\n{prompt}\n\nLet me know your thoughts whenever you get a moment.\n\nCheers,\nAI Email Assistant"
        else: # Professional / Formal
            subject = f"Regarding {prompt[:40]}"
            body = f"{greeting}\n\nI hope this email finds you well. I am reaching out to discuss:\n\n{prompt}\n\nPlease feel free to review the details and reach out if you have any questions.\n\nSincerely,\nAI Email Assistant"

        return {
            "subject": subject,
            "body": body,
            "sentiment": AIService._derive_sentiment(tone),
            "ai_generated": True
        }
