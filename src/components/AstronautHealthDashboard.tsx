import React, { useState, useEffect } from 'react';
import silhouetteImg from '../assets/astronaut_silhouette.svg';
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
  Zap, 
  RefreshCw, 
  User, 
  Sparkles, 
  Bell, 
  Volume2, 
  Sliders,
  Radio
} from 'lucide-react';
import { AstronautHealthData, HealthStatus, AlertLogItem, TelemetryPoint } from '../types';

interface AstronautHealthDashboardProps {
  onAskNoraAboutVitals?: (vitalSummary: string) => void;
}

export const AstronautHealthDashboard: React.FC<AstronautHealthDashboardProps> = ({
  onAskNoraAboutVitals
}) => {
  // Live Astronaut Health Data State
  const [vitals, setVitals] = useState<AstronautHealthData>({
    heartRate: 74,
    oxygenLevel: 98,
    bodyTemp: 36.8,
    sleepDuration: 7.6,
    exerciseTime: 45,
    suitPressure: 30.2,
    respirationRate: 15
  });

  // Telemetry History for sparkline chart
  const [history, setHistory] = useState<TelemetryPoint[]>([]);

  // Alert Log History
  const [alerts, setAlerts] = useState<AlertLogItem[]>([
    {
      id: 'alt-1',
      timestamp: '14:28:10 UTC',
      severity: 'normal',
      parameter: 'System Check',
      message: 'All 6 biometric telemetry streams Nominal.',
      acknowledged: true
    }
  ]);

  // Mission Clock State
  const [missionTime, setMissionTime] = useState<string>('');
  const [missionDay] = useState<number>(142);
  const [isLiveAutoUpdate, setIsLiveAutoUpdate] = useState<boolean>(true);

  // Derive Overall Health Status
  const getOverallStatus = (v: AstronautHealthData): HealthStatus => {
    if (v.oxygenLevel < 90 || v.bodyTemp > 38.5 || v.heartRate > 140 || v.heartRate < 45) {
      return 'critical';
    }
    if (v.oxygenLevel < 95 || v.bodyTemp > 37.8 || v.heartRate > 115 || v.heartRate < 55) {
      return 'warning';
    }
    return 'normal';
  };

  const status = getOverallStatus(vitals);

  // Live Mission Clock & Random Telemetry Updates
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setMissionTime(now.toUTCString().split(' ')[4] + ' UTC');
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Time-Varying Data Simulation Ticker
  useEffect(() => {
    if (!isLiveAutoUpdate) return;

    const dataInterval = setInterval(() => {
      setVitals((prev) => {
        // Natural realistic fluctuation unless in override mode
        const hrDelta = (Math.random() - 0.48) * 3;
        const o2Delta = (Math.random() - 0.5) * 0.6;
        const tempDelta = (Math.random() - 0.5) * 0.08;

        const nextHR = Math.round(Math.min(Math.max(prev.heartRate + hrDelta, 55), 145));
        const nextO2 = Math.round(Math.min(Math.max(prev.oxygenLevel + o2Delta, 84), 100) * 10) / 10;
        const nextTemp = Math.round(Math.min(Math.max(prev.bodyTemp + tempDelta, 35.5), 39.2) * 10) / 10;

        const updated: AstronautHealthData = {
          ...prev,
          heartRate: nextHR,
          oxygenLevel: nextO2,
          bodyTemp: nextTemp
        };

        // Check for alert triggers
        if (nextO2 < 90) {
          triggerAlert('critical', 'Oxygen Level (% SpO2)', `CRITICAL ALERT: Oxygen dropped to ${nextO2}%! Emergency O2 protocol required.`);
        } else if (nextHR > 120) {
          triggerAlert('warning', 'Heart Rate (BPM)', `WARNING: Tachycardia detected at ${nextHR} BPM.`);
        } else if (nextTemp > 38.0) {
          triggerAlert('warning', 'Body Temperature', `WARNING: Thermal elevation at ${nextTemp}°C.`);
        }

        return updated;
      });
    }, 2500);

    return () => clearInterval(dataInterval);
  }, [isLiveAutoUpdate]);

  // Keep telemetry history stream updated
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory((prev) => {
      const next = [...prev, { time: timeStr, heartRate: vitals.heartRate, oxygenLevel: vitals.oxygenLevel, bodyTemp: vitals.bodyTemp }];
      return next.slice(-12); // Keep last 12 ticks
    });
  }, [vitals]);

  const triggerAlert = (severity: HealthStatus, parameter: string, message: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
    setAlerts((prev) => {
      // Prevent duplicate log spam
      if (prev[0] && prev[0].message === message) return prev;
      return [
        {
          id: `alt-${Date.now()}`,
          timestamp: timeStr,
          severity,
          parameter,
          message,
          acknowledged: false
        },
        ...prev.slice(0, 14)
      ];
    });
  };

  // Preset Simulation Triggers
  const handleSimulateLowOxygen = () => {
    setVitals((prev) => ({ ...prev, oxygenLevel: 87.5, heartRate: 108 }));
    triggerAlert('critical', 'Oxygen Level (% SpO2)', 'CRITICAL ALERT: Oxygen level dropped to 87.5%! SpO2 threshold breach (< 90%).');
  };

  const handleSimulateExerciseSpike = () => {
    setVitals((prev) => ({ ...prev, heartRate: 132, exerciseTime: prev.exerciseTime + 15 }));
    triggerAlert('warning', 'Heart Rate (BPM)', 'WARNING: Intense physical exertion detected. Heart rate reached 132 BPM.');
  };

  const handleSimulateFever = () => {
    setVitals((prev) => ({ ...prev, bodyTemp: 38.7, heartRate: 98 }));
    triggerAlert('critical', 'Body Temperature', 'CRITICAL ALERT: Hyperthermia reading 38.7°C detected!');
  };

  const handleResetNominal = () => {
    setVitals({
      heartRate: 72,
      oxygenLevel: 99.0,
      bodyTemp: 36.7,
      sleepDuration: 7.8,
      exerciseTime: 45,
      suitPressure: 30.1,
      respirationRate: 14
    });
    triggerAlert('normal', 'Telemetry Reset', 'Vitals restored to Nominal baseline.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', gap: '20px', overflowY: 'auto' }}>
      {/* Step 1 & Step 5: Astronaut Profile Header & Mission Clock */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'var(--gradient-nora)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            position: 'relative'
          }}>
            <img 
              src={silhouetteImg} 
              alt="Astronaut Silhouette" 
              style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
            />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: status === 'normal' ? '#059669' : status === 'warning' ? '#d97706' : '#dc2626',
              border: '2px solid #ffffff'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Commander Nora Vance
              </h2>
              <span className="badge-glow" style={{ fontSize: '0.75rem' }}>
                <Radio size={12} /> Mission Artemis-VII (EVA Suit 01)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Bio-Telemetry Stream • Deep Space Gateway Station
            </p>
          </div>
        </div>

        {/* Step 3: Health Status Indicator Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mission Clock & Time
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              <Clock size={16} color="var(--primary-cyan)" />
              <span>SOL {missionDay} • {missionTime || '14:32:00 UTC'}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            background: status === 'normal' ? 'rgba(5, 150, 105, 0.1)' : status === 'warning' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(220, 38, 38, 0.15)',
            border: `1px solid ${status === 'normal' ? 'rgba(5, 150, 105, 0.3)' : status === 'warning' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(220, 38, 38, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: status === 'critical' ? 'pulseAura 1s infinite' : 'none'
          }}>
            {status === 'normal' && <CheckCircle2 size={20} color="#059669" />}
            {status === 'warning' && <AlertTriangle size={20} color="#d97706" />}
            {status === 'critical' && <ShieldAlert size={20} color="#dc2626" />}
            
            <div>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: status === 'normal' ? '#059669' : status === 'warning' ? '#d97706' : '#dc2626',
                display: 'block',
                lineHeight: 1
              }}>
                STATUS: {status.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {status === 'normal' ? 'All Vitals Nominal' : status === 'warning' ? 'Warning Alert Active' : 'CRITICAL THRESHOLD BREACH'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Critical Banner (If Oxygen < 90% or Critical) */}
      {status === 'critical' && (
        <div style={{
          background: 'rgba(220, 38, 38, 0.12)',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#dc2626',
          boxShadow: '0 4px 20px rgba(220, 38, 38, 0.15)',
          animation: 'glowPulse 1.5s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ShieldAlert size={26} color="#dc2626" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>
                🚨 CRITICAL ALERT DETECTED
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '2px' }}>
                {vitals.oxygenLevel < 90
                  ? `CRITICAL OXYGEN LEVEL: ${vitals.oxygenLevel}% SpO2 is below 90% threshold! Immediate oxygen purge initiated.`
                  : `CRITICAL THERMAL/CARDIAC BREACH: Temp ${vitals.bodyTemp}°C / HR ${vitals.heartRate} BPM.`}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetNominal}
            className="btn-primary"
            style={{ background: '#dc2626', borderColor: '#b91c1c', fontSize: '0.8rem', padding: '8px 16px' }}
          >
            Acknowledge & Reset
          </button>
        </div>
      )}

      {/* Step 2: Display at least 4 Health Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {/* 1. Oxygen Level */}
        <div className="glass-panel glass-panel-hover" style={{
          padding: '20px',
          background: '#ffffff',
          borderLeft: `4px solid ${vitals.oxygenLevel < 90 ? '#dc2626' : vitals.oxygenLevel < 95 ? '#d97706' : '#0891b2'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Oxygen Level (% SpO2)</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(8, 145, 178, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wind size={18} color="var(--primary-cyan)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: vitals.oxygenLevel < 90 ? '#dc2626' : 'var(--text-main)' }}>
              {vitals.oxygenLevel}%
            </span>
            <span style={{ fontSize: '0.75rem', color: vitals.oxygenLevel < 90 ? '#dc2626' : '#059669', fontWeight: 600 }}>
              {vitals.oxygenLevel < 90 ? 'CRITICAL' : 'Normal (95-100%)'}
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '12px' }}>
            <div style={{
              width: `${Math.min(vitals.oxygenLevel, 100)}%`,
              height: '100%',
              background: vitals.oxygenLevel < 90 ? '#dc2626' : vitals.oxygenLevel < 95 ? '#d97706' : '#0891b2',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* 2. Heart Rate */}
        <div className="glass-panel glass-panel-hover" style={{
          padding: '20px',
          background: '#ffffff',
          borderLeft: `4px solid ${vitals.heartRate > 120 ? '#d97706' : '#7c3aed'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Heart Rate (BPM)</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={18} color="var(--primary-violet)" style={{ animation: 'typingBounce 1s infinite' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {vitals.heartRate}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>BPM</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: vitals.heartRate > 120 ? '#d97706' : '#059669', fontWeight: 600, display: 'block', marginTop: '6px' }}>
            {vitals.heartRate > 120 ? 'Elevated Pulse' : 'Resting Baseline (60-95)'}
          </span>
        </div>

        {/* 3. Body Temperature */}
        <div className="glass-panel glass-panel-hover" style={{
          padding: '20px',
          background: '#ffffff',
          borderLeft: `4px solid ${vitals.bodyTemp > 38.0 ? '#dc2626' : '#db2777'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Body Temperature</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(219, 39, 119, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Thermometer size={18} color="var(--primary-pink)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {vitals.bodyTemp}°C
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              ({(vitals.bodyTemp * 1.8 + 32).toFixed(1)}°F)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: vitals.bodyTemp > 38.0 ? '#dc2626' : '#059669', fontWeight: 600, display: 'block', marginTop: '6px' }}>
            {vitals.bodyTemp > 38.0 ? 'Fever / Thermal Warning' : 'Optimal Core Thermal'}
          </span>
        </div>

        {/* 4. Sleep Duration & Exercise Time */}
        <div className="glass-panel glass-panel-hover" style={{
          padding: '20px',
          background: '#ffffff',
          borderLeft: '4px solid #059669'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sleep & Exercise Time</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(5, 150, 105, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Moon size={18} color="#059669" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {vitals.sleepDuration} hrs
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Sleep Rest</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-violet)' }}>
                {vitals.exerciseTime} mins
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Active Workout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Trend Graph & Simulation Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Telemetry History Graph */}
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary-violet)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Live Telemetry Trend Stream</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0891b2' }} /> Oxygen %
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} /> Heart Rate BPM
              </span>
            </div>
          </div>

          {/* SVG Sparkline visualization */}
          <div style={{ height: '170px', width: '100%', position: 'relative' }}>
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="100%" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="85" x2="100%" y2="85" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="100%" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* SpO2 Line */}
              {history.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="3"
                  points={history.map((pt, i) => {
                    const x = (i / (history.length - 1)) * 100 + '%';
                    const y = 160 - ((pt.oxygenLevel - 80) / 20) * 130;
                    return `${(i / (history.length - 1)) * 600},${y}`;
                  }).join(' ')}
                />
              )}

              {/* Heart Rate Line */}
              {history.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  points={history.map((pt, i) => {
                    const y = 160 - ((pt.heartRate - 50) / 100) * 130;
                    return `${(i / (history.length - 1)) * 600},${y}`;
                  }).join(' ')}
                />
              )}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            <span>{history[0]?.time || 'T-30s'}</span>
            <span>Live Ticker Active (2.5s update)</span>
            <span>{history[history.length - 1]?.time || 'Now'}</span>
          </div>
        </div>

        {/* Interactive Simulation Controls */}
        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sliders size={18} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Simulation Controls</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Inject telemetry events to test alert thresholds and Nora AI responses.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleSimulateLowOxygen}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.3)', background: 'rgba(220, 38, 38, 0.04)' }}
              >
                <Zap size={14} color="#dc2626" />
                <span>Simulate SpO2 Drop (&lt; 90%)</span>
              </button>

              <button
                onClick={handleSimulateExerciseSpike}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.3)' }}
              >
                <Activity size={14} color="#d97706" />
                <span>Simulate Workout Pulse Spike</span>
              </button>

              <button
                onClick={handleSimulateFever}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', color: '#db2777', borderColor: 'rgba(219, 39, 119, 0.3)' }}
              >
                <Thermometer size={14} color="#db2777" />
                <span>Simulate Fever Spike (&gt; 38.5°C)</span>
              </button>

              <button
                onClick={handleResetNominal}
                className="btn-primary"
                style={{ justifyContent: 'center', marginTop: '6px' }}
              >
                <RefreshCw size={14} />
                <span>Reset to Nominal Data</span>
              </button>
            </div>
          </div>

          {/* Ask Nora AI button */}
          <button
            onClick={() => onAskNoraAboutVitals && onAskNoraAboutVitals(`Astronaut Nora Vance Vitals: Status ${status.toUpperCase()}, SpO2 ${vitals.oxygenLevel}%, HR ${vitals.heartRate} BPM, Temp ${vitals.bodyTemp}°C.`)}
            className="btn-secondary"
            style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              background: 'rgba(124, 58, 237, 0.08)',
              borderColor: 'var(--border-glow)',
              color: 'var(--primary-violet)'
            }}
          >
            <Sparkles size={14} />
            <span>Consult Nora AI on Vitals</span>
          </button>
        </div>
      </div>

      {/* Alert Notification Log Panel */}
      <div className="glass-panel" style={{ padding: '20px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Bell size={16} color="var(--primary-cyan)" />
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>Telemetry Alert Event Log</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
          {alerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: alt.severity === 'critical' ? 'rgba(220, 38, 38, 0.06)' : alt.severity === 'warning' ? 'rgba(217, 119, 6, 0.06)' : 'rgba(241, 245, 249, 0.6)',
                border: `1px solid ${alt.severity === 'critical' ? 'rgba(220, 38, 38, 0.2)' : alt.severity === 'warning' ? 'rgba(217, 119, 6, 0.2)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  background: alt.severity === 'critical' ? '#dc2626' : alt.severity === 'warning' ? '#d97706' : '#059669',
                  color: '#ffffff'
                }}>
                  {alt.severity}
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{alt.message}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {alt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
