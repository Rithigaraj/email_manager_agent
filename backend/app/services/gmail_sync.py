import imaplib
import smtplib
import email
from email.header import decode_header
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.models import db, Email
from app.services.ai_service import AIService

class GmailSyncService:
    @staticmethod
    def fetch_live_gmail(user_id, gmail_user, app_password, max_emails=15):
        """
        Connects to real Gmail IMAP server (imap.gmail.com:993) and fetches real-time inbox messages.
        """
        try:
            # Clean app password (remove spaces)
            app_password = app_password.replace(" ", "")

            # Connect to Gmail IMAP SSL
            mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
            mail.login(gmail_user, app_password)
            mail.select("INBOX")

            # Search for all messages in inbox
            status, messages = mail.search(None, "ALL")
            if status != "OK":
                return {"success": False, "message": "Failed retrieving messages from Gmail inbox."}

            email_ids = messages[0].split()
            # Get latest max_emails
            recent_ids = email_ids[-max_emails:] if len(email_ids) > max_emails else email_ids
            recent_ids.reverse() # Most recent first

            synced_count = 0
            fetched_emails = []

            for e_id in recent_ids:
                res, msg_data = mail.fetch(e_id, "(RFC822)")
                if res != "OK":
                    continue

                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])

                        # Decode Subject
                        subject_header = msg["Subject"]
                        subject = "No Subject"
                        if subject_header:
                            decoded_parts = decode_header(subject_header)
                            subject_pieces = []
                            for part, encoding in decoded_parts:
                                if isinstance(part, bytes):
                                    subject_pieces.append(part.decode(encoding or "utf-8", errors="ignore"))
                                else:
                                    subject_pieces.append(str(part))
                            subject = "".join(subject_pieces)

                        # Sender
                        from_header = msg.get("From", "Unknown Sender")

                        # Extract Body Content
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    payload = part.get_payload(decode=True)
                                    if payload:
                                        body = payload.decode("utf-8", errors="ignore")
                                        break
                        else:
                            payload = msg.get_payload(decode=True)
                            if payload:
                                body = payload.decode("utf-8", errors="ignore")

                        if not body:
                            body = f"Email content from {from_header}"

                        # Check if already exists in DB to prevent duplicates
                        existing = Email.query.filter_by(user_id=user_id, subject=subject, recipient=from_header).first()
                        if not existing:
                            ai_summary = AIService.summarize_email(body)
                            new_email = Email(
                                user_id=user_id,
                                recipient=from_header,
                                subject=subject,
                                body=body[:2000], # Cap body length for DB storage
                                status='sent', # Inbox received
                                category='general',
                                ai_sentiment='Live Gmail',
                                ai_summary=ai_summary
                            )
                            db.session.add(new_email)
                            synced_count += 1
                            fetched_emails.append(new_email)

            db.session.commit()
            mail.logout()

            return {
                "success": True,
                "synced_count": synced_count,
                "message": f"Successfully synced {synced_count} real-time emails from Gmail inbox!"
            }

        except imaplib.IMAP4.error as e:
            return {"success": False, "message": f"Gmail Auth Error: Please ensure you are using a 16-character Google App Password. Error: {str(e)}"}
        except Exception as e:
            return {"success": False, "message": f"Failed syncing Gmail: {str(e)}"}

    @staticmethod
    def send_live_gmail(gmail_user, app_password, recipient, subject, body):
        """
        Connects to Gmail SMTP (smtp.gmail.com:587) and sends a real-time email to any recipient.
        """
        try:
            app_password = app_password.replace(" ", "")

            msg = MIMEMultipart()
            msg["From"] = gmail_user
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "plain"))

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(gmail_user, app_password)
            server.send_message(msg)
            server.quit()

            return {"success": True, "message": f"Real-time email sent successfully to {recipient} via Gmail SMTP!"}
        except Exception as e:
            return {"success": False, "message": f"Failed sending live email via Gmail SMTP: {str(e)}"}
