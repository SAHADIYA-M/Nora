import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Trash2, 
  Check, 
  Wand2
} from 'lucide-react';
import { TaskItem } from '../types';

interface TaskManagerProps {
  initialTasks?: TaskItem[];
}

export const TaskManager: React.FC<TaskManagerProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks || [
    {
      id: 'task-1',
      title: 'Scaffold Nora UI Architecture & Light Theme',
      category: 'Frontend',
      priority: 'high',
      completed: true,
      dueDate: 'Today',
      subtasks: [
        { id: 'sub-1', title: 'Define CSS Glassmorphism design tokens', done: true },
        { id: 'sub-2', title: 'Setup Outfit & JetBrains Mono typography', done: true }
      ]
    },
    {
      id: 'task-2',
      title: 'Implement Multi-Persona AI Assistant Switching',
      category: 'AI Engine',
      priority: 'urgent',
      completed: false,
      dueDate: 'Today',
      subtasks: [
        { id: 'sub-3', title: 'Integrate Architect, Creative, Executive, and Companion personas', done: true },
        { id: 'sub-4', title: 'Add voice synth animation indicator', done: false }
      ],
      aiSuggested: true
    },
    {
      id: 'task-3',
      title: 'Deploy Visual Automation Workflow Test Suite',
      category: 'Backend Node',
      priority: 'medium',
      completed: false,
      dueDate: 'Tomorrow',
      subtasks: [
        { id: 'sub-5', title: 'Add test runner logs console', done: false }
      ]
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('medium');
  const [isDecomposingId, setIsDecomposingId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      category: 'Productivity',
      priority: newTaskPriority,
      completed: false,
      dueDate: 'Soon',
      subtasks: []
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleSubtask = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s))
            }
          : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // AI Subtask Breakdown Generator
  const handleAISubtaskDecompose = (taskId: string, title: string) => {
    setIsDecomposingId(taskId);

    setTimeout(() => {
      const generatedSubtasks = [
        { id: `sub-${Date.now()}-1`, title: `Analyze prerequisites for "${title.slice(0, 20)}..."`, done: false },
        { id: `sub-${Date.now()}-2`, title: 'Execute implementation & unit tests', done: false },
        { id: `sub-${Date.now()}-3`, title: 'Review output with Nora Assistant', done: false }
      ];

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...generatedSubtasks] } : t))
      );
      setIsDecomposingId(null);
    }, 1000);
  };

  const getPriorityBadgeClass = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'urgent': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', color: '#dc2626' };
      case 'high': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', color: '#d97706' };
      case 'medium': return { bg: 'rgba(8, 145, 178, 0.1)', border: 'rgba(8, 145, 178, 0.25)', color: '#0891b2' };
      default: return { bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.25)', color: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', gap: '20px', overflowY: 'auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={24} color="var(--primary-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Nora Task Hub</h2>
            <span className="badge-glow">AI Subtask Decomposition</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Organize priorities and let Nora break down complex goals into executable steps.
          </p>
        </div>
      </div>

      {/* Add Task Input Bar */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', gap: '12px', alignItems: 'center', background: '#ffffff' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Add a new task (e.g., Optimize Nora response latency)..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          style={{ flex: 1, background: '#f8fafc' }}
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as TaskItem['priority'])}
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-main)',
            padding: '12px',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>

        <button onClick={handleAddTask} className="btn-primary" style={{ height: '44px', padding: '0 20px' }}>
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Task List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => {
          const prioStyle = getPriorityBadgeClass(task.priority);
          return (
            <div
              key={task.id}
              className="glass-panel"
              style={{
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#ffffff',
                opacity: task.completed ? 0.65 : 1,
                transition: 'all var(--transition-smooth)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: `2px solid ${task.completed ? '#059669' : 'var(--border-subtle)'}`,
                      background: task.completed ? '#059669' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {task.completed && <Check size={14} />}
                  </button>

                  <div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'var(--text-muted)' : 'var(--text-main)'
                    }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Category: {task.category} • Due: {task.dueDate}
                      </span>
                      {task.aiSuggested && (
                        <span className="badge-glow" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          <Sparkles size={10} /> Nora Suggested
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: prioStyle.bg,
                    border: `1px solid ${prioStyle.border}`,
                    color: prioStyle.color
                  }}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleAISubtaskDecompose(task.id, task.title)}
                    disabled={isDecomposingId === task.id}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
                    title="Ask Nora to generate subtasks"
                  >
                    <Wand2 size={13} color="var(--primary-violet)" />
                    <span>{isDecomposingId === task.id ? 'Decomposing...' : 'AI Subtasks'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subtasks Accordion */}
              {task.subtasks.length > 0 && (
                <div style={{
                  marginTop: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingLeft: '36px'
                }}>
                  {task.subtasks.map((sub) => (
                    <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={sub.done}
                        onChange={() => handleToggleSubtask(task.id, sub.id)}
                        style={{ cursor: 'pointer', accentColor: 'var(--primary-violet)' }}
                      />
                      <span style={{
                        fontSize: '0.85rem',
                        color: sub.done ? 'var(--text-dim)' : 'var(--text-main)',
                        textDecoration: sub.done ? 'line-through' : 'none'
                      }}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
