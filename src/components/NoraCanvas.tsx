import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Wand2, 
  CheckSquare, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  RefreshCw,
  BookOpen,
  Zap,
  AlignLeft
} from 'lucide-react';
import { NoteDoc } from '../types';

interface NoraCanvasProps {
  initialContent?: string;
  onExtractTasks?: (tasks: string[]) => void;
}

export const NoraCanvas: React.FC<NoraCanvasProps> = ({ initialContent, onExtractTasks }) => {
  const [docs, setDocs] = useState<NoteDoc[]>([
    {
      id: 'doc-1',
      title: 'Nora Platform Product Strategy',
      content: initialContent || `# Nora Platform Product Overview\n\nNora is an intelligent workspace that integrates AI assistant personas, document synthesis, and visual automation pipelines.\n\n## Core Principles\n- **Seamless Frictionless UI**: Clean porcelain white aesthetic with instant response.\n- **Multi-Persona Intelligence**: Executive, Architect, Creative Muse, and Companion modes.\n- **Automation Node Engine**: Connect triggers to AI filters and external webhooks.`,
      tags: ['Product', 'AI Strategy', 'Nora'],
      lastUpdated: 'Today at 16:30',
      wordCount: 58
    },
    {
      id: 'doc-2',
      title: 'System Architecture Notes',
      content: `# System Architecture\n\n- Frontend: React + TypeScript + Vite + Custom Light Theme Glassmorphism CSS\n- State Management: Reactive Context & Hooks\n- AI Engine Integration: Multi-threaded stream handling`,
      tags: ['Architecture', 'Tech Spec'],
      lastUpdated: 'Yesterday',
      wordCount: 24
    }
  ]);

  const [activeDocId, setActiveDocId] = useState<string>('doc-1');
  const [copied, setCopied] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const currentDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const updateCurrentDocContent = (newContent: string) => {
    const words = newContent.trim() ? newContent.trim().split(/\s+/).length : 0;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === activeDocId ? { ...d, content: newContent, wordCount: words, lastUpdated: 'Just now' } : d
      )
    );
  };

  const updateCurrentDocTitle = (newTitle: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === activeDocId ? { ...d, title: newTitle } : d))
    );
  };

  const handleCreateNewDoc = () => {
    const newDoc: NoteDoc = {
      id: `doc-${Date.now()}`,
      title: 'Untitled Note',
      content: '# New Document\n\nType your notes here or ask Nora to generate content.',
      tags: ['Draft'],
      lastUpdated: 'Just now',
      wordCount: 11
    };
    setDocs((prev) => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
  };

  const handleDeleteDoc = (id: string) => {
    if (docs.length <= 1) return;
    const filtered = docs.filter((d) => d.id !== id);
    setDocs(filtered);
    if (activeDocId === id) setActiveDocId(filtered[0].id);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(currentDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Transformations
  const triggerAITransform = (actionType: 'summarize' | 'enhance' | 'extract' | 'expand') => {
    setIsAIProcessing(true);
    setAiNotice(`Nora is applying AI transformation: ${actionType.toUpperCase()}...`);

    setTimeout(() => {
      let transformed = currentDoc.content;

      if (actionType === 'summarize') {
        transformed = `${currentDoc.content}\n\n---\n### Nora Executive Summary\n- Key Focus: High efficiency AI workspace platform.\n- Takeaway: Streamlines multi-modal productivity & task tracking.`;
      } else if (actionType === 'enhance') {
        transformed = currentDoc.content.replace(/\b(good|nice|help|make)\b/gi, (match) => {
          return match === 'good' ? 'exceptional' : match === 'help' ? 'empower' : 'engineer';
        });
      } else if (actionType === 'expand') {
        transformed = `${currentDoc.content}\n\n### Additional Architectural Considerations\n1. Real-time WebSocket synchronization across client nodes.\n2. Local persistence fallback with IndexedDB encryption.\n3. Dynamic token throttling for optimal latency.`;
      } else if (actionType === 'extract') {
        if (onExtractTasks) {
          onExtractTasks([
            'Implement local persistence fallback with IndexedDB',
            'Finalize real-time WebSocket sync protocol',
            'Conduct UI responsiveness audit for Nora'
          ]);
        }
        setAiNotice('Successfully extracted 3 tasks into Task Hub!');
        setIsAIProcessing(false);
        setTimeout(() => setAiNotice(null), 3000);
        return;
      }

      updateCurrentDocContent(transformed);
      setIsAIProcessing(false);
      setAiNotice(`Applied ${actionType} transformation!`);
      setTimeout(() => setAiNotice(null), 3000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: '#f8fafc' }}>
      {/* Left Documents List */}
      <div style={{
        width: '280px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Nora Canvas</h3>
            </div>
            <button
              onClick={handleCreateNewDoc}
              className="btn-primary"
              style={{ width: '30px', height: '30px', padding: 0, borderRadius: 'var(--radius-sm)' }}
              title="New Document"
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docs.map((d) => {
              const isActive = d.id === activeDocId;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDocId(d.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'rgba(124, 58, 237, 0.08)' : '#ffffff',
                    border: `1px solid ${isActive ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isActive ? '0 2px 8px rgba(124, 58, 237, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isActive ? 'var(--primary-violet)' : 'var(--text-main)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '180px'
                    }}>
                      {d.title}
                    </span>
                    {docs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(d.id);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {d.wordCount} words • {d.lastUpdated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Main Note Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Editor Toolbar */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <input
            type="text"
            value={currentDoc.title}
            onChange={(e) => updateCurrentDocTitle(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              outline: 'none',
              width: '60%'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopyContent}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* AI Smart Transformation Action Bar */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(124, 58, 237, 0.05)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-violet)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> AI Actions:
          </span>

          <button
            onClick={() => triggerAITransform('summarize')}
            disabled={isAIProcessing}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            <AlignLeft size={13} color="var(--primary-cyan)" /> Summarize
          </button>

          <button
            onClick={() => triggerAITransform('enhance')}
            disabled={isAIProcessing}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            <Wand2 size={13} color="var(--primary-pink)" /> Enhance Tone
          </button>

          <button
            onClick={() => triggerAITransform('expand')}
            disabled={isAIProcessing}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            <Zap size={13} color="var(--accent-amber)" /> Expand Ideas
          </button>

          <button
            onClick={() => triggerAITransform('extract')}
            disabled={isAIProcessing}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            <CheckSquare size={13} color="var(--accent-emerald)" /> Extract Tasks
          </button>
        </div>

        {/* AI Notice Banner */}
        {aiNotice && (
          <div style={{
            background: 'rgba(8, 145, 178, 0.1)',
            borderBottom: '1px solid rgba(8, 145, 178, 0.2)',
            padding: '8px 24px',
            fontSize: '0.8rem',
            color: '#0e7490',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <RefreshCw size={14} className={isAIProcessing ? 'spin' : ''} />
            <span>{aiNotice}</span>
          </div>
        )}

        {/* Note Content Textarea */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={currentDoc.content}
            onChange={(e) => updateCurrentDocContent(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem',
              lineHeight: '1.7',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="Type your notes or document markdown here..."
          />
        </div>
      </div>
    </div>
  );
};
