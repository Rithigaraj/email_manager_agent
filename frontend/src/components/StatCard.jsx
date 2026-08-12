import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#6366f1', trend }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.35rem 0 0.2rem', color: '#0f172a' }}>
          {value}
        </h2>
        {trend && (
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            {trend}
          </span>
        )}
      </div>

      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '14px',
        background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  );
};

export default StatCard;
