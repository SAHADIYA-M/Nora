import React, { useState } from 'react';
import { 
  GitFork, 
  Play, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Layers,
  Settings2
} from 'lucide-react';
import { WorkflowNode } from '../types';

export const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'node-1',
      title: 'Incoming Webhook / RSS Feed',
      type: 'trigger',
      icon: 'Radio',
      description: 'Listens for new product updates or GitHub commits.',
      status: 'success',
      config: { endpoint: 'https://api.nora.ai/v1/webhook/github' }
    },
    {
      id: 'node-2',
      title: 'Nora Architect AI Processor',
      type: 'ai_process',
      icon: 'Cpu',
      description: 'Analyzes payload, extracts technical diffs, and formats markdown summary.',
      status: 'idle',
      config: { model: 'Nora-v2.4-Turbo', temperature: 0.2 }
    },
    {
      id: 'node-3',
      title: 'Send Slack & Task Hub Sync',
      type: 'output',
      icon: 'Send',
      description: 'Posts synthesized updates to team channel and appends to Nora Tasks.',
      status: 'idle',
      config: { channel: '#dev-announcements' }
    }
  ]);

  const [isRunningTest, setIsRunningTest] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[16:40:02] Pipeline initialized.',
    '[16:40:05] Trigger listener active on port 443.'
  ]);

  const handleRunPipelineTest = () => {
    setIsRunningTest(true);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] 🚀 Initiating Pipeline Test Run...`]);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === 'node-1' ? { ...n, status: 'success' } : n))
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Node 1 (Trigger): Webhook payload received.`]);
    }, 800);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === 'node-2' ? { ...n, status: 'success' } : n))
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Node 2 (AI Processor): Nora generated 4 summary items.`]);
    }, 1800);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === 'node-3' ? { ...n, status: 'success' } : n))
      );
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] 🎉 Node 3 (Output): Task synced & notification dispatched!`]);
      setIsRunningTest(false);
    }, 2800);
  };

  const handleAddNode = (type: 'trigger' | 'ai_process' | 'output') => {
    const title = type === 'trigger' ? 'Schedule Cron Trigger' : type === 'ai_process' ? 'Nora Translation Step' : 'Email Digest Dispatch';
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      title,
      type,
      icon: type === 'trigger' ? 'Radio' : type === 'ai_process' ? 'Cpu' : 'Send',
      description: 'Custom user defined pipeline step.',
      status: 'idle',
      config: { enabled: true }
    };

    setNodes((prev) => [...prev, newNode]);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Added node: ${title}`]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', gap: '20px', overflowY: 'auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitFork size={24} color="var(--primary-violet)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Nora Automation Pipelines</h2>
            <span className="badge-cyan">Visual Node Engine</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Chain triggers, AI assistant nodes, and action outputs into automated background workflows.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handleAddNode('ai_process')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Plus size={15} /> Add AI Step
          </button>

          <button
            onClick={handleRunPipelineTest}
            disabled={isRunningTest}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Play size={16} fill="#fff" />
            <span>{isRunningTest ? 'Executing...' : 'Run Test Flow'}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Node Flow */}
      <div className="glass-panel" style={{
        padding: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        minHeight: '260px',
        background: '#ffffff',
        position: 'relative',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-card)'
      }}>
        {nodes.map((node, index) => {
          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div style={{
                width: '260px',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: `1px solid ${node.status === 'success' ? '#059669' : 'var(--border-subtle)'}`,
                boxShadow: node.status === 'success' ? '0 0 20px rgba(5, 150, 105, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.04)',
                transition: 'all var(--transition-smooth)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: node.type === 'trigger' ? 'rgba(8, 145, 178, 0.1)' : node.type === 'ai_process' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(219, 39, 119, 0.1)',
                    color: node.type === 'trigger' ? '#0891b2' : node.type === 'ai_process' ? '#7c3aed' : '#db2777'
                  }}>
                    {node.type.replace('_', ' ')}
                  </span>

                  {node.status === 'success' ? (
                    <CheckCircle2 size={16} color="#059669" />
                  ) : (
                    <Clock size={16} color="var(--text-dim)" />
                  )}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>{node.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                  {node.description}
                </p>

                <div style={{
                  padding: '8px 10px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Settings2 size={12} color="var(--primary-violet)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {JSON.stringify(node.config)}
                  </span>
                </div>
              </div>

              {/* Arrow Connection */}
              {index < nodes.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-violet)' }}>
                  <ArrowRight size={22} style={{ animation: 'glowPulse 2s infinite' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Execution Logs Terminal Panel */}
      <div className="glass-panel" style={{ padding: '20px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Layers size={16} color="#38bdf8" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8' }}>Pipeline Execution Terminal Output</h3>
        </div>

        <div style={{
          height: '140px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: '#38bdf8',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
