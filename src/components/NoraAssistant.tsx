import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  Code, 
  Copy, 
  Check, 
  FileText, 
  CheckSquare, 
  Terminal, 
  Wand2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { ChatMessage, Persona } from '../types';

interface NoraAssistantProps {
  activePersona: Persona;
  onSendToCanvas?: (text: string) => void;
  onSendToTasks?: (taskTitle: string) => void;
}

export const NoraAssistant: React.FC<NoraAssistantProps> = ({
  activePersona,
  onSendToCanvas,
  onSendToTasks
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'nora',
      text: activePersona.greeting,
      timestamp: 'Just now',
      personaId: activePersona.id,
      actions: ['Explore Nora Canvas', 'Build AI Pipeline', 'Review System Stats']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const promptPresets = [
    { title: 'System Architecture', icon: Terminal, prompt: 'Architect a high-performance web service with real-time sync for Nora.' },
    { title: 'Launch Copywriting', icon: Wand2, prompt: 'Write an inspiring launch pitch highlighting Nora’s AI productivity workflow.' },
    { title: 'Task Breakdown', icon: CheckSquare, prompt: 'Break down a full-stack web application development plan into actionable sprints.' },
    { title: 'AI Automation Pipeline', icon: Zap, prompt: 'Design an automated RSS to AI summary pipeline with automated notifications.' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let noraResponseText = `I have processed your request: "${text}". Here is a structured analysis prepared by Nora ${activePersona.badge}:`;
      let codeSnippet: ChatMessage['codeSnippet'];

      if (text.toLowerCase().includes('code') || text.toLowerCase().includes('architect') || text.toLowerCase().includes('system') || text.toLowerCase().includes('web')) {
        noraResponseText = `Here is a production-grade TypeScript snippet engineered for Nora's async execution engine:`;
        codeSnippet = {
          language: 'typescript',
          code: `import { NoraEngine, AgentContext } from '@nora/core';\n\nexport async function runWorkflow(context: AgentContext) {\n  const engine = new NoraEngine({\n    persona: '${activePersona.id}',\n    temperature: 0.7,\n    maxTokens: 4096\n  });\n\n  const result = await engine.execute({\n    input: context.prompt,\n    stream: true\n  });\n\n  return result.toFormattedResponse();\n}`
        };
      } else if (text.toLowerCase().includes('copy') || text.toLowerCase().includes('pitch') || text.toLowerCase().includes('launch')) {
        noraResponseText = `✨ **Nora Platform Launch Copy**\n\n"Meet Nora — where human vision meets artificial intelligence. Streamline your thought process, generate complex workflows, and amplify daily output without friction."`;
      } else if (text.toLowerCase().includes('task') || text.toLowerCase().includes('break')) {
        noraResponseText = `I have decomposed your workflow into 3 high-priority tasks:\n\n1. **Core Architecture**: Scaffold state management and UI tokens.\n2. **AI Integration**: Wire active persona pipelines with fallback logic.\n3. **Validation & Testing**: Run end-to-end user scenarios.`;
      }

      const noraMsg: ChatMessage = {
        id: `nora-${Date.now()}`,
        sender: 'nora',
        text: noraResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: activePersona.id,
        codeSnippet,
        actions: ['Send to Nora Canvas', 'Convert to Task Item', 'Refine Answer']
      };

      setMessages((prev) => [...prev, noraMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      background: 'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.03) 0%, rgba(248, 250, 252, 0) 70%)'
    }}>
      {/* Top Welcome / Persona Bar */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: `2px solid ${activePersona.accentColor}`,
            boxShadow: `0 0 12px ${activePersona.accentColor}30`
          }}>
            <img src={activePersona.avatar} alt="Nora" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{activePersona.name}</h2>
              <span className="badge-glow" style={{ borderColor: activePersona.accentColor, color: activePersona.accentColor }}>
                {activePersona.badge}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {activePersona.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{
            id: `msg-${Date.now()}`,
            sender: 'nora',
            text: activePersona.greeting,
            timestamp: 'Just now',
            personaId: activePersona.id
          }])}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <RefreshCw size={13} /> Reset Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.map((msg) => {
          const isNora = msg.sender === 'nora';
          return (
            <div
              key={msg.id}
              className="animate-fade-in"
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: isNora ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                alignSelf: isNora ? 'flex-start' : 'flex-end'
              }}
            >
              {isNora && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'var(--gradient-nora)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
                }}>
                  <Sparkles size={18} color="#fff" />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  background: isNora ? '#ffffff' : 'var(--gradient-nora)',
                  color: isNora ? 'var(--text-main)' : '#ffffff',
                  border: isNora ? '1px solid var(--border-subtle)' : 'none',
                  borderRadius: isNora ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
                  padding: '16px 20px',
                  boxShadow: isNora ? 'var(--shadow-card)' : '0 4px 18px rgba(124, 58, 237, 0.25)',
                  lineHeight: '1.6',
                  fontSize: '0.94rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}

                  {/* Formatted Code Block */}
                  {msg.codeSnippet && (
                    <div style={{
                      marginTop: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#94a3b8'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Code size={13} color="#38bdf8" />
                          <span>{msg.codeSnippet.language}</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          {copiedId === msg.id ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre style={{
                        padding: '14px',
                        fontSize: '0.83rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#38bdf8',
                        overflowX: 'auto',
                        margin: 0
                      }}>
                        <code>{msg.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Quick Action Chips for Nora responses */}
                {isNora && msg.actions && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <button
                      onClick={() => onSendToCanvas && onSendToCanvas(msg.text)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: 'var(--radius-full)' }}
                    >
                      <FileText size={12} color="var(--primary-violet)" /> Send to Canvas
                    </button>
                    <button
                      onClick={() => onSendToTasks && onSendToTasks(msg.text.slice(0, 40) + '...')}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: 'var(--radius-full)' }}
                    >
                      <CheckSquare size={12} color="var(--primary-cyan)" /> Create Task
                    </button>
                  </div>
                )}

                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  alignSelf: isNora ? 'flex-start' : 'flex-end',
                  padding: '0 4px'
                }}>
                  {msg.timestamp}
                </span>
              </div>

              {!isNora && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={18} color="#fff" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--gradient-nora)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div className="glass-panel" style={{
              padding: '12px 18px',
              borderRadius: '4px 18px 18px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nora is formulating a response</span>
              <span style={{ width: '4px', height: '4px', background: '#7c3aed', borderRadius: '50%', animation: 'typingBounce 1s infinite 0.1s' }} />
              <span style={{ width: '4px', height: '4px', background: '#0891b2', borderRadius: '50%', animation: 'typingBounce 1s infinite 0.3s' }} />
              <span style={{ width: '4px', height: '4px', background: '#db2777', borderRadius: '50%', animation: 'typingBounce 1s infinite 0.2s' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Prompts Bar */}
      <div style={{
        padding: '10px 24px',
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.5)'
      }}>
        {promptPresets.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)';
                e.currentTarget.style.borderColor = 'var(--border-glow)';
                e.currentTarget.style.color = 'var(--primary-violet)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Icon size={13} color="var(--primary-cyan)" />
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box Bar */}
      <div style={{
        padding: '16px 24px 24px 24px',
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            type="text"
            className="input-field"
            placeholder={`Ask Nora ${activePersona.badge} anything... (e.g. Architect a scalable feature, summarize notes)`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              paddingRight: '60px',
              height: '52px',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px solid var(--border-glow)'
            }}
          />

          <div style={{
            position: 'absolute',
            right: '6px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <button
              onClick={() => handleSendMessage()}
              className="btn-primary"
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
