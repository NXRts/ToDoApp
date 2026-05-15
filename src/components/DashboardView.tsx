'use client';

import { Task, Habit, TodoList } from '@/types/todo';
import { CheckCircle2, Circle, Clock, TrendingUp, Calendar, Zap } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
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
  
  const todayTasks = tasks.filter(t => t.deadline ? isToday(parseISO(t.deadline)) : isToday(parseISO(t.createdAt)));
  const completedTasks = todayTasks.filter(t => t.isCompleted);
  const taskProgress = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const todayHabits = habits.map(h => ({
    ...h,
    isCompleted: h.logs.find(l => l.date === dateStr)?.completed || false
  }));
  const completedHabits = todayHabits.filter(h => h.isCompleted);
  const habitProgress = todayHabits.length > 0 ? (completedHabits.length / todayHabits.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Hello, Productive Human! 👋
        </h1>
        <p className="text-muted-foreground font-medium">
          You've completed <span className="text-foreground font-bold">{completedTasks.length} tasks</span> and <span className="text-foreground font-bold">{completedHabits.length} habits</span> today. Keep it up!
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Progress Card */}
        <div className="group bg-card border border-border rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle2 size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white">
                <Zap size={20} fill="currentColor" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground">Task Flow</h3>
            </div>
            <div className="flex items-end justify-between mb-4">
              <h4 className="text-5xl font-black">{Math.round(taskProgress)}%</h4>
              <p className="text-sm font-bold text-muted-foreground pb-1">
                {completedTasks.length} / {todayTasks.length} Completed
              </p>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Habit Streak Card */}
        <div className="group bg-card border border-border rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground">Habit Energy</h3>
            </div>
            <div className="flex items-end justify-between mb-4">
              <h4 className="text-5xl font-black">{Math.round(habitProgress)}%</h4>
              <p className="text-sm font-bold text-muted-foreground pb-1">
                {completedHabits.length} / {todayHabits.length} Active
              </p>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                style={{ width: `${habitProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Content: Today's Focus & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Today's Focus</h2>
            <button 
              onClick={() => onNavigate('today')}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              View All Tasks →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {todayTasks.slice(0, 5).map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:border-foreground/20 transition-all group"
              >
                <button 
                  onClick={() => onTaskToggle(task.id)}
                  className={twMerge(
                    "shrink-0 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                    task.isCompleted ? "bg-foreground border-foreground text-background" : "border-border hover:border-foreground/40"
                  )}
                >
                  {task.isCompleted && <CheckCircle2 size={14} strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={twMerge(
                    "text-sm font-bold truncate transition-all",
                    task.isCompleted ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {task.startTime && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                        <Clock size={10} /> {task.startTime}
                      </span>
                    )}
                    {lists.find(l => l.id === task.category) && (
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                        <div className={twMerge("w-1.5 h-1.5 rounded-full", lists.find(l => l.id === task.category)?.color)}></div>
                        {lists.find(l => l.id === task.category)?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl">
                <p className="text-muted-foreground font-medium italic">No tasks scheduled for today. Relax!</p>
              </div>
            )}
          </div>
        </div>

        {/* Habit Quick Track */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Habits</h2>
            <button 
              onClick={() => onNavigate('habits')}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Tracker →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {todayHabits.map(habit => (
              <div 
                key={habit.id}
                onClick={() => onHabitToggle(habit.id, dateStr)}
                className={twMerge(
                  "flex items-center justify-between bg-card border border-border/50 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group",
                  habit.isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "hover:border-foreground/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={twMerge(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                    habit.isCompleted ? habit.color : "bg-muted text-muted-foreground group-hover:bg-muted/50"
                  )}>
                    {habit.icon}
                  </div>
                  <div>
                    <p className={twMerge("text-sm font-bold", habit.isCompleted ? "text-emerald-700 dark:text-emerald-400" : "text-foreground")}>
                      {habit.name}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {habit.isCompleted ? 'Done for today' : 'Daily Goal'}
                    </p>
                  </div>
                </div>
                <div className={twMerge(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                  habit.isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-border group-hover:border-foreground/20"
                )}>
                  {habit.isCompleted && <CheckCircle2 size={14} strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
