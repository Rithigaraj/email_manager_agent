import React, { useState, useEffect } from 'react';
import { emailAPI } from '../services/api';
import EmailModal from '../components/EmailModal';
import EmailViewModal from '../components/EmailViewModal';
import { Search, Plus, Trash2, Edit3, Sparkles, Filter, Mail, ChevronDown, ChevronUp, Eye } from 'lucide-react';

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [expandedEmailId, setExpandedEmailId] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEmails = async (pageToken = null) => {
    if (pageToken) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await emailAPI.getEmails({
        status: statusFilter,
        category: categoryFilter,
        search: searchQuery,
        page_token: pageToken,
      });
      const page = response.data.emails || [];
      setEmails((prev) => (pageToken ? [...prev, ...page] : page));
      setNextPageToken(response.data.next_page_token || null);
    } catch (err) {
      console.error("Failed fetching emails:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleOpenCompose = (email = null) => {
    setEditingEmail(email);
    setIsModalOpen(true);
  };

  const handleSaveEmail = async (emailData, id = null) => {
    try {
      if (id) {
        await emailAPI.updateEmail(id, emailData);
      } else {
        await emailAPI.createEmail(emailData);
      }
      fetchEmails();
    } catch (err) {
      console.error("Error saving email:", err);
    }
  };

  const handleDeleteEmail = async (id) => {
    if (!window.confirm("Are you sure you want to delete this email?")) return;
    try {
      await emailAPI.deleteEmail(id);
      fetchEmails();
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedEmailId(expandedEmailId === id ? null : id);
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Email Manager</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Browse, edit, and organize all sent & draft communications</p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenCompose(null)}>
          <Plus size={18} /> Compose Email
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.05)', padding: '0.25rem', borderRadius: '10px', border: '1px solid rgba(15, 23, 42, 0.1)' }}>
          {['all', 'draft', 'sent', 'scheduled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: statusFilter === st ? 'var(--grad-primary)' : 'transparent',
                color: statusFilter === st ? '#fff' : '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category & Search inputs */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search recipient, subject..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="inquiry">Inquiry</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
      </div>

      {/* Email List */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading email list...</div>
      ) : emails.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Mail size={40} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>No emails found</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            No records match your filter parameters. Try clearing your search query.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {emails.map((email) => {
            const isExpanded = expandedEmailId === email.id;
            return (
              <div key={email.id} className="glass-card" style={{ transition: 'all 0.2s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setSelectedEmail(email)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <span className={`badge badge-${email.status}`}>{email.status}</span>
                    <span className="badge badge-category">{email.category}</span>
                    
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {email.subject}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                        To: {email.recipient} • <span style={{ color: '#64748b' }}>{new Date(email.created_at || email.received_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedEmail(email); }} 
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem', gap: '0.3rem' }}
                    >
                      <Eye size={14} /> Open
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenCompose(email); }} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteEmail(email.id); }} 
                      className="btn btn-danger" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} />
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleExpand(email.id); }}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.4rem' }}
                      title="Toggle quick view"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Body Drawer */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)' }}>
                    {email.ai_summary && (
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: '#d8b4fe',
                      }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', marginBottom: '0.25rem' }}>
                          <Sparkles size={14} /> AI Summary & Sentiment ({email.ai_sentiment})
                        </strong>
                        {email.ai_summary}
                      </div>
                    )}

                    <div style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.05)',
                      fontSize: '0.9rem',
                      color: '#475569',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                    }}>
                      {email.body || email.body_text || email.snippet}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Load more / pagination */}
      {!loading && emails.length > 0 && nextPageToken && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => fetchEmails(nextPageToken)}
            disabled={loadingMore}
            style={{ gap: '0.4rem' }}
          >
            {loadingMore ? 'Loading...' : 'Load More Emails'}
          </button>
        </div>
      )}

      {/* Edit / Compose Modal */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEmail(null); }}
        onSave={handleSaveEmail}
        emailToEdit={editingEmail}
      />

      {/* View Email Detail Modal */}
      <EmailViewModal
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        email={selectedEmail}
        onEdit={handleOpenCompose}
        onDelete={handleDeleteEmail}
        onRefresh={fetchEmails}
      />
    </div>
  );
};

export default Emails;
