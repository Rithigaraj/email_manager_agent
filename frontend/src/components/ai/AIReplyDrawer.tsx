import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Scissors, Briefcase, Heart, X } from 'lucide-react';
import { api } from '../../services/api';

interface AIReplyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  originalSubject: string;
  originalSender: string;
  originalBody: string;
  onSendReply: (replyBody: string) => Promise<void>;
}

export const AIReplyDrawer: React.FC<AIReplyDrawerProps> = ({
  isOpen,
  onClose,
  originalSubject,
  originalSender,
  originalBody,
  onSendReply
}) => {
  const [intent, setIntent] = useState<string>('Professional');
  const [draft, setDraft] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async (selectedIntent: string) => {
    try {
      setLoading(true);
      setIntent(selectedIntent);
      const res = await api.post('/ai/generate-reply', {
        original_subject: originalSubject,
        original_sender: originalSender,
        original_body: originalBody,
        intent: selectedIntent
      });
      if (res.data && res.data.draft) {
        setDraft(res.data.draft);
      }
    } catch (err) {
      console.error("AI Reply error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!draft.trim()) return;
    try {
      setSending(true);
      await onSendReply(draft);
      onClose();
    } catch (err) {
      console.error("Sending reply failed", err);
    } finally {
      setSending(false);
    }
  };

  const intents = [
    { label: 'Professional', value: 'Professional', icon: Briefcase },
    { label: 'Short & Direct', value: 'Short', icon: Scissors },
    { label: 'Friendly', value: 'Friendly', icon: Heart },
    { label: 'Accept Offer', value: 'Accept', icon: Sparkles },
    { label: 'Decline', value: 'Decline', icon: X },
    { label: 'Follow-up', value: 'Follow-up', icon: RefreshCw },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/30 dark:to-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI Reply Generator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Craft perfect contextual email responses</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        {/* Intent Selectors */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Response Intent
          </label>
          <div className="grid grid-cols-2 gap-2">
            {intents.map((item) => {
              const Icon = item.icon;
              const isSelected = intent === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleGenerate(item.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Tone Polish Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Refine Tone
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleGenerate(intent)}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Regenerate
            </button>
            <button
              onClick={() => handleGenerate('Short')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
            >
              <Scissors className="h-3 w-3" /> Make Shorter
            </button>
            <button
              onClick={() => handleGenerate('Professional')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
            >
              <Briefcase className="h-3 w-3" /> Make Professional
            </button>
            <button
              onClick={() => handleGenerate('Friendly')}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
            >
              <Heart className="h-3 w-3" /> Make Friendly
            </button>
          </div>
        </div>

        {/* Editable Draft Area */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Generated Editable Reply Draft
          </label>
          {loading ? (
            <div className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
              Generating reply with Groq AI...
            </div>
          ) : (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              placeholder="Click a response intent above to generate an AI draft..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none leading-relaxed"
            />
          )}
        </div>

      </div>

      {/* Footer / Send Button */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 max-w-[200px]">
          User must explicitly click Send. AI drafts are not sent automatically.
        </p>
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>{sending ? 'Sending...' : 'Send Reply'}</span>
        </button>
      </div>

    </div>
  );
};
