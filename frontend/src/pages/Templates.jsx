import React, { useState, useEffect } from 'react';
import { templateAPI } from '../services/api';
import { FileText, Plus, Trash2, Copy, Check, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    subject_template: '',
    body_template: '',
    category: 'general',
  });

  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getTemplates();
      setTemplates(response.data.templates);
    } catch (err) {
      console.error("Failed fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject_template || !formData.body_template) return;
    try {
      await templateAPI.createTemplate(formData);
      setShowAddModal(false);
      setFormData({ name: '', subject_template: '', body_template: '', category: 'general' });
      fetchTemplates();
    } catch (err) {
      console.error("Failed creating template:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await templateAPI.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      console.error("Failed deleting template:", err);
    }
  };

  const handleCopyBody = (id, body) => {
    navigator.clipboard.writeText(body);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Email Templates</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Save reusable email content structures for quick deployment</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Template
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#64748b', padding: '2rem' }}>Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={40} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>No Templates Saved</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
            Create reusable subject and body templates to streamline your daily emailing.
          </p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Create First Template
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {templates.map((tpl) => (
            <div key={tpl.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-category">{tpl.category}</span>
                  <button onClick={() => handleDelete(tpl.id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  {tpl.name}
                </h3>
                
                <p style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Subject: {tpl.subject_template}
                </p>

                <div style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.04)',
                  fontSize: '0.85rem',
                  color: '#475569',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                }}>
                  {tpl.body_template}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(15, 23, 42, 0.1)' }}>
                <button
                  onClick={() => handleCopyBody(tpl.id, tpl.body_template)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                >
                  {copiedId === tpl.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedId === tpl.id ? 'Copied' : 'Copy Body'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Template Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(15, 23, 42, 0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Create Email Template</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Sales Intro Template"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="inquiry">Inquiry</option>
                  <option value="support">Support</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject Template</label>
                <input
                  type="text"
                  required
                  placeholder="Subject line with variables like {name}"
                  className="form-input"
                  value={formData.subject_template}
                  onChange={(e) => setFormData({ ...formData, subject_template: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body Template</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write body text template..."
                  className="form-textarea"
                  value={formData.body_template}
                  onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
