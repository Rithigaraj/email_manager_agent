import datetime
import logging
import base64
from typing import List, Dict, Any, Optional
from app.services.ai_service import AIService

logger = logging.getLogger("mailpilot.gmail_service")

MOCK_EMAILS = [
    {
        "id": "msg_001",
        "gmail_message_id": "msg_001",
        "thread_id": "thread_001",
        "sender": "recruitments@techcorp.com",
        "recipient": "user@gmail.com",
        "subject": "Data Science Internship Interview Shortlist",
        "snippet": "Congratulations! You have been shortlisted for our Data Science internship. Technical interview on August 15 at 10:30 AM...",
        "body_text": "Dear Applicant,\n\nCongratulations! You have been shortlisted for our Data Science internship.\nYour technical interview will be conducted on August 15 at 10:30 AM.\nPlease submit your updated resume and confirm your availability before August 12.\n\nBest regards,\nTechCorp Recruitment Team",
        "body_html": "<p>Dear Applicant,</p><p>Congratulations! You have been shortlisted for our <strong>Data Science internship</strong>.</p><p>Technical interview: <strong>August 15 at 10:30 AM</strong>.</p>",
        "body": "Dear Applicant,\n\nCongratulations! You have been shortlisted for our Data Science internship.\nYour technical interview will be conducted on August 15 at 10:30 AM.\nPlease submit your updated resume and confirm your availability before August 12.\n\nBest regards,\nTechCorp Recruitment Team",
        "received_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=2)).isoformat() + "Z",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=2)).isoformat() + "Z",
        "category": "inquiry",
        "status": "sent",
        "ai_sentiment": "Confident & Professional",
        "ai_summary": "Shortlist notification for Data Science internship technical interview on August 15 at 10:30 AM.",
        "is_important": True,
        "is_read": False,
        "is_starred": True,
        "has_attachments": True,
        "folder": "INBOX",
        "attachments": [
            {
                "id": "att_001",
                "filename": "Interview_Guidelines.pdf",
                "mime_type": "application/pdf",
                "size": 245000
            }
        ]
    },
    {
        "id": "msg_002",
        "gmail_message_id": "msg_002",
        "thread_id": "thread_002",
        "sender": "professor.harrison@university.edu",
        "recipient": "user@gmail.com",
        "subject": "Final Semester Project Deadline Extension",
        "snippet": "Hello students, regarding the AI capstone project, final submission deadline is extended to August 20...",
        "body_text": "Hello students,\n\nRegarding the AI capstone project, the final submission deadline has been extended to August 20.\nPlease review the updated grading rubric attached to this email.\nMake sure to upload your GitHub repository link to the portal.\n\nProf. Harrison",
        "body_html": "<p>Hello students,</p><p>Regarding the AI capstone project, final deadline extended to <strong>August 20</strong>.</p>",
        "body": "Hello students,\n\nRegarding the AI capstone project, the final submission deadline has been extended to August 20.\nPlease review the updated grading rubric attached to this email.\nMake sure to upload your GitHub repository link to the portal.\n\nProf. Harrison",
        "received_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=5)).isoformat() + "Z",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=5)).isoformat() + "Z",
        "category": "general",
        "status": "sent",
        "ai_sentiment": "Informative & Academic",
        "ai_summary": "Capstone project submission extended to August 20. Updated rubric attached.",
        "is_important": True,
        "is_read": False,
        "is_starred": False,
        "has_attachments": True,
        "folder": "INBOX",
        "attachments": [
            {
                "id": "att_002",
                "filename": "Project_Rubric_v2.docx",
                "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "size": 180000
            }
        ]
    },
    {
        "id": "msg_003",
        "gmail_message_id": "msg_003",
        "thread_id": "thread_003",
        "sender": "hackathon@globaltech.io",
        "recipient": "user@gmail.com",
        "subject": "AI Innovation Hackathon 2026 Registration Confirmed",
        "snippet": "Welcome to AI Innovation Hackathon! Your team registration is successful. Pitch submission closes on August 18...",
        "body_text": "Welcome to AI Innovation Hackathon 2026!\n\nYour team registration is confirmed. Key dates:\n- Opening Ceremony: August 14\n- Pitch submission deadline: August 18 at 11:59 PM.\n\nGood luck!",
        "body_html": "<p>Welcome to <strong>AI Innovation Hackathon 2026</strong>!</p><p>Team registration confirmed.</p>",
        "body": "Welcome to AI Innovation Hackathon 2026!\n\nYour team registration is confirmed. Key dates:\n- Opening Ceremony: August 14\n- Pitch submission deadline: August 18 at 11:59 PM.\n\nGood luck!",
        "received_at": (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat() + "Z",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat() + "Z",
        "category": "general",
        "status": "sent",
        "ai_sentiment": "Encouraging & Positive",
        "ai_summary": "Hackathon registration confirmation with opening ceremony on August 14.",
        "is_important": False,
        "is_read": True,
        "is_starred": True,
        "has_attachments": False,
        "folder": "INBOX",
        "attachments": []
    },
    {
        "id": "msg_004",
        "gmail_message_id": "msg_004",
        "thread_id": "thread_004",
        "sender": "notifications@bankofamerica.com",
        "recipient": "user@gmail.com",
        "subject": "Monthly Account Statement - July 2026",
        "snippet": "Your monthly bank statement for July 2026 is now available. Log in to your online banking account to view...",
        "body_text": "Dear Customer,\n\nYour monthly bank statement for July 2026 is ready.\nPlease review your account summary online.",
        "body_html": "<p>Dear Customer,</p><p>Your monthly bank statement for July 2026 is ready.</p>",
        "body": "Dear Customer,\n\nYour monthly bank statement for July 2026 is ready.\nPlease review your account summary online.",
        "received_at": (datetime.datetime.utcnow() - datetime.timedelta(days=2)).isoformat() + "Z",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=2)).isoformat() + "Z",
        "category": "support",
        "status": "sent",
        "ai_sentiment": "Formal & Financial",
        "ai_summary": "Monthly bank account statement for July 2026 available for online review.",
        "is_important": False,
        "is_read": True,
        "is_starred": False,
        "has_attachments": True,
        "folder": "INBOX",
        "attachments": [
            {
                "id": "att_003",
                "filename": "Bank_Statement_July_2026.pdf",
                "mime_type": "application/pdf",
                "size": 512000
            }
        ]
    },
    {
        "id": "msg_005",
        "gmail_message_id": "msg_005",
        "thread_id": "thread_005",
        "sender": "user@gmail.com",
        "recipient": "hr@innovate.co",
        "subject": "DRAFT: Product Integration & Q4 Strategic Outreach",
        "snippet": "Dear HR Team, I am writing to express my strong interest in the Software Engineer role at Innovate Co...",
        "body_text": "Dear HR Team,\n\nI am writing to express my strong interest in the Software Engineer role at Innovate Co.\nAttached is my resume for your consideration.\n\nSincerely,\nMailPilot User",
        "body_html": "<p>Dear HR Team,</p><p>Writing to express interest in Software Engineer role at Innovate Co.</p>",
        "body": "Dear HR Team,\n\nI am writing to express my strong interest in the Software Engineer role at Innovate Co.\nAttached is my resume for your consideration.\n\nSincerely,\nMailPilot User",
        "received_at": (datetime.datetime.utcnow() - datetime.timedelta(days=4)).isoformat() + "Z",
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(days=4)).isoformat() + "Z",
        "category": "sales",
        "status": "draft",
        "ai_sentiment": "Confident & Ambitious",
        "ai_summary": "Draft software engineering application email for Innovate Co.",
        "is_important": True,
        "is_read": True,
        "is_starred": False,
        "has_attachments": True,
        "folder": "DRAFTS",
        "attachments": [
            {
                "id": "att_004",
                "filename": "Resume_Software_Engineer.pdf",
                "mime_type": "application/pdf",
                "size": 340000
            }
        ]
    }
]

class GmailService:
    def __init__(self, user=None):
        self.user = user

    def fetch_emails(self, folder: str = None, status: str = None, category: str = None, query: str = None, page_token: str = None, max_results: int = 50) -> Dict[str, Any]:
        """
        Fetches email list. Uses real Google API if user access_token exists, or returns structured mock emails.
        """
        if self.user and self.user.access_token and self.user.access_token != "mock_token":
            try:
                from google.oauth2.credentials import Credentials
                from googleapiclient.discovery import build
                
                creds = Credentials(
                    token=self.user.access_token,
                    refresh_token=self.user.refresh_token,
                    token_uri=self.user.token_uri or "https://oauth2.googleapis.com/token",
                    client_id=self.user.client_id,
                    client_secret=self.user.client_secret,
                    scopes=self.user.scopes.split(" ") if self.user.scopes else []
                )
                service = build('gmail', 'v1', credentials=creds)
                
                q_param = ""
                if folder and folder != "INBOX":
                    q_param = f"label:{folder}"
                if query:
                    q_param = f"{q_param} {query}".strip()
                
                results = service.users().messages().list(
                    userId='me', q=q_param, pageToken=page_token, maxResults=max_results
                ).execute()
                
                messages = results.get('messages', [])
                email_list = []
                for msg_ref in messages:
                    msg = service.users().messages().get(userId='me', id=msg_ref['id'], format='full').execute()
                    email_list.append(self._parse_gmail_message(msg))
                
                # Apply status / category filtering on real email list if specified
                if status and status != "all":
                    email_list = [e for e in email_list if e.get("status", "").lower() == status.lower()]
                if category and category != "all":
                    email_list = [e for e in email_list if e.get("category", "").lower() == category.lower()]
                    
                return {
                    "emails": email_list,
                    "next_page_token": results.get('nextPageToken'),
                    "result_size_estimate": results.get('resultSizeEstimate', len(email_list))
                }
            except Exception as e:
                logger.error(f"Gmail API error, falling back to local data: {e}")

        # Fallback local data
        filtered = list(MOCK_EMAILS)

        if status and status != "all":
            filtered = [e for e in filtered if e.get("status", "").lower() == status.lower()]
        elif folder and folder != "INBOX":
            if folder == "SENT":
                filtered = [e for e in filtered if e.get("folder") == "SENT" or e.get("status") == "sent"]
            elif folder == "DRAFTS":
                filtered = [e for e in filtered if e.get("folder") == "DRAFTS" or e.get("status") == "draft"]
            elif folder == "STARRED":
                filtered = [e for e in filtered if e.get("is_starred")]
            elif folder == "IMPORTANT":
                filtered = [e for e in filtered if e.get("is_important")]

        if category and category != "all":
            filtered = [e for e in filtered if e.get("category", "").lower() == category.lower()]

        if query:
            q_lower = query.lower()
            filtered = [
                e for e in filtered
                if q_lower in e.get("subject", "").lower()
                or q_lower in e.get("body", "").lower()
                or q_lower in e.get("recipient", "").lower()
                or q_lower in e.get("sender", "").lower()
            ]

        return {
            "emails": filtered,
            "next_page_token": None,
            "result_size_estimate": len(filtered)
        }

    def get_email_detail(self, message_id: str) -> Optional[Dict[str, Any]]:
        if self.user and self.user.access_token and self.user.access_token != "mock_token":
            try:
                from google.oauth2.credentials import Credentials
                from googleapiclient.discovery import build
                creds = Credentials(
                    token=self.user.access_token,
                    refresh_token=self.user.refresh_token,
                    token_uri=self.user.token_uri or "https://oauth2.googleapis.com/token",
                    client_id=self.user.client_id,
                    client_secret=self.user.client_secret,
                    scopes=self.user.scopes.split(" ") if self.user.scopes else []
                )
                service = build('gmail', 'v1', credentials=creds)
                msg = service.users().messages().get(userId='me', id=message_id, format='full').execute()
                return self._parse_gmail_message(msg)
            except Exception as e:
                logger.error(f"Gmail detail fetch error: {e}")

        for msg in MOCK_EMAILS:
            if str(msg["gmail_message_id"]) == str(message_id) or str(msg["id"]) == str(message_id):
                return msg
        return None

    def create_email(self, data: Dict[str, Any]) -> Dict[str, Any]:
        timestamp = int(datetime.datetime.utcnow().timestamp())
        recipient = data.get("recipient") or data.get("to") or "client@example.com"
        subject = data.get("subject") or "Untitled Email"
        body = data.get("body") or ""
        status = data.get("status") or "sent"
        category = data.get("category") or "general"
        ai_sentiment = data.get("ai_sentiment") or AIService._derive_sentiment("Professional")
        ai_summary = AIService.summarize_email(body)

        new_msg = {
            "id": f"msg_{timestamp}",
            "gmail_message_id": f"msg_{timestamp}",
            "thread_id": f"thread_{timestamp}",
            "sender": self.user.email if self.user and self.user.email else "user@gmail.com",
            "recipient": recipient,
            "subject": subject,
            "snippet": body[:120] + ("..." if len(body) > 120 else ""),
            "body_text": body,
            "body_html": f"<p>{body.replace('\n', '<br>')}</p>",
            "body": body,
            "received_at": datetime.datetime.utcnow().isoformat() + "Z",
            "created_at": datetime.datetime.utcnow().isoformat() + "Z",
            "category": category,
            "status": status,
            "ai_sentiment": ai_sentiment,
            "ai_summary": ai_summary,
            "is_important": False,
            "is_read": True,
            "is_starred": False,
            "has_attachments": False,
            "folder": "SENT" if status == "sent" else "DRAFTS",
            "attachments": []
        }
        MOCK_EMAILS.insert(0, new_msg)
        return {"status": "success", "message": "Email created successfully", "email": new_msg}

    def update_email(self, message_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        for msg in MOCK_EMAILS:
            if str(msg["gmail_message_id"]) == str(message_id) or str(msg["id"]) == str(message_id):
                if "recipient" in data:
                    msg["recipient"] = data["recipient"]
                if "subject" in data:
                    msg["subject"] = data["subject"]
                if "body" in data:
                    msg["body"] = data["body"]
                    msg["body_text"] = data["body"]
                    msg["body_html"] = f"<p>{data['body'].replace('\n', '<br>')}</p>"
                    msg["snippet"] = data["body"][:120] + ("..." if len(data["body"]) > 120 else "")
                    msg["ai_summary"] = AIService.summarize_email(data["body"])
                if "status" in data:
                    msg["status"] = data["status"]
                    msg["folder"] = "SENT" if data["status"] == "sent" else "DRAFTS"
                if "category" in data:
                    msg["category"] = data["category"]
                if "ai_sentiment" in data:
                    msg["ai_sentiment"] = data["ai_sentiment"]
                return {"status": "success", "message": "Email updated successfully", "email": msg}
        return {"status": "error", "message": "Email not found"}

    def send_email(self, to: str, subject: str, body: str, cc: Optional[str] = None) -> Dict[str, Any]:
        return self.create_email({"recipient": to, "subject": subject, "body": body, "status": "sent"})

    def update_email_status(self, message_id: str, is_read: Optional[bool] = None, is_starred: Optional[bool] = None, is_important: Optional[bool] = None, is_archived: Optional[bool] = None) -> Dict[str, Any]:
        for msg in MOCK_EMAILS:
            if str(msg["gmail_message_id"]) == str(message_id) or str(msg["id"]) == str(message_id):
                if is_read is not None:
                    msg["is_read"] = is_read
                if is_starred is not None:
                    msg["is_starred"] = is_starred
                if is_important is not None:
                    msg["is_important"] = is_important
                if is_archived:
                    msg["folder"] = "ARCHIVE"
                return {"status": "success", "message": msg}
        return {"status": "error", "message": "Email not found"}

    def delete_email(self, message_id: str) -> Dict[str, Any]:
        global MOCK_EMAILS
        MOCK_EMAILS = [msg for msg in MOCK_EMAILS if str(msg["gmail_message_id"]) != str(message_id) and str(msg["id"]) != str(message_id)]
        return {"status": "success", "message_id": message_id}

    def _extract_body(self, msg: dict) -> str:
        payload = msg.get("payload", {})
        body_data = ""
        
        def parse_parts(parts):
            nonlocal body_data
            for part in parts:
                mime = part.get("mimeType", "")
                data = part.get("body", {}).get("data")
                if data and mime == "text/plain":
                    try:
                        body_data = base64.urlsafe_b64decode(data.encode("ASCII")).decode("utf-8", errors="ignore")
                        return
                    except Exception:
                        pass
                elif part.get("parts"):
                    parse_parts(part.get("parts"))
                    if body_data:
                        return

        if "parts" in payload:
            parse_parts(payload["parts"])
        elif payload.get("body", {}).get("data"):
            data = payload["body"]["data"]
            try:
                body_data = base64.urlsafe_b64decode(data.encode("ASCII")).decode("utf-8", errors="ignore")
            except Exception:
                pass
            
        return body_data if body_data else msg.get("snippet", "No body content available.")

    def _extract_html_body(self, msg: dict) -> str:
        """Extracts the HTML body payload from a Gmail message, if present."""
        payload = msg.get("payload", {})
        html_data = ""

        def parse_parts(parts):
            nonlocal html_data
            for part in parts:
                mime = part.get("mimeType", "")
                data = part.get("body", {}).get("data")
                if data and mime == "text/html":
                    try:
                        html_data = base64.urlsafe_b64decode(data.encode("ASCII")).decode("utf-8", errors="ignore")
                        return
                    except Exception:
                        pass
                elif part.get("parts"):
                    parse_parts(part.get("parts"))
                    if html_data:
                        return

        if "parts" in payload:
            parse_parts(payload["parts"])
        elif payload.get("body", {}).get("data"):
            data = payload["body"]["data"]
            try:
                html_data = base64.urlsafe_b64decode(data.encode("ASCII")).decode("utf-8", errors="ignore")
            except Exception:
                pass

        return html_data

    def _parse_gmail_message(self, msg: dict) -> dict:
        headers = {h['name']: h['value'] for h in msg.get('payload', {}).get('headers', [])}
        body = self._extract_body(msg)
        body_html = self._extract_html_body(msg)
        if not body or body == msg.get("snippet", "") and body_html:
            body = body_html or body
        date_str = headers.get('Date', datetime.datetime.utcnow().isoformat() + "Z")
        sender = headers.get('From', '')
        recipient = headers.get('To', '')
        subject = headers.get('Subject', '(No Subject)')
        label_ids = msg.get('labelIds', [])
        status = "sent" if 'SENT' in label_ids else "draft" if 'DRAFT' in label_ids else "sent"
        ai_summary = AIService.summarize_email(body)
        ai_sentiment = AIService._derive_sentiment("Professional")

        return {
            "id": msg['id'],
            "gmail_message_id": msg['id'],
            "thread_id": msg.get('threadId'),
            "sender": sender,
            "recipient": recipient,
            "subject": subject,
            "snippet": msg.get('snippet', body[:120]),
            "body_text": None if body == body_html else body,
            "body_html": body_html,
            "body": body,
            "received_at": date_str,
            "created_at": date_str,
            "category": "general",
            "status": status,
            "ai_sentiment": ai_sentiment,
            "ai_summary": ai_summary,
            "is_important": 'IMPORTANT' in label_ids,
            "is_read": 'UNREAD' not in label_ids,
            "is_starred": 'STARRED' in label_ids,
            "has_attachments": len(msg.get('payload', {}).get('parts', [])) > 1,
            "folder": "SENT" if status == "sent" else "INBOX"
        }
