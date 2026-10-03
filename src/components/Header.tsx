import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Settings, 
  Volume2, 
  VolumeX,
  Clock,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Persona } from '../types';

interface HeaderProps {
  activePersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  personas: Record<string, Persona>;
  onOpenSettings: () => void;
  onToggleFocusModal: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersona,
  onSelectPersona,
  personas,
  onOpenSettings,
  onToggleFocusModal,
  isAudioActive,
  onToggleAudio
}) => {
  return (
    <header style={{
      height: '68px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'relative',
      zIndex: 40,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Brand & User Customizable Logo Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Customizable Logo Placeholder Slot */}
        <div id="user-custom-logo-container" style={{
          position: 'relative',
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--gradient-nora)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          cursor: 'pointer',
          overflow: 'hidden'
        }} title="Logo Container (Ready for custom logo)">
          {/* Logo image slot */}
          <img 
            id="app-logo"
            src="/nora_avatar.png" 
            alt="Website Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
              // Fallback icon if logo image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <Activity size={20} color="#ffffff" style={{ position: 'absolute' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1
            }} className="gradient-text">
              Nora
            </h1>
            <span className="badge-glow" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
              <Activity size={10} /> Bio-Telemetry
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Astronaut Health Monitoring System
          </p>
        </div>
      </div>

      {/* Middle Persona & Voice Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Persona Dropdown Pill */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 6px 4px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: activePersona.accentColor,
              boxShadow: `0 0 8px ${activePersona.accentColor}`
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {activePersona.name}
            </span>
          </div>

          <select
            value={activePersona.id}
            onChange={(e) => onSelectPersona(personas[e.target.value])}
            style={{
              background: 'rgba(241, 245, 249, 0.8)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '4px 10px',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 500
            }}
          >
            {Object.values(personas).map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#ffffff', color: '#0f172a' }}>
                {p.badge}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Synthesizer Wave animation indicator */}
        <button
          onClick={onToggleAudio}
          title={isAudioActive ? 'Voice Synthesis Active' : 'Voice Synthesis Muted'}
          style={{
            background: isAudioActive ? 'rgba(124, 58, 237, 0.08)' : 'rgba(241, 245, 249, 0.8)',
            border: `1px solid ${isAudioActive ? 'rgba(124, 58, 237, 0.25)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            color: isAudioActive ? 'var(--primary-violet)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {isAudioActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '12px' }}>
              <span style={{ width: '3px', height: '100%', background: '#7c3aed', borderRadius: '2px', animation: 'typingBounce 1s infinite 0.1s' }} />
              <span style={{ width: '3px', height: '60%', background: '#0891b2', borderRadius: '2px', animation: 'typingBounce 1s infinite 0.3s' }} />
              <span style={{ width: '3px', height: '80%', background: '#db2777', borderRadius: '2px', animation: 'typingBounce 1s infinite 0.2s' }} />
            </div>
          )}
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleFocusModal}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
        >
          <Clock size={15} color="var(--primary-cyan)" />
          <span>Focus Mode</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: 'var(--radius-full)' }}
          title="Nora Settings"
        >
          <Settings size={18} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.2)',
          fontSize: '0.75rem',
          color: '#059669',
          fontWeight: 600
        }}>
          <ShieldCheck size={14} />
          <span>Telemetry Stream Online</span>
        </div>
      </div>
    </header>
  );
};
