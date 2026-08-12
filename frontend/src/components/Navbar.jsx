import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenNewEmail }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '70px',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
          Welcome back, <span style={{ color: '#818cf8' }}>{user?.name || 'User'}</span> 👋
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onOpenNewEmail && (
          <button className="btn btn-primary" onClick={onOpenNewEmail} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> New Email
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#fff',
          }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>{user?.email}</span>
        </div>

        <button 
          onClick={handleLogout}
          className="btn btn-secondary" 
          title="Sign out"
          style={{ padding: '0.5rem', borderRadius: '50%' }}
        >
          <LogOut size={16} color="#f43f5e" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
