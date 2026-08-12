import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Save, Loader2 } from 'lucide-react';
import { aiAPI } from '../services/api';

const EmailModal = ({ isOpen, onClose, onSave, emailToEdit = null }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: '',
    status: 'draft',
    category: 'general',
    ai_sentiment: 'Neutral',
  });
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [showAiSection, setShowAiSection] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (emailToEdit) {
      setFormData({
        recipient: emailToEdit.recipient || '',
        subject: emailToEdit.subject || '',
        body: emailToEdit.body || '',
        status: emailToEdit.status || 'draft',
        category: emailToEdit.category || 'general',
        ai_sentiment: emailToEdit.ai_sentiment || 'Neutral',
      });
    } else {
      setFormData({
        recipient: '',
        subject: '',
        body: '',
        status: 'draft',
        category: 'general',
        ai_sentiment: 'Neutral',
      });
    }
    setShowAiSection(false);
    setAiPrompt('');
  }, [emailToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAi(true);
    try {
      const response = await aiAPI.generateEmail({
        prompt: aiPrompt,
        tone: aiTone,
        recipient: formData.recipient,
        category: formData.category,
      });
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        subject: data.subject || prev.subject,
        body: data.body || prev.body,
        ai_sentiment: data.sentiment || prev.ai_sentiment,
      }));
      setShowAiSection(false);
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("Failed generating AI email content. Please try again.");
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = async (statusOverride = null) => {
    if (!formData.recipient || !formData.subject || !formData.body) {
      alert("Please fill out recipient, subject, and email body.");
      return;
    }
    setSaving(true);
    const finalData = {
      ...formData,
      status: statusOverride || formData.status,
    };
    await onSave(finalData, emailToEdit?.id);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
            {emailToEdit ? 'Edit Email' : 'Compose New Email'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* AI Quick Generator Drawer */}
        {!showAiSection ? (
          <div 
            onClick={() => setShowAiSection(true)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px dashed rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={18} color="#a855f7" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>Need help writing? Use AI Email Generator</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700 }}>Open AI Tools →</span>
          </div>
        ) : (
          <div className="glass-card" style={{ marginBottom: '1.25rem', background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(168, 85, 247, 0.3)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d8b4fe', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} /> AI Copywriter Assistant
              </span>
              <button onClick={() => setShowAiSection(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>Close</button>
            </div>
            
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="What is this email about? (e.g. Request a meeting to demo product)"
                className="form-input"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select className="form-select" value={aiTone} onChange={(e) => setAiTone(e.target.value)} style={{ width: '160px' }}>
                <option value="Professional">Professional</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Urgent">Urgent</option>
                <option value="Friendly">Friendly</option>
                <option value="Formal">Formal</option>
              </select>
              <button 
                onClick={handleAiGenerate} 
                disabled={generatingAi || !aiPrompt.trim()}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.55rem' }}
              >
                {generatingAi ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />} 
                {generatingAi ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          </div>
        )}

        {/* Standard Email Form */}
        <div className="form-group">
          <label className="form-label">Recipient Email</label>
          <input
            type="email"
            name="recipient"
            placeholder="client@company.com"
            className="form-input"
            value={formData.recipient}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
              <option value="general">General</option>
              <option value="inquiry">Inquiry</option>
              <option value="sales">Sales / Pitch</option>
              <option value="support">Support</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Email Subject Line"
            className="form-input"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Body</label>
          <textarea
            name="body"
            placeholder="Write your email body content here..."
            className="form-textarea"
            rows={6}
            value={formData.body}
            onChange={handleChange}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={() => handleSubmit('draft')} disabled={saving} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <Save size={16} /> Save Draft
          </button>
          <button onClick={() => handleSubmit('sent')} disabled={saving} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Send size={16} /> Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
