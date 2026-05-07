'use client';

import { useState, useMemo, useEffect } from 'react';
import { Task, TodoList } from '@/types/todo';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, parseISO, addDays, subDays, isSameDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface CalendarViewProps {
  tasks: Task[];
  lists: TodoList[];
  onTaskClick: (id: string) => void;
  selectedTaskId: string | null;
}

export function CalendarView({ tasks, lists, onTaskClick, selectedTaskId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time line every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      return isSameDay(parseISO(task.deadline), currentDate) && task.startTime;
    });
  }, [tasks, currentDate]);

  const getTimePosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h + m / 60) * 100; // 100px per hour
  };

  const currentTimePosition = useMemo(() => {
    if (!isSameDay(currentTime, currentDate)) return -1;
    return (currentTime.getHours() + currentTime.getMinutes() / 60) * 100;
  }, [currentTime, currentDate]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{format(currentDate, 'd MMMM yyyy')}</h2>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Add Event
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-muted p-1 rounded-lg">
          {['Day', 'Week', 'Month'].map(mode => (
            <button
              key={mode}
              className={twMerge(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                mode === 'Day' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(prev => subDays(prev, 1))} className="p-1 hover:bg-muted rounded-md transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(prev => addDays(prev, 1))} className="p-1 hover:bg-muted rounded-md transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Timeline View */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar pr-4 -mr-4">
        <div className="relative pt-4 pb-20">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-8 text-center">
            {format(currentDate, 'EEEE')}
          </div>

          {/* Time Grid */}
          <div className="relative border-l border-border ml-20">
            {hours.map(hour => (
              <div key={hour} className="h-[100px] border-t border-border relative">
                <span className="absolute -left-16 -top-2 text-[10px] font-bold text-muted-foreground text-right w-12">
                  {format(new Date().setHours(hour, 0), 'hh:00')}
                  <br />
                  <span className="opacity-60">{format(new Date().setHours(hour, 0), 'a')}</span>
                </span>
              </div>
            ))}

            {/* Current Time Line */}
            {currentTimePosition !== -1 && (
              <div 
                className="absolute left-0 right-0 z-10 flex items-center"
                style={{ top: `${currentTimePosition}px` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-foreground -ml-[5px]" />
                <div className="flex-1 h-[1px] bg-foreground" />
              </div>
            )}

            {/* Task Events */}
            {dayTasks.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')).map((task, index, array) => {
              const top = getTimePosition(task.startTime || '00:00');
              const height = (task.duration || 60) * (100 / 60);
              const list = lists.find(l => l.id === task.category);
              
              // Calculate overlaps for side-by-side display
              const overlaps = array.filter(t => {
                if (t.id === task.id) return false;
                const tTop = getTimePosition(t.startTime || '00:00');
                const tHeight = (t.duration || 60) * (100 / 60);
                return (top < tTop + tHeight && top + height > tTop);
              });

              const overlapIndex = array.slice(0, index).filter(t => {
                const tTop = getTimePosition(t.startTime || '00:00');
                const tHeight = (t.duration || 60) * (100 / 60);
                return (top < tTop + tHeight && top + height > tTop);
              }).length;

              const totalOverlaps = overlaps.length + 1;
              const width = 100 / totalOverlaps;
              const left = overlapIndex * width;

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className={twMerge(
                    "absolute rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] shadow-sm flex flex-col justify-center",
                    list ? list.color.replace('bg-', 'bg-').replace('-400', '-100') : "bg-amber-100",
                    "border border-white/20",
                    selectedTaskId === task.id && "ring-2 ring-foreground ring-offset-2"
                  )}
                  style={{ 
                    top: `${top}px`, 
                    height: `${height}px`,
                    left: `${left}%`,
                    width: `${width}%`,
                    zIndex: index
                  }}
                >
                  <span className="text-sm font-bold text-slate-900 mb-1 truncate">
                    {task.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
