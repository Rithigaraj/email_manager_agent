import imaplib
import smtplib
import email
from email.header import decode_header
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.database.database import SessionLocal
from app.models import EmailMetadata
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

            db = SessionLocal()
            synced_count = 0
            fetched_emails = []

            try:
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
                            existing = db.query(EmailMetadata).filter(
                                EmailMetadata.user_id == user_id,
                                EmailMetadata.subject == subject,
                                EmailMetadata.recipient == from_header
                            ).first()
                            if not existing:
                                ai_summary = AIService.summarize_email(body)
                                new_email = EmailMetadata(
                                    user_id=user_id,
                                    gmail_message_id=e_id.decode("utf-8", errors="ignore"),
                                    sender=from_header,
                                    subject=subject,
                                    snippet=body[:120] + ("..." if len(body) > 120 else ""),
                                    category='general',
                                    is_important=False,
                                    is_read=False,
                                    is_starred=False,
                                    has_attachments=False,
                                    folder='INBOX'
                                )
                                db.add(new_email)
                                synced_count += 1
                                fetched_emails.append(new_email)

                db.commit()
            except Exception:
                db.rollback()
                raise
            finally:
                db.close()

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
