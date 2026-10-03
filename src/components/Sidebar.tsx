import React from 'react';
import { 
  Activity, 
  Bot, 
  FileText, 
  GitFork, 
  CheckSquare, 
  BarChart3, 
  Zap
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'telemetry' as ActiveTab, label: 'Astronaut Health', icon: Activity, badge: 'Live Data' },
    { id: 'assistant' as ActiveTab, label: 'Nora Bio-AI Chat', icon: Bot, badge: 'AI' },
    { id: 'canvas' as ActiveTab, label: 'Medical Notes', icon: FileText, badge: 'Notes' },
    { id: 'workflows' as ActiveTab, label: 'Alert Pipelines', icon: GitFork, badge: 'Auto' },
    { id: 'tasks' as ActiveTab, label: 'EVA Task Hub', icon: CheckSquare, badge: 'Tasks' },
    { id: 'analytics' as ActiveTab, label: 'Telemetry Insights', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '240px',
      height: 'calc(100vh - 68px)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Top Navigation */}
      <div>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-dim)',
          padding: '0 12px 12px 12px'
        }}>
          Bio-Telemetry Modules
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-glow)' : 'transparent',
                  background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                  color: isActive ? 'var(--primary-violet)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? 'var(--primary-violet)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--primary-violet)' : 'rgba(0, 0, 0, 0.06)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo & Quick Stats Card */}
      <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(8, 145, 178, 0.1)',
            border: '1px solid rgba(8, 145, 178, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={15} color="var(--primary-cyan)" />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Telemetry Sensor Active
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Live 2.5s bio-stream sampling rate. Emergency SpO2 alert threshold &lt; 90%.
        </p>
      </div>
    </aside>
  );
};
