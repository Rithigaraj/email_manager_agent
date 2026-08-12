import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Wand2, FileText, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Emails', path: '/emails', icon: Mail },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Wand2 },
    { label: 'Templates', path: '/templates', icon: FileText },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRight: '1px solid rgba(15, 23, 42, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      backdropFilter: 'blur(16px)',
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.5rem', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
        }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #0f172a 0%, #64748b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Email Hub
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.05em' }}>SMART MANAGER</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                color: isActive ? '#4f46e5' : '#64748b',
                background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="glass-card" style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles size={14} color="#a855f7" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7' }}>Gemini AI Ready</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.3 }}>
          Draft & summarize emails automatically with AI.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
