import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import EmailModal from './components/EmailModal';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Emails from './pages/Emails';
import AIAssistant from './pages/AIAssistant';
import Templates from './pages/Templates';
import { emailAPI } from './services/api';

const AppLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEmail = async (emailData) => {
    try {
      await emailAPI.createEmail(emailData);
      window.location.reload();
    } catch (err) {
      console.error("Failed creating email from navbar:", err);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar onOpenNewEmail={() => setIsModalOpen(true)} />
        <main className="page-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </main>
      </div>

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateEmail}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppLayout />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
