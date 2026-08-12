import React, { useState } from 'react';
import { aiAPI, emailAPI } from '../services/api';
import { Sparkles, Copy, Check, Save, Wand2, RefreshCw, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [recipient, setRecipient] = useState('');
  const [category, setCategory] = useState('general');
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setCopied(false);
    try {
      const response = await aiAPI.generateEmail({
        prompt,
        tone,
        recipient,
        category,
      });
      setGeneratedOutput(response.data);
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("Failed generating AI content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    const fullText = `Subject: ${generatedOutput.subject}\n\n${generatedOutput.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsDraft = async () => {
    if (!generatedOutput) return;
    setSavingDraft(true);
    try {
      await emailAPI.createEmail({
        recipient: recipient || 'client@example.com',
        subject: generatedOutput.subject,
        body: generatedOutput.body,
        status: 'draft',
        category: category,
        ai_sentiment: generatedOutput.sentiment || 'Neutral',
      });
      alert("Email saved to Drafts successfully!");
      navigate('/emails');
    } catch (err) {
      console.error("Failed saving draft:", err);
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> POWERED BY GOOGLE GEMINI AI
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>AI Email Copywriter Workbench</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Generate high-converting email copy tailored to any tone or recipient</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Prompt & Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wand2 size={18} color="#6366f1" /> Prompt Specifications
          </h3>

          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Email Objective / Key Details</label>
              <textarea
                required
                className="form-textarea"
                rows={5}
                placeholder="E.g. Write a friendly follow-up email to John about our project proposal proposal. Mention a 15% early bird discount if confirmed by Friday."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tone & Style</label>
                <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option value="Professional">Professional</option>
                  <option value="Persuasive">Persuasive / Sales</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Friendly">Friendly & Warm</option>
                  <option value="Formal">Formal Executive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="general">General</option>
                  <option value="sales">Sales / Pitch</option>
                  <option value="inquiry">Inquiry</option>
                  <option value="support">Support</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Recipient (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="john.doe@acme.corp"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Generating Email...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Email Copy
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Generated Output Preview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Generated Result
            </h3>

            {generatedOutput && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button onClick={handleSaveAsDraft} disabled={savingDraft} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                  <Save size={14} /> {savingDraft ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            )}
          </div>

          {!generatedOutput ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              <Wand2 size={48} color="#334155" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: '#94a3b8' }}>Ready to Write</h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '300px', marginTop: '0.25rem' }}>
                Fill out the objective prompt on the left and click <strong>Generate Email Copy</strong>.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>Subject Line</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {generatedOutput.subject}
                </h4>
              </div>

              <div style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.925rem', color: '#e2e8f0' }}>
                {generatedOutput.body}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Detected Mood: <strong style={{ color: '#a855f7' }}>{generatedOutput.sentiment}</strong></span>
                <span>Tone: <strong style={{ color: '#818cf8' }}>{tone}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
