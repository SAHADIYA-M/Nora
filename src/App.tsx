import React, { useState, useEffect } from 'react';
import logoImg from './assets/logo.png';
import silhouetteImg from './assets/astronaut_silhouette.svg';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Moon, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Volume2, 
  VolumeX,
  X,
  Zap,
  BookOpen,
  Shield,
  CheckSquare,
  ListChecks
} from 'lucide-react';

export type HealthStatus = 'normal' | 'warning' | 'critical';
export type AppMode = 'health_guide' | 'nora_muse';
export type SimulationMode = 'normal' | 'warning' | 'critical';

export interface AstronautVitals {
  heartRate: number;      // BPM (Normal: 60-95)
  oxygenLevel: number;    // % SpO2 (Normal: 95-100%, Critical: < 90%)
  bodyTemp: number;       // °C (Normal: 36.5-37.5°C)
  sleepDuration: number;  // Hours
  exerciseTime: number;   // Minutes
  bloodPressure: string;  // mmHg
  hydrationLevel: number; // %
}

export interface HistoryPoint {
  time: string;
  heartRate: number;
  oxygenLevel: number;
}

export interface SimulationPopup {
  title: string;
  severity: 'warning' | 'critical';
  cause: string;
  steps: string[];
}

export function App() {
  // Mode Selector: 'health_guide' vs 'nora_muse'
  const [activeMode, setActiveMode] = useState<AppMode>('health_guide');
  const [simulationState, setSimulationState] = useState<SimulationMode>('normal');

  // Mission Clock & Audio State
  const [missionTime, setMissionTime] = useState<string>('');
  const [missionDay] = useState<number>(142);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);
  const [isAutoUpdating, setIsAutoUpdating] = useState<boolean>(true);

  // Simulation Pop-up Modal State (Auto-dismisses after 2 seconds for warning/critical)
  const [popupModal, setPopupModal] = useState<SimulationPopup | null>(null);

  // Astronaut Vitals State (Varies over time continuously every 2.5s)
  const [vitals, setVitals] = useState<AstronautVitals>({
    heartRate: 72,
    oxygenLevel: 98.5,
    bodyTemp: 36.8,
    sleepDuration: 7.5,
    exerciseTime: 45,
    bloodPressure: '120/80',
    hydrationLevel: 92
  });

  // Telemetry trend history stream
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  // Browser Voice Synthesizer
  const speakVoice = (text: string) => {
    if (!isAudioActive || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // Step 3: Health Status Logic (Normal, Warning, Critical)
  const getHealthStatus = (v: AstronautVitals): HealthStatus => {
    if (v.oxygenLevel < 90 || v.bodyTemp > 38.5 || v.heartRate > 140 || v.hydrationLevel < 70) {
      return 'critical';
    }
    if (v.oxygenLevel < 95 || v.bodyTemp > 37.8 || v.heartRate > 115 || v.hydrationLevel < 80) {
      return 'warning';
    }
    return 'normal';
  };

  const status = getHealthStatus(vitals);

  // Step 5: Mission Day & Time Indicator Ticker
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setMissionTime(now.toUTCString().split(' ')[4] + ' UTC');
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Time-Varying Data Generator (Varies health data dynamically over time)
  useEffect(() => {
    if (!isAutoUpdating) return;

    const dataInterval = setInterval(() => {
      setVitals((prev) => {
        const hrFluctuation = (Math.random() - 0.48) * 2.5;
        const o2Fluctuation = (Math.random() - 0.5) * 0.4;
        const tempFluctuation = (Math.random() - 0.5) * 0.05;

        const nextHR = Math.round(Math.min(Math.max(prev.heartRate + hrFluctuation, 58), 145));
        const nextO2 = Math.round(Math.min(Math.max(prev.oxygenLevel + o2Fluctuation, 85), 100) * 10) / 10;
        const nextTemp = Math.round(Math.min(Math.max(prev.bodyTemp + tempFluctuation, 36.1), 38.9) * 10) / 10;

        return {
          ...prev,
          heartRate: nextHR,
          oxygenLevel: nextO2,
          bodyTemp: nextTemp
        };
      });
    }, 2500);

    return () => clearInterval(dataInterval);
  }, [isAutoUpdating]);

  // Telemetry stream history logger for graph
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => {
      const next = [...prev, { time: timeStr, heartRate: vitals.heartRate, oxygenLevel: vitals.oxygenLevel }];
      return next.slice(-14);
    });
  }, [vitals]);

  // Voice Toggle
  const handleToggleAudio = () => {
    const nextState = !isAudioActive;
    setIsAudioActive(nextState);
    if (nextState) {
      speakVoice("Voice active. Space Health Guide monitoring astronaut vitals.");
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // 3 SIMULATION TRIGGER HANDLERS: NORMAL, WARNING, CRITICAL
  const handleSimulate = (mode: SimulationMode) => {
    setSimulationState(mode);

    if (mode === 'normal') {
      setVitals({
        heartRate: 72,
        oxygenLevel: 98.5,
        bodyTemp: 36.8,
        sleepDuration: 7.5,
        exerciseTime: 45,
        bloodPressure: '120/80',
        hydrationLevel: 92
      });
      speakVoice("Normal simulation active. All vitals nominal.");
      setPopupModal(null); // No popup for normal mode
    } else if (mode === 'warning') {
      setVitals({
        heartRate: 118,
        oxygenLevel: 93.0,
        bodyTemp: 37.7,
        sleepDuration: 6.0,
        exerciseTime: 60,
        bloodPressure: '138/88',
        hydrationLevel: 76
      });
      speakVoice("Warning simulation active.");
      setPopupModal({
        title: 'WARNING TRIGGER SIMULATED',
        severity: 'warning',
        cause: 'Elevated pulse rate (118 BPM) & SpO2 reduction (93.0%).',
        steps: [
          '1. Reduce treadmill physical exercise intensity',
          '2. Initiate 4-7-8 deep breathing protocol',
          '3. Hydrate with electrolyte fluid reserve'
        ]
      });
    } else if (mode === 'critical') {
      setVitals({
        heartRate: 138,
        oxygenLevel: 87.5,
        bodyTemp: 38.6,
        sleepDuration: 4.5,
        exerciseTime: 75,
        bloodPressure: '152/98',
        hydrationLevel: 64
      });
      speakVoice("Critical emergency simulation active. Oxygen level low.");
      setPopupModal({
        title: 'CRITICAL ALERT SIMULATED',
        severity: 'critical',
        cause: 'Oxygen level dropped below 90% SpO2 (87.5%) with high temperature (38.6°C).',
        steps: [
          '1. Inhale suit emergency 100% O2 reserve valve immediately',
          '2. Verify helmet visor pressure seal integrity',
          '3. Increase Liquid Cooling Garment coolant flow'
        ]
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      height: 'auto',
      background: '#f8fafc',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header without Nora Avatar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="header-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Title & Clean Icon Logo (Avatar Removed) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--gradient-nora)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                overflow: 'hidden',
                flexShrink: 0
              }}
              title="Space Health Guide Logo"
            >
              <img 
                src={logoImg} 
                alt="Space Health Guide Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
                Astronaut Health Monitor
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Your Space Health Guide • Bio-Telemetry &amp; Medical Simulation
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill: Space Health Guide vs Nora Muse Mode */}
          <div className="mode-pill-container" style={{
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            gap: '4px',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveMode('health_guide')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeMode === 'health_guide' ? '#ffffff' : 'transparent',
                color: activeMode === 'health_guide' ? 'var(--primary-violet)' : 'var(--text-muted)',
                boxShadow: activeMode === 'health_guide' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              Space Health Guide
            </button>

            <button
              onClick={() => setActiveMode('nora_muse')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeMode === 'nora_muse' ? 'var(--gradient-pink)' : 'transparent',
                color: activeMode === 'nora_muse' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeMode === 'nora_muse' ? '0 4px 12px rgba(219,39,119,0.25)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              Nora Muse Mode
            </button>
          </div>

          {/* Step 5: Voice & Mission Day / Time Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleAudio}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            >
              {isAudioActive ? <Volume2 size={16} color="var(--primary-violet)" /> : <VolumeX size={16} />}
              <span>{isAudioActive ? 'Voice Active' : 'Voice Muted'}</span>
            </button>

            {/* Step 5 Indicator */}
            <div style={{
              background: 'rgba(241, 245, 249, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              <Clock size={14} color="var(--primary-cyan)" />
              <span>SOL {missionDay} • {missionTime || '18:41:00 UTC'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="main-container" style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 20px 80px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Profile Card Header */}
        <div className="glass-panel" style={{
          padding: '20px 24px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Profile Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: activeMode === 'nora_muse' ? 'var(--gradient-pink)' : 'var(--gradient-nora)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {activeMode === 'nora_muse' ? (
                <BookOpen size={24} color="#ffffff" />
              ) : (
                <img 
                  src={logoImg} 
                  alt="Space Health Guide Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeMode === 'nora_muse' ? (
                    'Nora Muse Mode'
                  ) : (
                    <>
                      <span>Astronaut: Cmdr. Sarah Vance</span>
                      <img 
                        src={silhouetteImg} 
                        alt="Astronaut Silhouette" 
                        style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'contain' }} 
                      />
                    </>
                  )}
                </h2>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary-violet)' }}>
                  ID: AST-042
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeMode === 'nora_muse'
                  ? 'Your Space Health Guide — Defined Protocols & Emergency Guidelines'
                  : 'Your Space Health Guide — Bio-Telemetry Stream (Suit #02)'}
              </p>
            </div>
          </div>

          {/* Step 3: Health Status Indicator (Normal, Warning, Critical) */}
          {activeMode === 'health_guide' && (
            <div style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: status === 'normal' ? 'rgba(5, 150, 105, 0.08)' : status === 'warning' ? 'rgba(217, 119, 6, 0.08)' : 'rgba(220, 38, 38, 0.12)',
              border: `2px solid ${status === 'normal' ? '#059669' : status === 'warning' ? '#d97706' : '#dc2626'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: status === 'critical' ? 'pulseAura 1.2s infinite' : 'none'
            }}>
              {status === 'normal' && <CheckCircle2 size={20} color="#059669" />}
              {status === 'warning' && <AlertTriangle size={20} color="#d97706" />}
              {status === 'critical' && <ShieldAlert size={20} color="#dc2626" />}

              <div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: status === 'normal' ? '#059669' : status === 'warning' ? '#d97706' : '#dc2626',
                  display: 'block',
                  lineHeight: 1
                }}>
                  STATUS: {status.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                  {status === 'normal' ? 'Vitals nominal' : status === 'warning' ? 'Warning alert active' : 'Critical alert breach'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ==================== MODE 1: SPACE HEALTH GUIDE ==================== */}
        {activeMode === 'health_guide' && (
          <>
            {/* Step 4: Alert Condition Based on Health Data (If Oxygen Level < 90% → CRITICAL ALERT) */}
            {vitals.oxygenLevel < 90 && (
              <div className="animate-fade-in" style={{
                background: 'rgba(220, 38, 38, 0.08)',
                border: '2px solid #dc2626',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap',
                boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <ShieldAlert size={28} color="#dc2626" />
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                      CRITICAL ALERT: OXYGEN LEVEL BELOW 90%
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>
                      Current Oxygen: <strong>{vitals.oxygenLevel}% SpO2</strong> (Threshold: &lt; 90%). Inhale emergency suit reserve oxygen immediately.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSimulate('normal')}
                  className="btn-primary"
                  style={{ background: '#dc2626', borderColor: '#b91c1c', fontSize: '0.8rem' }}
                >
                  Reset Vitals to Normal
                </button>
              </div>
            )}

            {/* Displayed Health Parameters (Dynamic Time-Varying Data) */}
            <div className="param-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* 1. Oxygen Level */}
              <div className="glass-panel glass-panel-hover" style={{
                padding: '18px',
                background: '#ffffff',
                borderTop: `4px solid ${vitals.oxygenLevel < 90 ? '#dc2626' : vitals.oxygenLevel < 95 ? '#d97706' : '#0891b2'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Oxygen Level</span>
                  <Wind size={18} color="var(--primary-cyan)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: vitals.oxygenLevel < 90 ? '#dc2626' : 'var(--text-main)' }}>
                    {vitals.oxygenLevel}%
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: vitals.oxygenLevel < 90 ? '#dc2626' : '#059669' }}>
                    SpO2
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  {vitals.oxygenLevel < 90 ? 'CRITICAL ALERT (<90%)' : 'Normal (95-100%)'}
                </span>
              </div>

              {/* 2. Heart Rate */}
              <div className="glass-panel glass-panel-hover" style={{
                padding: '18px',
                background: '#ffffff',
                borderTop: `4px solid ${vitals.heartRate > 120 ? '#dc2626' : vitals.heartRate > 100 ? '#d97706' : '#7c3aed'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Heart Rate</span>
                  <Heart size={18} color="var(--primary-violet)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {vitals.heartRate}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    BPM
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  {vitals.heartRate > 120 ? 'High Pulse Alert' : 'Normal (60-95 BPM)'}
                </span>
              </div>

              {/* 3. Body Temperature */}
              <div className="glass-panel glass-panel-hover" style={{
                padding: '18px',
                background: '#ffffff',
                borderTop: `4px solid ${vitals.bodyTemp > 38.0 ? '#dc2626' : '#db2777'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Body Temp</span>
                  <Thermometer size={18} color="var(--primary-pink)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {vitals.bodyTemp}°C
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    ({(vitals.bodyTemp * 1.8 + 32).toFixed(1)}°F)
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  {vitals.bodyTemp > 38.0 ? 'Fever Spike' : 'Normal (36.5-37.5°C)'}
                </span>
              </div>

              {/* 4. Sleep Duration */}
              <div className="glass-panel glass-panel-hover" style={{
                padding: '18px',
                background: '#ffffff',
                borderTop: '4px solid #059669'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sleep Rest</span>
                  <Moon size={18} color="#059669" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {vitals.sleepDuration}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    Hours
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Baseline Rest
                </span>
              </div>

              {/* 5. Exercise Time */}
              <div className="glass-panel glass-panel-hover" style={{
                padding: '18px',
                background: '#ffffff',
                borderTop: '4px solid #d97706'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Exercise Workout</span>
                  <Activity size={18} color="#d97706" />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {vitals.exerciseTime}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    Minutes
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Treadmill Session
                </span>
              </div>
            </div>

            {/* Live Graph & 3 SIMULATION MODES PANEL */}
            <div className="grid-two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '20px' }}>
              {/* Trend Graph */}
              <div className="glass-panel" style={{ padding: '20px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--primary-violet)" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Live Telemetry Stream</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span style={{ color: '#0891b2', fontWeight: 700 }}>— Oxygen %</span>
                    <span style={{ color: '#7c3aed', fontWeight: 700 }}>--- Heart Rate</span>
                  </div>
                </div>

                {/* SVG Trend Line */}
                <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                  <svg style={{ width: '100%', height: '100%' }}>
                    <line x1="0" y1="30" x2="100%" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="100%" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="130" x2="100%" y2="130" stroke="#f1f5f9" strokeWidth="1" />

                    {history.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#0891b2"
                        strokeWidth="3"
                        points={history.map((pt, i) => {
                          const y = 150 - ((pt.oxygenLevel - 80) / 20) * 120;
                          return `${(i / (history.length - 1)) * 600},${y}`;
                        }).join(' ')}
                      />
                    )}

                    {history.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        points={history.map((pt, i) => {
                          const y = 150 - ((pt.heartRate - 50) / 90) * 120;
                          return `${(i / (history.length - 1)) * 600},${y}`;
                        }).join(' ')}
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* 3 SIMULATION MODES: NORMAL, WARNING, CRITICAL */}
              <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Zap size={18} color="var(--primary-violet)" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>3 Simulation Modes</h3>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Trigger simulation state to test output:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* 1. Normal Mode */}
                    <button
                      onClick={() => handleSimulate('normal')}
                      className="btn-secondary"
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: simulationState === 'normal' ? '#ffffff' : '#059669',
                        borderColor: '#059669',
                        background: simulationState === 'normal' ? '#059669' : 'rgba(5, 150, 105, 0.05)',
                        justifyContent: 'space-between',
                        boxShadow: simulationState === 'normal' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} />
                        <span>Normal Mode</span>
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: simulationState === 'normal' ? '#ffffff' : '#059669',
                        color: simulationState === 'normal' ? '#059669' : '#ffffff',
                        fontWeight: 800
                      }}>
                        NOMINAL
                      </span>
                    </button>

                    {/* 2. Warning Mode */}
                    <button
                      onClick={() => handleSimulate('warning')}
                      className="btn-secondary"
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: simulationState === 'warning' ? '#ffffff' : '#d97706',
                        borderColor: '#d97706',
                        background: simulationState === 'warning' ? '#d97706' : 'rgba(217, 119, 6, 0.05)',
                        justifyContent: 'space-between',
                        boxShadow: simulationState === 'warning' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} />
                        <span>Warning Mode</span>
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: simulationState === 'warning' ? '#ffffff' : '#d97706',
                        color: simulationState === 'warning' ? '#d97706' : '#ffffff',
                        fontWeight: 800
                      }}>
                        CAUTION
                      </span>
                    </button>

                    {/* 3. Critical Mode */}
                    <button
                      onClick={() => handleSimulate('critical')}
                      className="btn-secondary"
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: simulationState === 'critical' ? '#ffffff' : '#dc2626',
                        borderColor: '#dc2626',
                        background: simulationState === 'critical' ? '#dc2626' : 'rgba(220, 38, 38, 0.05)',
                        justifyContent: 'space-between',
                        boxShadow: simulationState === 'critical' ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={16} />
                        <span>Critical Mode</span>
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: simulationState === 'critical' ? '#ffffff' : '#dc2626',
                        color: simulationState === 'critical' ? '#dc2626' : '#ffffff',
                        fontWeight: 800
                      }}>
                        BREACH
                      </span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', marginTop: '12px' }}>
                  <span>Dynamic Telemetry Stream:</span>
                  <button
                    onClick={() => setIsAutoUpdating(!isAutoUpdating)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isAutoUpdating ? '#059669' : '#dc2626',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isAutoUpdating ? 'Active (2.5s)' : 'Paused'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== MODE 2: NORA MUSE MODE (ONLY INSTRUCTIONS, PRECAUTIONS & EMERGENCY PRECAUTIONS) ==================== */}
        {activeMode === 'nora_muse' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <ListChecks size={22} color="var(--primary-violet)" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Defined Clinical &amp; Operational Protocols
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Structured Operating Instructions, Clinical Precautions, and Emergency Action Guidelines.
                  </p>
                </div>
              </div>

              {/* 3 Defined Instruction Cards Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                {/* 1. Operating Instructions Card */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(8, 145, 178, 0.04)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(8, 145, 178, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckSquare size={18} color="#0891b2" />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0891b2' }}>Operating Instructions</h4>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(8, 145, 178, 0.15)', color: '#0891b2' }}>
                      STANDARD
                    </span>
                  </div>

                  <ul style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#0891b2' }}>Step 1: Continuous Vital Sampling</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Maintain 2.5-second automated bio-telemetry telemetry sampling stream.
                      </div>
                    </li>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#0891b2' }}>Step 2: SpO2 Pre-EVA Verification</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Verify oxygen saturation is ≥95% SpO2 before authorizing EVA extravehicular activity.
                      </div>
                    </li>
                    <li>
                      <div style={{ fontWeight: 700, color: '#0891b2' }}>Step 3: Daily Countermeasure Exercise</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Execute 45 minutes of scheduled treadmill cardio workout daily.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 2. Clinical Precautions Card */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(124, 58, 237, 0.04)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(124, 58, 237, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} color="#7c3aed" />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#7c3aed' }}>Clinical Precautions</h4>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed' }}>
                      PREVENTATIVE
                    </span>
                  </div>

                  <ul style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#7c3aed' }}>Pulse Exertion Warning</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        If heart rate exceeds 115 BPM, decrease workout intensity and rest for 5 minutes.
                      </div>
                    </li>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#7c3aed' }}>Sleep Rest Mandate</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Enforce a minimum of 7.5 hours uninterrupted rest per 24-hour cycle.
                      </div>
                    </li>
                    <li>
                      <div style={{ fontWeight: 700, color: '#7c3aed' }}>Hydration Maintenance</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Maintain hydration level above 80% to avoid microgravity fluid shift fatigue.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 3. Emergency Precautions Card */}
                <div style={{
                  padding: '18px',
                  background: 'rgba(220, 38, 38, 0.04)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(220, 38, 38, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} color="#dc2626" />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#dc2626' }}>Emergency Precautions</h4>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626' }}>
                      CRITICAL
                    </span>
                  </div>

                  <ul style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>Hypoxia Protocol (&lt;90% SpO2)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Engage 100% emergency suit O2 valve immediately and lock helmet pressure visor.
                      </div>
                    </li>
                    <li style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>Hyperthermia Spike (&gt;38.5°C)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Set Liquid Cooling Garment (LCG) coolant loop flow rate to maximum level.
                      </div>
                    </li>
                    <li>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>Tachycardia / Pressure Spike</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Assume upright rest position, practice 4-7-8 breathing, and notify mission doctor.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* POP-UP ALERT MODAL: SHOWS FOR 2 SECONDS WHEN WARNING/CRITICAL TRIGGER IS SIMULATED */}
      {popupModal && (
        <div 
          onClick={() => setPopupModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="glass-panel modal-content animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '460px',
              maxWidth: '92vw',
              padding: '22px 24px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
              border: `2px solid ${popupModal.severity === 'critical' ? '#dc2626' : '#d97706'}`,
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setPopupModal(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: '#f1f5f9',
                border: 'none',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingRight: '24px' }}>
              {popupModal.severity === 'critical' ? (
                <ShieldAlert size={28} color="#dc2626" />
              ) : (
                <AlertTriangle size={28} color="#d97706" />
              )}

              <div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: popupModal.severity === 'critical' ? '#dc2626' : '#d97706'
                }}>
                  {popupModal.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {popupModal.cause}
                </p>
              </div>
            </div>

            {/* Step-by-Step Action List */}
            <div style={{
              padding: '12px 14px',
              background: '#f8fafc',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '14px'
            }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                Trigger Protocols:
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', listStyle: 'none' }}>
                {popupModal.steps.map((step, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: popupModal.severity === 'critical' ? '#dc2626' : '#d97706', fontWeight: 700 }}>•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Manual Dismissal Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Requires user dismissal
              </span>
              <button
                onClick={() => setPopupModal(null)}
                className="btn-primary"
                style={{
                  padding: '6px 18px',
                  fontSize: '0.8rem',
                  background: popupModal.severity === 'critical' ? '#dc2626' : 'var(--gradient-nora)'
                }}
              >
                Understood &amp; Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
