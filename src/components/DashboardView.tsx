'use client';

import { Task, Habit, TodoList } from '@/types/todo';
import { CheckCircle2, TrendingUp, Clock, Zap, Target, Flame, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { format, isToday, parseISO, subDays, isSameDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface DashboardViewProps {
  tasks: Task[];
  habits: Habit[];
  lists: TodoList[];
  onTaskToggle: (id: string) => void;
  onHabitToggle: (id: string, date: string) => void;
  onNavigate: (view: any) => void;
}

export function DashboardView({ tasks, habits, lists, onTaskToggle, onHabitToggle, onNavigate }: DashboardViewProps) {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  
  // --- Task Stats ---
  const todayTasks = tasks.filter(t => t.deadline ? isToday(parseISO(t.deadline)) : isToday(parseISO(t.createdAt)));
  const completedTasks = todayTasks.filter(t => t.isCompleted);
  const taskProgress = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  // --- Habit Stats ---
  const todayHabits = habits.map(h => ({
    ...h,
    isCompleted: h.logs.some(l => l.date === dateStr && l.completed)
  }));
  const completedHabits = todayHabits.filter(h => h.isCompleted);
  const habitProgress = todayHabits.length > 0 ? (completedHabits.length / todayHabits.length) * 100 : 0;

  // --- Weekly Activity Data (Bar Chart) ---
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    return d;
  });

  const weeklyData = last7Days.map(day => {
    const completedThatDay = tasks.filter(t => t.isCompleted && isSameDay(parseISO(t.createdAt), day)); // Approximation, ideal would be completion date
    return {
      date: day,
      count: completedThatDay.length,
      label: format(day, 'EEE')
    };
  });
  const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 5); // Minimum scale of 5

  // --- Task Distribution Data (Doughnut Chart Alternative) ---
  const listDistribution = lists.map(list => {
    const listTasks = tasks.filter(t => t.category === list.id && !t.isCompleted);
    return {
      ...list,
      count: listTasks.length
    };
  }).filter(l => l.count > 0).sort((a, b) => b.count - a.count);

  const totalActiveTasks = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          Dashboard <span className="text-xl">🚀</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Your productivity command center. You have <span className="text-foreground font-bold">{todayTasks.length - completedTasks.length} tasks</span> remaining today.
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Tasks Completed */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground">{completedTasks.length}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">Tasks Completed</p>
          </div>
        </div>

        {/* Habits Active */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Flame size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground">{completedHabits.length}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">Habits Done</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="md:col-span-2 bg-card border border-border/50 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-5 -mb-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Target size={16} className="text-indigo-500" /> Daily Objective
              </h3>
              <span className="text-sm font-black">{Math.round((taskProgress + habitProgress) / 2)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${(taskProgress + habitProgress) / 2}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Combined completion rate of tasks and habits</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart (Custom CSS Bar Chart) */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-foreground">Activity Overview</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">Tasks completed over the last 7 days</p>
            </div>
            <div className="bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
              <span className="text-xs font-bold text-foreground">This Week</span>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 h-[200px] mt-auto">
            {weeklyData.map((data, index) => {
              const heightPercentage = (data.count / maxWeeklyCount) * 100;
              return (
                <div key={index} className="flex flex-col items-center gap-3 w-full group">
                  <div className="relative w-full flex justify-center h-[150px] items-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded-md pointer-events-none z-10 whitespace-nowrap">
                      {data.count} tasks
                    </div>
                    {/* Bar */}
                    <div 
                      className={twMerge(
                        "w-full max-w-[40px] rounded-t-xl transition-all duration-500 relative overflow-hidden",
                        isSameDay(data.date, today) ? "bg-indigo-500" : "bg-muted-foreground/20 group-hover:bg-indigo-500/50"
                      )}
                      style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                    >
                      {/* Gradient overlay for effect */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-50"></div>
                    </div>
                  </div>
                  <span className={twMerge(
                    "text-[11px] font-bold uppercase",
                    isSameDay(data.date, today) ? "text-indigo-500" : "text-muted-foreground"
                  )}>{data.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Distribution / Workload */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-foreground mb-1">Workload</h3>
          <p className="text-xs text-muted-foreground font-medium mb-6">Active tasks by category</p>
          
          <div className="flex-1 flex flex-col justify-center gap-5">
            {listDistribution.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <CheckCircle2 size={40} className="mb-3 text-muted-foreground" />
                <p className="text-sm font-bold">All caught up!</p>
              </div>
            ) : (
              listDistribution.map(list => {
                const percentage = (list.count / totalActiveTasks) * 100;
                return (
                  <div key={list.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={twMerge("w-2.5 h-2.5 rounded-sm", list.color)}></div>
                        <span className="text-sm font-bold text-foreground">{list.name}</span>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{list.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={twMerge("h-full transition-all duration-1000", list.color)}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Today's Tasks & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Today's Focus List */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Action Items
            </h3>
            <button onClick={() => onNavigate('today')} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {todayTasks.slice(0, 4).map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group cursor-pointer"
                onClick={() => onTaskToggle(task.id)}
              >
                <div className={twMerge(
                  "shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                  task.isCompleted ? "bg-foreground border-foreground text-background" : "border-border group-hover:border-foreground/40"
                )}>
                  {task.isCompleted && <CheckCircle2 size={12} strokeWidth={4} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={twMerge(
                    "text-sm font-bold truncate transition-all",
                    task.isCompleted ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                  )}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {lists.find(l => l.id === task.category) && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        <div className={twMerge("w-1.5 h-1.5 rounded-full", lists.find(l => l.id === task.category)?.color)}></div>
                        {lists.find(l => l.id === task.category)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="m-auto text-center py-6">
                <p className="text-sm font-medium text-muted-foreground italic">No tasks for today. You're free!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Habits */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" /> Daily Habits
            </h3>
            <button onClick={() => onNavigate('habits')} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {todayHabits.slice(0, 4).map(habit => (
              <div 
                key={habit.id}
                onClick={() => onHabitToggle(habit.id, dateStr)}
                className={twMerge(
                  "flex flex-col gap-3 p-4 rounded-2xl border transition-all cursor-pointer group",
                  habit.isCompleted 
                    ? "bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" 
                    : "bg-muted/10 border-border/50 hover:bg-muted/30 hover:border-border"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={twMerge(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110",
                    habit.isCompleted ? habit.color : "bg-muted text-muted-foreground"
                  )}>
                    {habit.icon}
                  </div>
                  <div className={twMerge(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    habit.isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                  )}>
                    {habit.isCompleted && <CheckCircle2 size={12} strokeWidth={4} />}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-tight">{habit.name}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {habit.isCompleted ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
            {todayHabits.length === 0 && (
              <div className="col-span-2 text-center py-10">
                <p className="text-sm font-medium text-muted-foreground italic">No habits tracking right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
