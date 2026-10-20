'use client';

import { useState, useEffect, useRef } from 'react';
import { TodoList, Priority } from '@/types/todo';
import { X, Calendar, Flag, Folder, Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, listId?: string, priority?: Priority, deadline?: string) => void;
  lists: TodoList[];
  defaultListId?: string | null;
}

export function QuickAddModal({
  isOpen,
  onClose,
  onAddTask,
  lists,
  defaultListId,
}: QuickAddModalProps) {
  const [title, setTitle] = useState('');
  const [selectedListId, setSelectedListId] = useState(defaultListId || (lists[0]?.id || ''));
  const [priority, setPriority] = useState<Priority>('Medium');
  const [deadlinePreset, setDeadlinePreset] = useState<'today' | 'tomorrow' | 'none'>('today');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle('');
    setPriority('Medium');
    setDeadlinePreset('today');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let deadline = '';
    if (deadlinePreset === 'today') {
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      deadline = now.toISOString();
    } else if (deadlinePreset === 'tomorrow') {
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      tmr.setHours(23, 59, 59, 999);
      deadline = tmr.toISOString();
    }

    onAddTask(title.trim(), selectedListId, priority, deadline);
    setTitle('');
    setPriority('Medium');
    setDeadlinePreset('today');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet */}
      <div className="relative w-full sm:max-w-md bg-card border border-border/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Drag handle indicator on mobile */}
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>New Task</span>
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground/40"
          />

          {/* Quick Shortcuts Row */}
          <div className="flex flex-col gap-3">
            {/* Due Date Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 w-16">
                <Calendar size={14} /> Due:
              </span>
              <div className="flex gap-1.5">
                {(['today', 'tomorrow', 'none'] as const).map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setDeadlinePreset(preset)}
                    className={twMerge(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize",
                      deadlinePreset === preset
                        ? "bg-foreground text-background font-bold"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {preset === 'none' ? 'No Date' : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 w-16">
                <Flag size={14} /> Priority:
              </span>
              <div className="flex gap-1.5">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={twMerge(
                      "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                      priority === p
                        ? p === 'High' ? "bg-red-500 text-white font-bold" : p === 'Medium' ? "bg-amber-500 text-white font-bold" : "bg-blue-500 text-white font-bold"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* List Selector */}
            {lists.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 w-16">
                  <Folder size={14} /> List:
                </span>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="bg-muted/40 border border-border/40 rounded-lg px-2.5 py-1 text-xs font-medium text-foreground focus:outline-none"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id} className="bg-card">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 mt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-border/60 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-sm"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
