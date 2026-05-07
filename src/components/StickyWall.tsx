'use client';

import { Task, TodoList } from '@/types/todo';
import { Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StickyWallProps {
  tasks: Task[];
  lists: TodoList[];
  onTaskClick: (id: string) => void;
  onAddTask: () => void;
}

const getStickyColor = (color: string | undefined) => {
  switch (color) {
    case 'bg-red-400': return 'bg-red-100 border-red-200';
    case 'bg-cyan-400': return 'bg-cyan-100 border-cyan-200';
    case 'bg-yellow-400': return 'bg-yellow-100 border-yellow-200';
    case 'bg-blue-400': return 'bg-blue-100 border-blue-200';
    case 'bg-green-400': return 'bg-green-100 border-green-200';
    case 'bg-purple-400': return 'bg-purple-100 border-purple-200';
    case 'bg-pink-400': return 'bg-pink-100 border-pink-200';
    default: return 'bg-amber-100 border-amber-200';
  }
};

export function StickyWall({ tasks, lists, onTaskClick, onAddTask }: StickyWallProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => {
          const list = lists.find(l => l.id === task.category);
          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className={twMerge(
                "group relative min-h-[280px] p-8 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col",
                getStickyColor(list?.color),
                "border shadow-sm"
              )}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{task.title}</h3>
              <div className="text-slate-700 whitespace-pre-wrap flex-1 text-sm leading-relaxed overflow-hidden">
                {task.description || "No description provided."}
              </div>
              
              {/* Optional footer for tags/date if needed */}
              <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {list?.name || 'Personal'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add New Note Card */}
        <div
          onClick={onAddTask}
          className="min-h-[280px] rounded-3xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/30 hover:border-muted-foreground/30 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
