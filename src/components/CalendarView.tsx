'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Task, TodoList } from '@/types/todo';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Calendar as CalendarIcon, 
  List, 
  Grid3X3,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { format, parseISO, addDays, subDays, isSameDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface CalendarViewProps {
  tasks: Task[];
  lists: TodoList[];
  onTaskClick: (id: string) => void;
  selectedTaskId: string | null;
  onAddEvent?: () => void;
  onToggleTask?: (id: string) => void;
}

const getColorClass = (color: string | undefined) => {
  switch (color) {
    case 'bg-red-400':
    case 'bg-red-500': return 'bg-red-100 text-red-950 border-red-200 dark:bg-red-950/70 dark:text-red-200 dark:border-red-800/50';
    case 'bg-cyan-400':
    case 'bg-cyan-500': return 'bg-cyan-100 text-cyan-950 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-200 dark:border-cyan-800/50';
    case 'bg-yellow-400':
    case 'bg-yellow-500': return 'bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800/50';
    case 'bg-blue-400':
    case 'bg-blue-500': return 'bg-blue-100 text-blue-950 border-blue-200 dark:bg-blue-950/70 dark:text-blue-200 dark:border-blue-800/50';
    case 'bg-green-400':
    case 'bg-green-500': return 'bg-emerald-100 text-emerald-950 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800/50';
    case 'bg-purple-400':
    case 'bg-purple-500': return 'bg-purple-100 text-purple-950 border-purple-200 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800/50';
    case 'bg-pink-400':
    case 'bg-pink-500': return 'bg-pink-100 text-pink-950 border-pink-200 dark:bg-pink-950/70 dark:text-pink-200 dark:border-pink-800/50';
    default: return 'bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800/50';
  }
};

const getDotColor = (color: string | undefined) => {
  switch (color) {
    case 'bg-red-400':
    case 'bg-red-500': return 'bg-red-500';
    case 'bg-cyan-400':
    case 'bg-cyan-500': return 'bg-cyan-500';
    case 'bg-yellow-400':
    case 'bg-yellow-500': return 'bg-amber-500';
    case 'bg-blue-400':
    case 'bg-blue-500': return 'bg-blue-500';
    case 'bg-green-400':
    case 'bg-green-500': return 'bg-emerald-500';
    case 'bg-purple-400':
    case 'bg-purple-500': return 'bg-purple-500';
    case 'bg-pink-400':
    case 'bg-pink-500': return 'bg-pink-500';
    default: return 'bg-amber-500';
  }
};

export function CalendarView({ 
  tasks, 
  lists, 
  onTaskClick, 
  selectedTaskId,
  onAddEvent,
  onToggleTask
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [monthMobileView, setMonthMobileView] = useState<'agenda' | 'grid'>('agenda');
  const timelineScrollRef = useRef<HTMLDivElement>(null);

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
        const end = addDays(start, 7);
        return d >= start && d < end;
      }
      
      const firstVisible = monthDays[0];
      const lastVisible = addDays(monthDays[41], 1);
      return d >= firstVisible && d < lastVisible;
    });
  }, [tasks, currentDate, startOfCurrentWeek, monthDays, viewMode]);

  // Tasks for selected day in Month mode
  const selectedDayTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const d = parseISO(task.deadline);
      return isSameDay(d, selectedDay);
    });
  }, [tasks, selectedDay]);

  const getTimePosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h + m / 60) * 100;
  };

  const currentTimePosition = useMemo(() => {
    if (viewMode === 'Month') return -1;
    if (viewMode === 'Day') {
      if (!isSameDay(currentTime, currentDate)) return -1;
    } else {
      if (currentTime < startOfCurrentWeek || currentTime > addDays(startOfCurrentWeek, 6)) return -1;
    }
    return (currentTime.getHours() + currentTime.getMinutes() / 60) * 100;
  }, [currentTime, currentDate, startOfCurrentWeek, viewMode]);

  // Auto-scroll timeline to current day and hour
  useEffect(() => {
    if (timelineScrollRef.current) {
      if (viewMode === 'Week') {
        const todayIndex = weekDays.findIndex(d => isSameDay(d, new Date()));
        if (todayIndex !== -1) {
          const colWidth = 94;
          const targetX = todayIndex * colWidth - 40;
          timelineScrollRef.current.scrollLeft = Math.max(0, targetX);
        }
      }
      
      const scrollY = currentTimePosition > 0 ? currentTimePosition - 150 : 800;
      timelineScrollRef.current.scrollTop = Math.max(0, scrollY);
    }
  }, [viewMode, weekDays, currentTimePosition]);

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
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
            {headerLabel}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Today Jump */}
          <button
            onClick={() => {
              const now = new Date();
              setCurrentDate(now);
              setSelectedDay(now);
            }}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors active:scale-95 cursor-pointer"
          >
            Today
          </button>

          {/* Add Event / Task button */}
          <button 
            onClick={onAddEvent}
            className="flex items-center gap-1.5 bg-foreground text-background px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Event</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex bg-muted/60 p-1 rounded-xl border border-border/50">
            {(['Day', 'Week', 'Month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={twMerge(
                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer active:scale-95",
                  mode === viewMode 
                    ? "bg-background text-foreground shadow-xs font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Mobile Month View Toggle: Agenda vs Grid */}
          {viewMode === 'Month' && (
            <div className="flex md:hidden bg-muted/60 p-1 rounded-xl border border-border/50">
              <button
                onClick={() => setMonthMobileView('agenda')}
                title="Agenda View"
                className={twMerge(
                  "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  monthMobileView === 'agenda' 
                    ? "bg-background text-foreground shadow-xs" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setMonthMobileView('grid')}
                title="Grid View"
                className={twMerge(
                  "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  monthMobileView === 'grid' 
                    ? "bg-background text-foreground shadow-xs" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Date Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => {
              if (viewMode === 'Day') setCurrentDate(prev => subDays(prev, 1));
              else if (viewMode === 'Week') setCurrentDate(prev => subDays(prev, 7));
              else setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
            }} 
            className="p-1.5 hover:bg-muted rounded-xl transition-colors border border-border/50 active:scale-95 cursor-pointer"
            aria-label="Previous date"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => {
              if (viewMode === 'Day') setCurrentDate(prev => addDays(prev, 1));
              else if (viewMode === 'Week') setCurrentDate(prev => addDays(prev, 7));
              else setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
            }} 
            className="p-1.5 hover:bg-muted rounded-xl transition-colors border border-border/50 active:scale-95 cursor-pointer"
            aria-label="Next date"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content View Container */}
      <div 
        ref={timelineScrollRef}
        className="flex-1 overflow-auto relative custom-scrollbar pr-1 pb-16"
      >
        {viewMode === 'Month' ? (
          <div>
            {/* 1. Mobile Agenda View (when in 'agenda' mode on mobile) */}
            <div className={twMerge(
              "flex flex-col gap-6",
              monthMobileView === 'agenda' ? "flex md:hidden" : "hidden"
            )}>
              {/* Compact Month Calendar Card */}
              <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 mb-2 text-center">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="text-[11px] font-bold text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* 42 Date Cells */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map(day => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isTodayDate = isSameDay(day, new Date());
                    const isSelectedDate = isSameDay(day, selectedDay);
                    const dayTasks = tasks.filter(t => t.deadline && isSameDay(parseISO(t.deadline), day));

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDay(day)}
                        className={twMerge(
                          "aspect-square h-9 sm:h-10 w-full rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer active:scale-95",
                          isSelectedDate 
                            ? "bg-foreground text-background font-black shadow-sm scale-105" 
                            : isTodayDate 
                              ? "border border-foreground/50 text-foreground font-bold hover:bg-muted" 
                              : "text-foreground hover:bg-muted/50",
                          !isCurrentMonth && (isSelectedDate ? "opacity-90" : "opacity-30")
                        )}
                      >
                        <span className="text-xs leading-none">
                          {format(day, 'd')}
                        </span>

                        {/* Task Dots */}
                        {dayTasks.length > 0 && (
                          <div className="flex items-center gap-0.5 mt-1 max-w-full overflow-hidden px-0.5">
                            {dayTasks.slice(0, 3).map((t, idx) => {
                              const list = lists.find(l => l.id === t.category);
                              return (
                                <span 
                                  key={idx} 
                                  className={twMerge(
                                    "w-1 h-1 rounded-full shrink-0",
                                    isSelectedDate ? "bg-background" : getDotColor(list?.color)
                                  )}
                                />
                              );
                            })}
                            {dayTasks.length > 3 && (
                              <span className={twMerge(
                                "text-[7px] font-bold leading-none",
                                isSelectedDate ? "text-background" : "text-muted-foreground"
                              )}>
                                +
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Agenda Section */}
              <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-muted-foreground" />
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {format(selectedDay, 'EEEE, d MMMM yyyy')}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'Task' : 'Tasks'}
                  </span>
                </div>

                {selectedDayTasks.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Tidak ada tugas pada tanggal ini</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Jadwal Anda bersih dan santai.</p>
                    </div>
                    {onAddEvent && (
                      <button
                        onClick={onAddEvent}
                        className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity active:scale-95 cursor-pointer"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        <span>Tambah Tugas</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedDayTasks.map(task => {
                      const list = lists.find(l => l.id === task.category);
                      return (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task.id)}
                          className={twMerge(
                            "group flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-border transition-all cursor-pointer active:scale-99",
                            selectedTaskId === task.id && "ring-2 ring-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {onToggleTask ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleTask(task.id);
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                              >
                                {task.isCompleted ? (
                                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/20" />
                                ) : (
                                  <Circle size={18} />
                                )}
                              </button>
                            ) : null}

                            <div className="flex flex-col min-w-0">
                              <span className={twMerge(
                                "text-sm font-bold truncate",
                                task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                              )}>
                                {task.title}
                              </span>
                              
                              <div className="flex items-center gap-2 mt-1">
                                {list && (
                                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                                    <span className={twMerge("w-2 h-2 rounded-full", list.color)} />
                                    {list.name}
                                  </span>
                                )}
                                {task.startTime && (
                                  <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                    <Clock size={10} />
                                    {task.startTime} ({task.duration || 60}m)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className={twMerge(
                              "px-2 py-0.5 rounded-md text-[10px] font-bold capitalize",
                              task.priority === 'High' ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                              task.priority === 'Medium' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                              "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            )}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Full Month Grid (Desktop or Mobile Grid View with Horizontal Scroll so it NEVER squishes!) */}
            <div className={twMerge(
              "overflow-x-auto custom-scrollbar pb-6",
              monthMobileView === 'grid' ? "block" : "hidden md:block"
            )}>
              <div className="min-w-180 md:min-w-full grid grid-cols-7 border-t border-l border-border rounded-2xl overflow-hidden bg-card shadow-xs">
                {/* Day of week labels */}
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} className="border-r border-b border-border/80 p-3 text-[11px] font-bold text-muted-foreground bg-muted/40 text-center uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Grid Cells */}
                {monthDays.map(day => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isTodayDate = isSameDay(day, new Date());
                  const dayTasks = visibleTasks.filter(t => isSameDay(parseISO(t.deadline), day));

                  return (
                    <div 
                      key={day.toISOString()} 
                      onClick={() => setSelectedDay(day)}
                      className={twMerge(
                        "border-r border-b border-border/60 min-h-30 p-2 flex flex-col gap-1 transition-colors hover:bg-muted/15 cursor-pointer",
                        !isCurrentMonth && "bg-muted/5 opacity-40",
                        isTodayDate && "bg-muted/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={twMerge(
                          "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all",
                          isTodayDate ? "bg-foreground text-background font-black" : "text-foreground"
                        )}>
                          {format(day, 'd')}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-bold text-muted-foreground px-1.5 py-0.2 rounded-full bg-muted/60">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                      
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
                                "h-6 px-2 rounded-lg flex items-center justify-between cursor-pointer transition-all hover:brightness-95 border border-black/5 dark:border-white/10 shadow-2xs",
                                getColorClass(list?.color),
                                selectedTaskId === task.id && "ring-1.5 ring-foreground shadow-xs font-bold"
                              )}
                            >
                              <span className="text-[10px] font-bold truncate">
                                {task.title}
                              </span>
                              {task.startTime && (
                                <span className="text-[9px] opacity-75 font-semibold ml-1 shrink-0">
                                  {task.startTime}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Day or Week Timeline Grid */
          <div className={twMerge(
            "relative pt-1 pb-20",
            viewMode === 'Week' ? "min-w-180 md:min-w-full" : "min-w-full"
          )}>
            {/* Day Headers Row */}
            <div className="flex sticky top-0 bg-background/95 backdrop-blur-md z-30 mb-2 border-b border-border/80">
              {/* Corner above Hour labels */}
              <div className="w-14 sm:w-16 shrink-0 sticky left-0 z-40 bg-background/95 backdrop-blur-md border-r border-border/80 flex items-center justify-center">
                <Clock size={14} className="text-muted-foreground" />
              </div>

              {/* Day headers */}
              <div className={twMerge(
                "flex-1 grid",
                viewMode === 'Day' ? "grid-cols-1" : "grid-cols-7"
              )}>
                {viewMode === 'Day' ? (
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center py-2">
                    {format(currentDate, 'EEEE, d MMMM yyyy')}
                  </div>
                ) : (
                  weekDays.map(day => {
                    const isTodayDate = isSameDay(day, new Date());
                    return (
                      <div key={day.toISOString()} className="flex flex-col items-center py-2 px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {format(day, 'EEE')}
                        </span>
                        <span className={twMerge(
                          "text-xs sm:text-sm font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mt-1 transition-all",
                          isTodayDate ? "bg-foreground text-background shadow-xs font-black" : "text-foreground hover:bg-muted"
                        )}>
                          {format(day, 'd')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Time Grid with Sticky Hour Labels */}
            <div className="flex relative">
              {/* Hour Labels Column (Pinned on Left Edge when scrolling horizontally!) */}
              <div className="w-14 sm:w-16 shrink-0 sticky left-0 z-20 bg-background/95 backdrop-blur-md border-r border-border/80">
                {hours.map(hour => (
                  <div key={hour} className="h-25 relative flex items-start justify-end pr-2 pt-1 border-t border-transparent">
                    <span className="text-[10px] font-bold text-muted-foreground text-right leading-none select-none">
                      {format(new Date().setHours(hour, 0), 'hh:00')}
                      <span className="text-[8px] font-normal opacity-70 block">{format(new Date().setHours(hour, 0), 'a')}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Columns Grid */}
              <div className={twMerge(
                "relative flex-1 grid border-r border-border/40",
                viewMode === 'Week' ? "grid-cols-7" : "grid-cols-1"
              )}>
                {viewMode === 'Week' ? (
                  weekDays.map(day => (
                    <div 
                      key={day.toISOString()} 
                      className={twMerge(
                        "border-r border-border/40 relative min-h-600",
                        isSameDay(day, new Date()) && "bg-muted/15"
                      )}
                    >
                      {hours.map(hour => (
                        <div key={hour} className="h-25 border-t border-border/60" />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="relative min-h-600">
                    {hours.map(hour => (
                      <div key={hour} className="h-25 border-t border-border/60" />
                    ))}
                  </div>
                )}

                {/* Current Time Line */}
                {currentTimePosition !== -1 && (
                  <div 
                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                    style={{ top: `${currentTimePosition}px` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs -ml-1.25" />
                    <div className="flex-1 h-0.5 bg-red-500/80 shadow-xs" />
                  </div>
                )}

                {/* Task Event Cards (Spacious, Beautiful & Never Gepeng!) */}
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
                    left = (dayIndex / 7) * 100 + 0.4;
                    width = (1 / 7) * 100 - 0.8;
                  } else {
                    left = 2;
                    width = 96;
                  }

                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task.id)}
                      className={twMerge(
                        "absolute rounded-xl p-2 sm:p-2.5 cursor-pointer transition-all hover:scale-[1.01] shadow-xs flex flex-col overflow-hidden border border-black/5 dark:border-white/10",
                        getColorClass(list?.color),
                        selectedTaskId === task.id && "ring-2 ring-foreground ring-offset-1 z-30 font-bold"
                      )}
                      style={{ 
                        top: `${top}px`, 
                        height: `${Math.max(height, 36)}px`,
                        left: `${left}%`,
                        width: `${width}%`,
                        zIndex: 10
                      }}
                    >
                      <span className="text-xs font-bold leading-tight line-clamp-2">
                        {task.title}
                      </span>
                      {task.startTime && (
                        <span className="text-[10px] opacity-80 font-semibold mt-0.5 truncate">
                          {task.startTime} ({task.duration || 60}m)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
