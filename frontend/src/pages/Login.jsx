import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"/>
    <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.8 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.9 39.6 16.4 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.4 5.4C40.8 36.3 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"/>
  </svg>
);

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      // Browser is redirected to Google here; nothing else to do.
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not start Google sign-in. Make sure the server has Google OAuth configured.'
      );
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
          }}>
            <Sparkles size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Welcome to MailPilot</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
            Turn your inbox into an organized workspace.
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#be123c',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            background: '#fff',
            color: '#1f2937',
            border: '1px solid rgba(15, 23, 42, 0.15)',
          }}
        >
          <GoogleIcon />
          {loading ? 'Redirecting to Google...' : 'Continue with Google'}
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = '/api/auth/mock-login';
          }}
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            marginTop: '1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          <span>Continue with Mock Account (Local Dev)</span>
        </button>


        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          MailPilot connects to your Gmail account via Google's secure sign-in.
          We never see or store your Google password.
        </p>
      </div>
    </div>
  );
};

export default Login;
