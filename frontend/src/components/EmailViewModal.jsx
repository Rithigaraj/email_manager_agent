import React, { useState } from 'react';
import { X, Sparkles, Reply, Edit3, Trash2, Paperclip, Send, Loader2, CheckCircle } from 'lucide-react';
import { emailAPI } from '../services/api';
import EmailBody, { RenderHtmlText } from './EmailBody';

const EmailViewModal = ({ isOpen, onClose, email, onEdit, onDelete, onRefresh }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  if (!isOpen || !email) return null;

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      await emailAPI.createEmail({
        recipient: email.sender !== 'user@gmail.com' ? email.sender : email.recipient,
        subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
        body: replyText,
        status: 'sent',
        category: email.category || 'general',
      });
      setReplySentSuccess(true);
      setReplyText('');
      setTimeout(() => {
        setReplySentSuccess(false);
        setShowReplyBox(false);
        if (onRefresh) onRefresh();
      }, 1500);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  const formattedDate = email.created_at || email.received_at
    ? new Date(email.created_at || email.received_at).toLocaleString()
    : 'Unknown date';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className={`badge badge-${email.status || 'sent'}`}>{email.status || 'sent'}</span>
              <span className="badge badge-category">{email.category || 'general'}</span>
              {email.is_starred && <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★ Starred</span>}
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              {email.subject}
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Sender & Recipient Info */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(15, 23, 42, 0.1)',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          color: '#64748b',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong style={{ color: '#475569' }}>From:</strong> {email.sender || 'Unknown'}</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{formattedDate}</span>
          </div>
          <div><strong style={{ color: '#475569' }}>To:</strong> {email.recipient || 'Unknown'}</div>
        </div>

        {/* AI Summary Banner */}
        {email.ai_summary && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            color: '#d8b4fe',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#a855f7' }}>
                <Sparkles size={15} /> AI Summary
              </span>
              {email.ai_sentiment && (
                <span style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.2)', padding: '0.15rem 0.5rem', borderRadius: '12px', color: '#c084fc', fontWeight: 600 }}>
                  Sentiment: {email.ai_sentiment}
                </span>
              )}
            </div>
            <RenderHtmlText text={email.ai_summary} style={{ fontSize: '0.875rem' }} />
          </div>
        )}

        {/* Email Body */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(15, 23, 42, 0.1)',
          maxHeight: '260px',
          overflowY: 'auto',
          marginBottom: '1.25rem',
        }}>
          <EmailBody email={email} />
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Paperclip size={14} /> Attachments ({email.attachments.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {email.attachments.map((att, idx) => (
                <div key={idx} style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.04)',
          border: '1px solid rgba(15, 23, 42, 0.15)',
                  fontSize: '0.8rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <Paperclip size={14} color="#6366f1" />
                  <span>{att.filename}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({Math.round(att.size / 1024)} KB)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline Reply Drawer */}
        {showReplyBox && (
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Reply size={15} /> Replying to {email.sender !== 'user@gmail.com' ? email.sender : email.recipient}
              </span>
              <button onClick={() => setShowReplyBox(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>

            {replySentSuccess ? (
              <div style={{ padding: '0.75rem', textAlign: 'center', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <CheckCircle size={18} /> Reply sent successfully!
              </div>
            ) : (
              <>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Type your reply message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
                  >
                    {sendingReply ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="btn btn-primary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', gap: '0.4rem' }}
            >
              <Reply size={15} /> Reply
            </button>
            {onEdit && (
              <button
                onClick={() => { onClose(); onEdit(email); }}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Edit3 size={15} /> Edit
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onDelete && (
              <button
                onClick={() => { onClose(); onDelete(email.id); }}
                className="btn btn-danger"
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailViewModal;
