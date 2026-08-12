import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ComposeModal } from '../email/ComposeModal';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';

export const MainLayout: React.FC = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | undefined>(undefined);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.warn("Failed to fetch sidebar stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar onOpenCompose={() => setIsComposeOpen(true)} />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar stats={stats} />
        
        <main className="flex-1 p-6 overflow-y-auto min-h-[calc(100vh-65px)]">
          <Outlet context={{ refreshStats: fetchStats, openCompose: () => setIsComposeOpen(true) }} />
        </main>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
};
