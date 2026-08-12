import React from 'react';
import { Email } from '../../types';
import { EmailRow } from './EmailRow';
import { Inbox, CheckCircle2 } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (id: string | number) => void;
  onToggleStar: (id: string | number, e: React.MouseEvent) => void;
  selectedId?: string | number;
  loading?: boolean;
  folderName?: string;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  onSelectEmail,
  onToggleStar,
  selectedId,
  loading,
  folderName = 'Inbox'
}) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-14 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center my-8">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Your inbox is clean
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
          No emails found in <span className="font-semibold text-slate-700 dark:text-slate-300">{folderName}</span> right now.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
      {emails.map((email) => (
        <EmailRow
          key={email.gmail_message_id || email.id}
          email={email}
          onSelect={onSelectEmail}
          onToggleStar={onToggleStar}
          isSelected={(email.gmail_message_id || email.id) === selectedId}
        />
      ))}
    </div>
  );
};
