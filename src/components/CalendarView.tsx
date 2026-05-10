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

const getColorClass = (color: string | undefined) => {
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

export function CalendarView({ tasks, lists, onTaskClick, selectedTaskId }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Day');
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
    d.setHours(0, 0, 0, 0); // Normalize to start of day
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [startOfCurrentWeek]);

  // Month calculations
  const monthDays = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Find the Monday of the first week
    const startDay = startOfMonth.getDay();
    const diff = startOfMonth.getDate() - startDay + (startDay === 0 ? -6 : 1);
    const calendarStart = new Date(new Date(startOfMonth).setDate(diff));
    calendarStart.setHours(0, 0, 0, 0);
    
    // Create a 6-week (42 day) grid to ensure we cover all possibilities
    return Array.from({ length: 42 }, (_, i) => addDays(calendarStart, i));
  }, [currentDate]);

  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const d = parseISO(task.deadline);
      const taskDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      
      if (viewMode === 'Day') return isSameDay(taskDate, currentDate);
      
      if (viewMode === 'Week') {
        const start = new Date(startOfCurrentWeek);
        const end = addDays(start, 7); // Exclusive end or use endOfDay on day 6
        return d >= start && d < end;
      }
      
      const firstVisible = monthDays[0];
      const lastVisible = addDays(monthDays[41], 1);
      return d >= firstVisible && d < lastVisible;
    });
  }, [tasks, currentDate, startOfCurrentWeek, monthDays, viewMode]);

  const getTimePosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h + m / 60) * 100;
  };

  const currentTimePosition = useMemo(() => {
    if (viewMode === 'Month') return -1;
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
    if (viewMode === 'Month') return format(currentDate, 'MMMM yyyy');
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
              onClick={() => setViewMode(mode)}
              className={twMerge(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                mode === viewMode ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (viewMode === 'Day') setCurrentDate(prev => subDays(prev, 1));
              else if (viewMode === 'Week') setCurrentDate(prev => subDays(prev, 7));
              else setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
            }} 
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => {
              if (viewMode === 'Day') setCurrentDate(prev => addDays(prev, 1));
              else if (viewMode === 'Week') setCurrentDate(prev => addDays(prev, 7));
              else setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
            }} 
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Timeline/Grid View */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar pr-4 -mr-4">
        {viewMode === 'Month' ? (
          <div className="grid grid-cols-7 border-t border-l border-border rounded-xl overflow-hidden">
            {/* Day of week labels */}
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="border-r border-b border-border p-3 text-[10px] font-bold text-muted-foreground bg-muted/20">
                {day}
              </div>
            ))}
            
            {/* Calendar Grid */}
            {monthDays.map(day => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isTodayDate = isSameDay(day, new Date());
              const dayTasks = visibleTasks.filter(t => isSameDay(parseISO(t.deadline), day));

              return (
                <div 
                  key={day.toISOString()} 
                  className={twMerge(
                    "border-r border-b border-border min-h-[120px] p-2 flex flex-col gap-1 transition-colors hover:bg-muted/10",
                    !isCurrentMonth && "bg-muted/5 opacity-50",
                    isTodayDate && "bg-muted/20"
                  )}
                >
                  <span className={twMerge(
                    "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1",
                    isTodayDate ? "bg-foreground text-background" : "text-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Task Bars */}
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dayTasks.map(task => {
                      const list = lists.find(l => l.id === task.category);
                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task.id);
                          }}
                          className={twMerge(
                            "h-6 px-2 rounded-md flex items-center cursor-pointer transition-all hover:brightness-95",
                            getColorClass(list?.color),
                            selectedTaskId === task.id && "ring-1 ring-inset ring-foreground shadow-sm"
                          )}
                        >
                          <span className="text-[10px] font-bold text-slate-900 truncate">
                            {task.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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

            {/* Time Grid (Day/Week) */}
            <div className={twMerge(
              "relative border-l border-border ml-20",
              viewMode === 'Week' && "grid grid-cols-7"
            )}>
              {/* Hour Labels */}
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
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground ml-[-5px]" />
                  <div className="flex-1 h-px bg-foreground" />
                </div>
              )}

              {/* Task Events */}
              {visibleTasks.map((task) => {
                const taskDate = parseISO(task.deadline);
                const top = getTimePosition(task.startTime || '00:00');
                const height = (task.duration || 60) * (100 / 60);
                const list = lists.find(l => l.id === task.category);
                
                let left = 0;
                let width = 100;
                
                if (viewMode === 'Week') {
                  const dayIndex = weekDays.findIndex(d => isSameDay(d, taskDate));
                  if (dayIndex === -1) return null;
                  left = (dayIndex / 7) * 100 + 0.5;
                  width = (1 / 7) * 100 - 1;
                } else {
                  left = 4;
                  width = 92;
                }

                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    className={twMerge(
                      "absolute rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col overflow-hidden border border-white/20",
                      getColorClass(list?.color),
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
        )}
      </div>
    </div>
  );
}
