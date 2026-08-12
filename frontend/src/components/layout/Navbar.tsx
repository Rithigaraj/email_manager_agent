import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Sun, Moon, Bell, LogOut, User as UserIcon, Settings, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onOpenCompose?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenCompose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState('');
  const [isNLSearching, setIsNLSearching] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (isNLSearching) {
      try {
        const res = await api.post('/ai/nl-search', { prompt: searchInput });
        if (res.data && res.data.gmail_query) {
          if (onSearch) onSearch(res.data.gmail_query);
          navigate(`/inbox?q=${encodeURIComponent(res.data.gmail_query)}`);
        }
      } catch (err) {
        if (onSearch) onSearch(searchInput);
        navigate(`/inbox?q=${encodeURIComponent(searchInput)}`);
      }
    } else {
      if (onSearch) onSearch(searchInput);
      navigate(`/inbox?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent">
              MailPilot
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              AI Inbox Workspace
            </p>
          </div>
        </div>

        {/* Natural Language Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isNLSearching ? "Ask AI: e.g. 'Show internship emails from this month'..." : "Search emails or keywords..."}
              className={`w-full pl-10 pr-24 py-2 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                isNLSearching
                  ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 focus:ring-indigo-500/50 text-indigo-950 dark:text-indigo-100 placeholder-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 focus:ring-brand-500/50'
              }`}
            />
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            
            {/* AI Search Toggle */}
            <button
              type="button"
              onClick={() => setIsNLSearching(!isNLSearching)}
              className={`absolute right-2 px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                isNLSearching
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
              }`}
              title="Toggle AI Natural Language Search"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isNLSearching ? 'AI Search' : 'Normal'}</span>
            </button>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* New Email Button */}
          {onOpenCompose && (
            <button
              onClick={onOpenCompose}
              className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Compose</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.name || 'User'} className="h-8 w-8 rounded-lg object-cover ring-2 ring-brand-500/30" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'MailPilot User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@gmail.com'}</p>
                </div>

                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
