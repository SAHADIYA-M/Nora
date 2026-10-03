import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sparkles, 
  Key, 
  Check
} from 'lucide-react';
import { Persona } from '../types';

interface PersonaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: Persona;
}

export const PersonaSettingsModal: React.FC<PersonaSettingsModalProps> = ({
  isOpen,
  onClose,
  activePersona
}) => {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [voiceTone, setVoiceTone] = useState<string>('balanced');
  const [apiKey, setApiKey] = useState<string>('sk-nora-neural-engine-v2.4-live');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '520px',
        padding: '30px',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        background: '#ffffff',
        border: '1px solid var(--border-cyan)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Settings size={22} color="var(--primary-cyan)" />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Nora Engine Preferences</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Configure AI parameters, response style, and active key bindings.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Persona Banner */}
          <div style={{
            padding: '14px',
            background: 'rgba(124, 58, 237, 0.08)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img src={activePersona.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{activePersona.name} Settings</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activePersona.role}</p>
            </div>
          </div>

          {/* Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Creativity (Temperature): {temperature}</span>
              <span style={{ color: 'var(--text-dim)' }}>{temperature < 0.4 ? 'Precise / Deterministic' : temperature > 0.8 ? 'Creative / Experimental' : 'Balanced'}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
            />
          </div>

          {/* Voice Tone Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
              Response Voice & Tone
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['analytical', 'balanced', 'enthusiastic'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setVoiceTone(tone)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: voiceTone === tone ? 'var(--border-glow)' : 'var(--border-subtle)',
                    background: voiceTone === tone ? 'rgba(124, 58, 237, 0.1)' : '#f8fafc',
                    color: voiceTone === tone ? 'var(--primary-violet)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Connection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
              Nora AI Neural Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-field"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.85rem', background: '#f8fafc' }}
              />
              <Key size={16} color="var(--primary-cyan)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 18px' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 22px' }}>
            {saved ? <Check size={16} /> : <Sparkles size={16} />}
            <span>{saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
