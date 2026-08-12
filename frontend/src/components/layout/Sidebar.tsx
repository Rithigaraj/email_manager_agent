import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Inbox, Star, AlertCircle, Send, FileText, Archive, Trash2,
  CheckSquare, Clock, Paperclip, LayoutDashboard, Sparkles, Folder
} from 'lucide-react';

interface SidebarProps {
  stats?: {
    unread_count?: number;
    important_count?: number;
    pending_actions?: number;
    waiting_replies?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ stats }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const currentQuery = new URLSearchParams(location.search).get('folder') || 'INBOX';

  const mailFolders = [
    { id: 'INBOX', name: 'Inbox', icon: Inbox, badge: stats?.unread_count, color: 'text-brand-600 dark:text-brand-400' },
    { id: 'IMPORTANT', name: 'Important', icon: AlertCircle, badge: stats?.important_count, color: 'text-amber-500' },
    { id: 'STARRED', name: 'Starred', icon: Star, color: 'text-yellow-500' },
    { id: 'SENT', name: 'Sent', icon: Send, color: 'text-emerald-500' },
    { id: 'DRAFTS', name: 'Drafts', icon: FileText, color: 'text-slate-400' },
    { id: 'ARCHIVE', name: 'Archive', icon: Archive, color: 'text-blue-500' },
    { id: 'TRASH', name: 'Trash', icon: Trash2, color: 'text-rose-500' },
  ];

  const aiWorkspaceItems = [
    { path: '/action-items', name: 'Action Items', icon: CheckSquare, badge: stats?.pending_actions, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    { path: '/followups', name: 'Follow-ups', icon: Clock, badge: stats?.waiting_replies, badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    { path: '/attachments', name: 'Attachments', icon: Paperclip },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-65px)] sticky top-[65px] p-3 space-y-6">
      
      {/* Dashboard Shortcut */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            currentPath === '/dashboard'
              ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Folders Section */}
      <div>
        <div className="px-3 mb-2 flex items-center justify-between text-xs font-bold tracking-wider text-slate-400 uppercase">
          <span>Mailboxes</span>
        </div>
        <nav className="space-y-1">
          {mailFolders.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === '/inbox' && currentQuery === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/inbox?folder=${item.id}`)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Workspace Tools */}
      <div>
        <div className="px-3 mb-2 flex items-center justify-between text-xs font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Workspace</span>
          </div>
        </div>
        <nav className="space-y-1">
          {aiWorkspaceItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
};
