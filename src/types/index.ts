export type ActiveTab = 'telemetry' | 'assistant' | 'canvas' | 'workflows' | 'tasks' | 'analytics';

export type PersonaId = 'executive' | 'creative' | 'architect' | 'friendly';

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  description: string;
  greeting: string;
  accentColor: string;
  systemPrompt: string;
}

export type HealthStatus = 'normal' | 'warning' | 'critical';

export interface AstronautHealthData {
  heartRate: number; // BPM (Normal: 60-95)
  oxygenLevel: number; // % SpO2 (Normal: 95-100, Warning: 90-94, Critical: < 90)
  bodyTemp: number; // °C (Normal: 36.5-37.5, Warning: >37.8, Critical: >38.5 or <35.5)
  sleepDuration: number; // Hours (e.g. 7.4 hrs)
  exerciseTime: number; // Minutes (e.g. 45 mins)
  suitPressure: number; // kPa (Normal: 29.6 - 31.0)
  respirationRate: number; // Breaths/min (12-20)
}

export interface TelemetryPoint {
  time: string;
  heartRate: number;
  oxygenLevel: number;
  bodyTemp: number;
}

export interface AlertLogItem {
  id: string;
  timestamp: string;
  severity: HealthStatus;
  parameter: string;
  message: string;
  acknowledged: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nora';
  text: string;
  timestamp: string;
  personaId?: PersonaId;
  codeSnippet?: {
    language: string;
    code: string;
  };
  actions?: string[];
  isThinking?: boolean;
}

export interface NoteDoc {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  wordCount: number;
}

export interface WorkflowNode {
  id: string;
  title: string;
  type: 'trigger' | 'ai_process' | 'output';
  icon: string;
  description: string;
  status: 'idle' | 'active' | 'success' | 'error';
  config: Record<string, any>;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  dueDate: string;
  subtasks: { id: string; title: string; done: boolean }[];
  aiSuggested?: boolean;
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}
