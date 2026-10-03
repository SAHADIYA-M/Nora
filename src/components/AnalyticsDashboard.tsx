import React from 'react';
import { 
  BarChart3, 
  TrendingUp
} from 'lucide-react';
import { AnalyticsMetric } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const metrics: AnalyticsMetric[] = [
    { label: 'Time Saved Today', value: '3.4 Hours', change: '+24%', positive: true },
    { label: 'Nora AI Queries', value: '142', change: '+18%', positive: true },
    { label: 'Active Pipeline Nodes', value: '12', change: '+4', positive: true },
    { label: 'Neural Token Savings', value: '420k', change: '-8% cost', positive: true }
  ];

  const chartBars = [
    { day: 'Mon', queries: 45, focusMins: 120 },
    { day: 'Tue', queries: 80, focusMins: 180 },
    { day: 'Wed', queries: 65, focusMins: 150 },
    { day: 'Thu', queries: 110, focusMins: 210 },
    { day: 'Fri', queries: 142, focusMins: 250 },
    { day: 'Sat', queries: 90, focusMins: 160 },
    { day: 'Sun', queries: 75, focusMins: 140 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', gap: '20px', overflowY: 'auto' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={24} color="var(--primary-violet)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Insights & AI Analytics</h2>
          <span className="badge-glow">Real-Time Metrics</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Comprehensive view of Nora AI consumption, focus productivity, and automation activity.
        </p>
      </div>

      {/* Top Metric Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {metrics.map((m, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '20px', background: '#ffffff' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">{m.value}</span>
              <span className="badge-cyan" style={{ fontSize: '0.7rem' }}>
                <TrendingUp size={11} /> {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Weekly Query & Focus Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Weekly AI Activity Volume</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Queries vs. Focus Minutes</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '0 10px' }}>
            {chartBars.map((bar, i) => {
              const queryHeight = (bar.queries / 150) * 100;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '28px',
                    height: `${queryHeight}%`,
                    background: 'var(--gradient-nora)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
                    transition: 'all var(--transition-smooth)'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bar.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Persona Usage Breakdown */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Persona Usage Breakdown</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Nora Architect (Code)</span>
                <span style={{ fontWeight: 700 }}>45%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ width: '45%', height: '100%', background: '#7c3aed', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Nora Executive (Staff)</span>
                <span style={{ fontWeight: 700 }}>30%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ width: '30%', height: '100%', background: '#0891b2', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Nora Muse (Creative)</span>
                <span style={{ fontWeight: 700 }}>15%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ width: '15%', height: '100%', background: '#db2777', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Nora Companion (Daily)</span>
                <span style={{ fontWeight: 700 }}>10%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ width: '10%', height: '100%', background: '#059669', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
