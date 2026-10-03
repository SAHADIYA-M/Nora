import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Headphones
} from 'lucide-react';

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeSound, setActiveSound] = useState<'rain' | 'ambient' | 'space' | 'off'>('ambient');

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((sec) => sec - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

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
        width: '460px',
        padding: '30px',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        background: '#ffffff',
        border: '1px solid var(--border-glow)'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Flame size={22} color="var(--primary-pink)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Nora Deep Focus Mode</h2>
        </div>

        {/* Circular Timer Visual */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          <div style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `conic-gradient(var(--primary-violet) ${progressPercent}%, rgba(226, 232, 240, 0.8) 0%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)'
          }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                {formatTime(secondsLeft)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {isActive ? 'Session Active' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => setIsActive(!isActive)}
            className="btn-primary"
            style={{ width: '130px', height: '44px' }}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setSecondsLeft(25 * 60);
            }}
            className="btn-secondary"
            style={{ width: '44px', height: '44px', padding: 0 }}
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Ambient Audio Selection */}
        <div style={{
          padding: '14px',
          background: '#f8fafc',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Headphones size={15} color="var(--primary-cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Nora Ambient Soundscape</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['ambient', 'rain', 'space', 'off'] as const).map((sound) => (
              <button
                key={sound}
                onClick={() => setActiveSound(sound)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: activeSound === sound ? 'var(--border-glow)' : 'var(--border-subtle)',
                  background: activeSound === sound ? 'rgba(124, 58, 237, 0.1)' : '#ffffff',
                  color: activeSound === sound ? 'var(--primary-violet)' : 'var(--text-dim)',
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>

        {/* Nora Focus Quote */}
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          background: 'rgba(5, 150, 105, 0.08)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} />
          <span>Nora says: "Single-tasking with deep intent produces 4x clarity. Keep pushing."</span>
        </div>
      </div>
    </div>
  );
};
