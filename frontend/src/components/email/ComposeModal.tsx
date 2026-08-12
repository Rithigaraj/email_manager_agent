import React, { useState } from 'react';
import { X, Send, Sparkles, Paperclip } from 'lucide-react';
import { api } from '../../services/api';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTo = '',
  initialSubject = '',
  initialBody = ''
}) => {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sending, setSending] = useState(false);
  const [aiIntent, setAiIntent] = useState('Professional');
  const [generatingAI, setGeneratingAI] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) return;

    try {
      setSending(true);
      await api.post('/emails/send', { to, subject, body });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to send email", err);
    } finally {
      setSending(false);
    }
  };

  const handleGenerateAIReply = async () => {
    try {
      setGeneratingAI(true);
      const res = await api.post('/ai/generate-reply', {
        original_subject: subject || 'New Message',
        original_sender: to || 'recipient@domain.com',
        original_body: body || 'Drafting a new message.',
        intent: aiIntent
      });
      if (res.data && res.data.draft) {
        setBody(res.data.draft);
      }
    } catch (err) {
      console.error("AI reply generation failed", err);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>New Email Message</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line..."
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>

          {/* AI Drafting Toolbar */}
          <div className="flex items-center gap-2 py-2 px-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-xs font-medium text-indigo-900 dark:text-indigo-200">AI Assistant Tone:</span>
            
            <select
              value={aiIntent}
              onChange={(e) => setAiIntent(e.target.value)}
              className="text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="Professional">Professional</option>
              <option value="Short">Short & Concise</option>
              <option value="Friendly">Friendly</option>
              <option value="Accept">Accept Offer</option>
              <option value="Decline">Polite Decline</option>
              <option value="Follow-up">Follow-up</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateAIReply}
              disabled={generatingAI}
              className="ml-auto px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-1"
            >
              {generatingAI ? 'Generating...' : 'Enhance Draft'}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write your email here or use AI Assistant to draft..."
              required
              className="w-full flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400">
              User must explicitly click Send. AI drafts are not sent automatically.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{sending ? 'Sending...' : 'Send Email'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
