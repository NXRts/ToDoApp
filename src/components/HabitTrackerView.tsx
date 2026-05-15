'use client';

import { Habit } from '@/types/todo';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, startOfMonth, getDaysInMonth, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface HabitTrackerViewProps {
  habits: Habit[];
  onToggleHabit: (id: string, date: string) => void;
  onAddHabit: () => void;
}

type TrackerViewMode = 'daily' | 'weekly' | 'monthly';

export function HabitTrackerView({ habits, onToggleHabit, onAddHabit }: HabitTrackerViewProps) {
  const [viewMode, setViewMode] = useState<TrackerViewMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Determine dates based on view mode
  let datesToRender: Date[] = [];
  let headerTitle = '';

  if (viewMode === 'daily') {
    datesToRender = [currentDate];
    headerTitle = format(currentDate, 'MMMM d, yyyy');
  } else if (viewMode === 'weekly') {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    datesToRender = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    headerTitle = `${format(weekStart, 'MMM dd')} - ${format(addDays(weekStart, 6), 'MMM dd, yyyy')}`;
  } else if (viewMode === 'monthly') {
    const monthStart = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    datesToRender = Array.from({ length: daysInMonth }).map((_, i) => addDays(monthStart, i));
    headerTitle = format(currentDate, 'MMMM yyyy');
  }

  const navigateDate = (direction: number) => {
    if (viewMode === 'daily') {
      setCurrentDate(prev => addDays(prev, direction));
    } else if (viewMode === 'weekly') {
      setCurrentDate(prev => direction > 0 ? addWeeks(prev, 1) : subWeeks(prev, 1));
    } else if (viewMode === 'monthly') {
      setCurrentDate(prev => direction > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
          {(['daily', 'weekly', 'monthly'] as TrackerViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={twMerge(
                "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                viewMode === mode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold min-w-[200px] text-center">
            {headerTitle}
          </h2>
          <button 
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button 
          onClick={onAddHabit}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Current Streak</p>
          <h3 className="text-3xl font-black text-indigo-600">12 Days</h3>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Completion Rate</p>
          <h3 className="text-3xl font-black text-emerald-600">84%</h3>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Best Habit</p>
          <h3 className="text-3xl font-black text-orange-600">Meditation</h3>
        </div>
      </div>

      {/* Habit Table Container */}
      <div className="bg-card border border-border rounded-none overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              {/* Chart Row */}
              <tr className="bg-card">
                <th className="p-4 px-4 border-r border-border/50 sticky left-0 z-20 bg-card align-bottom">
                  <div className="flex flex-col justify-end h-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Performance Chart</span>
                    <span className="text-xs font-black">{habits.length} Total Habits</span>
                  </div>
                </th>
                {datesToRender.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const completedCount = habits.filter(h => h.logs.find(l => l.date === dateStr)?.completed).length;
                  const maxCount = Math.max(habits.length, 1);
                  const heightPercentage = (completedCount / maxCount) * 100;
                  const isTodayMarker = isSameDay(day, new Date());

                  return (
                    <th key={`chart-${dateStr}`} className="p-0 border-b border-r border-border/30 align-bottom h-[100px] min-w-[28px] w-[28px]">
                      <div className="w-full h-full flex items-end justify-center pt-4 pb-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold py-0.5 px-1.5 rounded-none pointer-events-none z-30 whitespace-nowrap">
                          {completedCount}/{habits.length}
                        </div>
                        {/* Bar */}
                        <div 
                          className={twMerge(
                            "w-[12px] rounded-none transition-all duration-500",
                            isTodayMarker ? "bg-emerald-500" : (completedCount === habits.length && habits.length > 0) ? "bg-indigo-500" : "bg-emerald-500/20 group-hover:bg-emerald-500/50"
                          )}
                          style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                        ></div>
                      </div>
                    </th>
                  );
                })}
              </tr>
              {/* First Header Row (Days / Names) */}
              <tr className="bg-emerald-600">
                <th className="p-3 px-4 text-[11px] font-bold text-white uppercase tracking-widest border-r border-emerald-700/50 min-w-[180px] w-[180px] sticky left-0 z-20 bg-emerald-600 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {viewMode === 'monthly' ? format(currentDate, 'MMMM') : 'HABIT'}
                </th>
                {datesToRender.map(day => (
                  <th key={`header1-${day.toISOString()}`} className="p-1 text-center border-r border-emerald-700/50 text-white min-w-[28px] w-[28px]">
                    <span className="text-[11px] font-black">{format(day, 'd')}</span>
                  </th>
                ))}
              </tr>
              {/* Second Header Row (Weekdays) */}
              <tr className="bg-emerald-500/20">
                <th className="p-1 px-4 border-b border-r border-emerald-500/30 sticky left-0 z-20 bg-emerald-500/10 backdrop-blur-md"></th>
                {datesToRender.map(day => (
                  <th key={`header2-${day.toISOString()}`} className="p-0.5 text-center border-b border-r border-emerald-500/30">
                    <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">
                      {format(day, 'EEE')}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {habits.map(habit => (
                <tr key={habit.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="p-2 px-4 border-r border-border/50 sticky left-0 z-10 bg-card group-hover:bg-muted/5 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className={twMerge("w-7 h-7 rounded-none flex items-center justify-center text-sm shadow-sm shrink-0", habit.color)}>
                        {habit.icon}
                      </div>
                      <span className="font-bold text-xs text-foreground truncate max-w-[120px]">{habit.name}</span>
                    </div>
                  </td>
                  {datesToRender.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.logs.find(l => l.date === dateStr)?.completed;
                    const isTodayMarker = isSameDay(day, new Date());
                    
                    return (
                      <td key={dateStr} className={twMerge(
                        "p-1 text-center border-r border-border/30",
                        isTodayMarker ? "bg-muted/30" : ""
                      )}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => onToggleHabit(habit.id, dateStr)}
                            className={twMerge(
                              "w-5 h-5 rounded-none border-[1.5px] transition-all flex items-center justify-center group/check mx-auto",
                              isCompleted 
                                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                                : "border-border/60 hover:border-emerald-500/50 bg-transparent text-transparent hover:text-emerald-500/30"
                            )}
                          >
                            <Check size={12} className={twMerge("transition-transform", isCompleted ? "scale-100" : "scale-0 group-hover/check:scale-100")} strokeWidth={4} />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={datesToRender.length + 1} className="p-20 text-center text-muted-foreground italic sticky left-0">
                    No habits tracked yet. Start your first one today!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
