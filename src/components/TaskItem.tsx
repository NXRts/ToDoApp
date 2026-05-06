'use client';

import { Task, TodoList } from '@/types/todo';
import { ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  listDetails?: TodoList;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TaskItem({ task, onToggle, listDetails, onClick, isSelected }: TaskItemProps) {
  return (
    <div 
      onClick={onClick}
      className={twMerge(
        "group flex items-start gap-4 py-4 border-b border-border transition-colors px-2 rounded-lg -mx-2 cursor-pointer",
        isSelected ? "bg-muted/50" : "hover:bg-muted/30"
      )}
    >
      {/* Checkbox */}
      <div 
        className="pt-0.5 shrink-0" 
        onClick={(e) => e.stopPropagation()} // Prevent opening task details when just checking off
      >
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          aria-label="Toggle task completion"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={twMerge(
            'text-sm font-medium truncate transition-all duration-300',
            task.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
        >
          {task.title}
        </span>
        
        {/* Metadata row */}
        {(task.deadline || (task.subtasks && task.subtasks.length > 0) || listDetails) && (
          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium">
            {task.deadline && (
              <span className="flex items-center gap-1.5 text-muted-foreground border border-border px-2 py-0.5 rounded-md bg-muted/50">
                <Calendar size={12} />
                {format(new Date(task.deadline), 'dd-MM-yy')}
              </span>
            )}
            
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="flex items-center gap-1.5 text-muted-foreground border border-border px-2 py-0.5 rounded-md bg-muted/50">
                <span className="w-4 h-4 bg-border/80 text-[10px] rounded-sm flex items-center justify-center text-foreground font-bold">
                  {task.subtasks.length}
                </span>
                Subtasks
              </span>
            )}

            {listDetails && (
              <span className="flex items-center gap-1.5 text-muted-foreground border border-transparent px-1 py-0.5">
                <span className={twMerge("w-2.5 h-2.5 rounded-sm", listDetails.color)}></span>
                {listDetails.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action / Arrow */}
      <div className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-border rounded-md transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
