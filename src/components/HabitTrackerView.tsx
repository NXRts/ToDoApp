'use client';

import { Habit } from '@/types/todo';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface HabitTrackerViewProps {
  habits: Habit[];
  onToggleHabit: (id: string, date: string) => void;
  onAddHabit: () => void;
}

export function HabitTrackerView({ habits, onToggleHabit, onAddHabit }: HabitTrackerViewProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: number) => {
    setWeekStart(prev => addDays(prev, direction * 7));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors border border-border/50"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold min-w-[200px] text-center">
            {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd, yyyy')}
          </h2>
          <button 
            onClick={() => navigateWeek(1)}
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

      {/* Habit Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border w-[250px]">Habit</th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="p-4 text-center border-b border-border">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(day, 'EEE')}</span>
                      <span className={twMerge(
                        "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold",
                        isSameDay(day, new Date()) ? "bg-foreground text-background" : "text-foreground"
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {habits.map(habit => (
                <tr key={habit.id} className="group hover:bg-muted/10 transition-colors">
                  <td className="p-6 border-r border-border/50">
                    <div className="flex items-center gap-4">
                      <div className={twMerge("w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm", habit.color)}>
                        {habit.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{habit.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                          {habit.frequency} • Goal: {habit.goal}/7
                        </span>
                      </div>
                    </div>
                  </td>
                  {weekDays.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.logs.find(l => l.date === dateStr)?.completed;
                    
                    return (
                      <td key={dateStr} className="p-4 text-center">
                        <button
                          onClick={() => onToggleHabit(habit.id, dateStr)}
                          className={twMerge(
                            "w-10 h-10 rounded-2xl border-2 transition-all flex items-center justify-center group/check",
                            isCompleted 
                              ? twMerge(habit.color, "border-transparent text-white shadow-md scale-105") 
                              : "border-border/50 hover:border-foreground/20 bg-transparent text-transparent hover:text-muted-foreground/30"
                          )}
                        >
                          <Check size={20} className={twMerge("transition-transform", isCompleted ? "scale-100" : "scale-0 group-hover/check:scale-100")} strokeWidth={4} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {habits.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-20 text-center text-muted-foreground italic">
                    No habits tracked yet. Start your first one today!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Current Streak</p>
          <h3 className="text-3xl font-black text-indigo-600">12 Days</h3>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Completion Rate</p>
          <h3 className="text-3xl font-black text-emerald-600">84%</h3>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Best Habit</p>
          <h3 className="text-3xl font-black text-orange-600">Meditation</h3>
        </div>
      </div>
    </div>
  );
}
