import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import EmailModal from '../components/EmailModal';
import EmailViewModal from '../components/EmailViewModal';
import { dashboardAPI, emailAPI } from '../services/api';
import { Mail, Send, FileEdit, FileText, Sparkles, Clock, ArrowUpRight, Plus, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.stats);
      setRecentActivity(response.data.recent_activity);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveEmail = async (emailData) => {
    try {
      await emailAPI.createEmail(emailData);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed creating email:", err);
    }
  };

  const handleDeleteEmail = async (id) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;
    try {
      await emailAPI.deleteEmail(id);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed deleting email:", err);
    }
  };

  if (loading) {
    return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading dashboard analytics...</div>;
  }

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> AI POWERED WORKFLOWS
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
            Email Operations Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '600px' }}>
            Manage drafts, track outreach statistics, and leverage AI copy generation for instant high-converting emails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/ai-assistant')}>
            <Sparkles size={18} color="#a855f7" /> AI Copywriter
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Compose Email
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Total Emails"
          value={stats?.total_emails || 0}
          icon={Mail}
          color="#6366f1"
          trend="Total in Hub"
        />
        <StatCard
          title="Sent Outreach"
          value={stats?.sent_count || 0}
          icon={Send}
          color="#10b981"
          trend="Successfully Sent"
        />
        <StatCard
          title="Active Drafts"
          value={stats?.draft_count || 0}
          icon={FileEdit}
          color="#f59e0b"
          trend="In Progress"
        />
        <StatCard
          title="Email Templates"
          value={stats?.templates_count || 0}
          icon={FileText}
          color="#a855f7"
          trend="Reusable Snippets"
        />
      </div>

      {/* Grid Content: Activity Feed & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity List */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#818cf8" /> Recent Activity
            </h3>
            <button className="btn btn-secondary" onClick={() => navigate('/emails')} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No recent emails found. Click <strong>Compose Email</strong> to create your first email!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEmail(item)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                      <span className="badge badge-category">{item.category}</span>
                      {item.ai_sentiment && (
                        <span style={{ fontSize: '0.7rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.08)', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                          Mood: {item.ai_sentiment}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.subject}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      To: {item.recipient}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedEmail(item); }} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}
                    >
                      <Eye size={14} /> Open
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteEmail(item.id); }} 
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '0.4rem' }}
                      title="Delete email"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown Widget */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Category Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(stats?.category_breakdown || {}).length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No categorized data yet.</p>
            ) : (
              Object.entries(stats?.category_breakdown || {}).map(([cat, count]) => {
                const percentage = stats.total_emails > 0 ? Math.round((count / stats.total_emails) * 100) : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                      <span style={{ color: '#94a3b8' }}>{count} ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmail}
      />

      {/* View Email Detail Modal */}
      <EmailViewModal
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        email={selectedEmail}
        onDelete={handleDeleteEmail}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
