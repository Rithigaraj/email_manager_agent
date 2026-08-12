import React from 'react';
import { Star, AlertCircle, Paperclip, CheckSquare } from 'lucide-react';
import { Email } from '../../types';

interface EmailRowProps {
  email: Email;
  onSelect: (id: string | number) => void;
  onToggleStar: (id: string | number, e: React.MouseEvent) => void;
  isSelected?: boolean;
}

export const EmailRow: React.FC<EmailRowProps> = ({
  email,
  onSelect,
  onToggleStar,
  isSelected
}) => {
  const getCategoryBadgeColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'internship':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'job':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'college':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'hackathon':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'finance':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const formattedDate = new Date(email.received_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      onClick={() => onSelect(email.gmail_message_id || email.id)}
      className={`group flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 cursor-pointer transition-all hover:bg-slate-100/70 dark:hover:bg-slate-800/50 ${
        !email.is_read ? 'bg-white dark:bg-slate-900 font-semibold' : 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400'
      } ${isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/40' : ''}`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => {}}
        onClick={(e) => e.stopPropagation()}
        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4 shrink-0 cursor-pointer"
      />

      {/* Star Toggle */}
      <button
        onClick={(e) => onToggleStar(email.gmail_message_id || email.id, e)}
        className="text-slate-300 hover:text-amber-400 dark:text-slate-700 dark:hover:text-amber-400 transition-colors p-1"
      >
        <Star className={`h-4 w-4 ${email.is_starred ? 'fill-amber-400 text-amber-400' : ''}`} />
      </button>

      {/* Important indicator */}
      {email.is_important && (
        <span title="Marked as Important">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
        </span>
      )}

      {/* Sender */}
      <div className="w-44 truncate text-sm text-slate-900 dark:text-slate-100 font-medium shrink-0">
        {email.sender.split('<')[0].replace(/"/g, '')}
      </div>

      {/* Category Tag */}
      <div className="shrink-0">
        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getCategoryBadgeColor(email.category)}`}>
          {email.category}
        </span>
      </div>

      {/* Subject & Preview */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {email.subject}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 truncate hidden md:inline">
          — {email.snippet}
        </span>
      </div>

      {/* Attachment Icon */}
      {email.has_attachments && (
        <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      )}

      {/* Timestamp */}
      <div className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-normal">
        {formattedDate}
      </div>
    </div>
  );
};
