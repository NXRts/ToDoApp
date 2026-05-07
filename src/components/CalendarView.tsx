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
  const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Day');
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

  // Get start of week (Monday)
  const startOfCurrentWeek = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [startOfCurrentWeek]);

  const weekTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.deadline || !task.startTime) return false;
      const d = parseISO(task.deadline);
      if (viewMode === 'Day') return isSameDay(d, currentDate);
      return d >= startOfCurrentWeek && d <= addDays(startOfCurrentWeek, 6);
    });
  }, [tasks, currentDate, startOfCurrentWeek, viewMode]);

  const getTimePosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h + m / 60) * 100; // 100px per hour
  };

  const currentTimePosition = useMemo(() => {
    // Current time line should show if today is within the visible range
    const today = new Date();
    if (viewMode === 'Day') {
      if (!isSameDay(currentTime, currentDate)) return -1;
    } else {
      if (currentTime < startOfCurrentWeek || currentTime > addDays(startOfCurrentWeek, 6)) return -1;
    }
    return (currentTime.getHours() + currentTime.getMinutes() / 60) * 100;
  }, [currentTime, currentDate, startOfCurrentWeek, viewMode]);

  const headerLabel = useMemo(() => {
    if (viewMode === 'Day') return format(currentDate, 'd MMMM yyyy');
    const endOfWeek = addDays(startOfCurrentWeek, 6);
    if (startOfCurrentWeek.getMonth() === endOfWeek.getMonth()) {
      return `${format(startOfCurrentWeek, 'd')}-${format(endOfWeek, 'd')} ${format(endOfWeek, 'MMMM yyyy')}`;
    }
    return `${format(startOfCurrentWeek, 'd MMM')} - ${format(endOfWeek, 'd MMM yyyy')}`;
  }, [currentDate, startOfCurrentWeek, viewMode]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{headerLabel}</h2>
        <button className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Add Event
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-muted p-1 rounded-lg">
          {(['Day', 'Week', 'Month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => mode !== 'Month' && setViewMode(mode)}
              className={twMerge(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                mode === viewMode ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
                mode === 'Month' && "opacity-50 cursor-not-allowed"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentDate(prev => viewMode === 'Day' ? subDays(prev, 1) : subDays(prev, 7))} 
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(prev => viewMode === 'Day' ? addDays(prev, 1) : addDays(prev, 7))} 
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Timeline View */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar pr-4 -mr-4">
        <div className="relative pt-4 pb-20">
          {/* Day Headers (only for Week mode) */}
          <div className={twMerge(
            "grid ml-20 sticky top-0 bg-background/80 backdrop-blur-sm z-20 mb-4",
            viewMode === 'Day' ? "grid-cols-1" : "grid-cols-7"
          )}>
            {viewMode === 'Day' ? (
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center py-2">
                {format(currentDate, 'EEEE')}
              </div>
            ) : (
              weekDays.map(day => (
                <div key={day.toISOString()} className="flex flex-col items-center py-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {format(day, 'EEE')}
                  </span>
                  <span className={twMerge(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mt-1",
                    isSameDay(day, new Date()) ? "bg-foreground text-background" : "text-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Time Grid */}
          <div className={twMerge(
            "relative border-l border-border ml-20",
            viewMode === 'Week' && "grid grid-cols-7"
          )}>
            {/* Hour Labels (Absolute to the left) */}
            <div className="absolute -left-20 top-0 bottom-0 w-20">
              {hours.map(hour => (
                <div key={hour} className="h-[100px] relative">
                  <span className="absolute right-4 -top-2 text-[10px] font-bold text-muted-foreground text-right">
                    {format(new Date().setHours(hour, 0), 'hh:00')}
                    <br />
                    <span className="opacity-60">{format(new Date().setHours(hour, 0), 'a')}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Background */}
            {viewMode === 'Week' ? (
              weekDays.map(day => (
                <div key={day.toISOString()} className={twMerge(
                  "border-r border-border relative min-h-[2400px]",
                  isSameDay(day, new Date()) && "bg-muted/30"
                )}>
                  {hours.map(hour => (
                    <div key={hour} className="h-[100px] border-t border-border" />
                  ))}
                </div>
              ))
            ) : (
              hours.map(hour => (
                <div key={hour} className="h-[100px] border-t border-border" />
              ))
            )}

            {/* Current Time Line */}
            {currentTimePosition !== -1 && (
              <div 
                className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                style={{ top: `${currentTimePosition}px` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-foreground -ml-[5px]" />
                <div className="flex-1 h-[1px] bg-foreground" />
              </div>
            )}

            {/* Task Events */}
            {weekTasks.map((task) => {
              const taskDate = parseISO(task.deadline);
              const top = getTimePosition(task.startTime || '00:00');
              const height = (task.duration || 60) * (100 / 60);
              const list = lists.find(l => l.id === task.category);
              
              // Calculate horizontal position for Week view
              let left = 0;
              let width = 100;
              
              if (viewMode === 'Week') {
                const dayIndex = weekDays.findIndex(d => isSameDay(d, taskDate));
                if (dayIndex === -1) return null;
                left = (dayIndex / 7) * 100 + 0.5;
                width = (1 / 7) * 100 - 1;
              } else {
                // Same logic as before for Day view (simplified side-by-side for Day view omitted for brevity in Week mode but can be added back)
                left = 4;
                width = 92;
              }

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className={twMerge(
                    "absolute rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col overflow-hidden",
                    list ? list.color.replace('bg-', 'bg-').replace('-400', '-100') : "bg-amber-100",
                    "border border-white/20",
                    selectedTaskId === task.id && "ring-2 ring-foreground ring-offset-2 z-30"
                  )}
                  style={{ 
                    top: `${top}px`, 
                    height: `${height}px`,
                    left: `${left}%`,
                    width: `${width}%`,
                    zIndex: 10
                  }}
                >
                  <span className="text-xs font-bold text-slate-900 leading-tight">
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
