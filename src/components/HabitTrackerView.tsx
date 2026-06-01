'use client';

import { Habit } from '@/types/todo';
import { Plus, ChevronLeft, ChevronRight, Check, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, startOfMonth, getDaysInMonth, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { twMerge } from 'tailwind-merge';

interface HabitTrackerViewProps {
  habits: Habit[];
  onToggleHabit: (id: string, date: string) => void;
  onAddHabit: (name: string, color: string, icon: string) => void;
  onUpdateHabit?: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit?: (id: string) => void;
}

type TrackerViewMode = 'daily' | 'weekly' | 'monthly';

const PRESET_COLORS = [
  'bg-indigo-500', 
  'bg-emerald-500', 
  'bg-orange-500', 
  'bg-blue-500', 
  'bg-pink-500', 
  'bg-purple-500', 
  'bg-red-500', 
  'bg-yellow-500'
];

const PRESET_ICONS = [
  '🧘', '📚', '🏃', '💧', '🥗', '💻', '🎨', '✨', 
  '🏋️', '😴', '✍️', '🗣️', '🎯', '📧', '🧹', '⌛', '🎸', '🌱'
];

interface HabitTemplate {
  name: string;
  icon: string;
  color: string;
  category: string;
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Kesehatan & Kebugaran
  { name: 'Minum Air (2L)', icon: '💧', color: 'bg-blue-500', category: 'Kesehatan' },
  { name: 'Meditasi Pagi', icon: '🧘', color: 'bg-indigo-500', category: 'Kesehatan' },
  { name: 'Olahraga Harian', icon: '🏋️', color: 'bg-emerald-500', category: 'Kesehatan' },
  { name: 'Lari Pagi', icon: '🏃', color: 'bg-emerald-500', category: 'Kesehatan' },
  { name: 'Makan Sehat', icon: '🥗', color: 'bg-emerald-500', category: 'Kesehatan' },
  { name: 'Tidur Cepat (22:00)', icon: '😴', color: 'bg-indigo-500', category: 'Kesehatan' },
  
  // Belajar & Pengembangan Diri
  { name: 'Membaca Buku', icon: '📚', color: 'bg-orange-500', category: 'Belajar' },
  { name: 'Belajar Koding', icon: '💻', color: 'bg-blue-500', category: 'Belajar' },
  { name: 'Menulis Jurnal', icon: '✍️', color: 'bg-purple-500', category: 'Belajar' },
  { name: 'Belajar Bahasa', icon: '🗣️', color: 'bg-orange-500', category: 'Belajar' },
  
  // Produktivitas
  { name: 'Tulis Goals Harian', icon: '🎯', color: 'bg-pink-500', category: 'Produktivitas' },
  { name: 'Sesi Pomodoro', icon: '⌛', color: 'bg-pink-500', category: 'Produktivitas' },
  { name: 'Rapikan Meja Kerja', icon: '🧹', color: 'bg-orange-500', category: 'Produktivitas' },
  { name: 'Bersihkan Email', icon: '📧', color: 'bg-blue-500', category: 'Produktivitas' },
  
  // Kreativitas & Hobi
  { name: 'Menggambar / Melukis', icon: '🎨', color: 'bg-purple-500', category: 'Hobi' },
  { name: 'Latihan Musik', icon: '🎸', color: 'bg-pink-500', category: 'Hobi' },
  { name: 'Menyiram Tanaman', icon: '🌱', color: 'bg-emerald-500', category: 'Hobi' },
];

const TEMPLATE_CATEGORIES = ['Semua', 'Kesehatan', 'Belajar', 'Produktivitas', 'Hobi'];

export function HabitTrackerView({ habits, onToggleHabit, onAddHabit, onUpdateHabit, onDeleteHabit }: HabitTrackerViewProps) {
  const [viewMode, setViewMode] = useState<TrackerViewMode>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({ name: '', color: PRESET_COLORS[0], icon: PRESET_ICONS[0] });
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('Semua');

  const openModal = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({ name: habit.name, color: habit.color, icon: habit.icon });
    } else {
      setEditingHabit(null);
      setFormData({ name: '', color: PRESET_COLORS[0], icon: PRESET_ICONS[0] });
      setActiveTemplateCategory('Semua');
    }
    setIsModalOpen(true);
  };

  const handleSaveHabit = () => {
    if (!formData.name.trim()) return;
    if (editingHabit && onUpdateHabit) {
      onUpdateHabit(editingHabit.id, { name: formData.name, color: formData.color, icon: formData.icon });
    } else {
      onAddHabit(formData.name, formData.color, formData.icon);
    }
    setIsModalOpen(false);
  };

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
          onClick={() => openModal()}
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
                <tr key={habit.id} className="group/row hover:bg-muted/10 transition-colors">
                  <td className="p-2 px-4 border-r border-border/50 sticky left-0 z-10 bg-card group-hover/row:bg-muted/5 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className={twMerge("w-7 h-7 rounded-none flex items-center justify-center text-sm shadow-sm shrink-0", habit.color)}>
                        {habit.icon}
                      </div>
                      <span className="font-bold text-xs text-foreground leading-tight pr-12">{habit.name}</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity bg-card shadow-sm border border-border/50 rounded-md p-0.5">
                      <button onClick={() => openModal(habit)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Edit2 size={12} />
                      </button>
                      {onDeleteHabit && (
                        <button onClick={() => onDeleteHabit(habit.id)} className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500">
                          <Trash2 size={12} />
                        </button>
                      )}
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

      {/* Habit Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 flex flex-col gap-6 scale-in-95 animate-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{editingHabit ? 'Edit Habit' : 'New Habit'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-1 custom-scrollbar">
              {/* Quick Templates Section - Only show when creating a new habit */}
              {!editingHabit && (
                <div className="flex flex-col gap-2 bg-muted/20 border border-border/40 p-4 rounded-2xl mb-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <span>💡</span> Pilih dari Template Produktif
                    </label>
                  </div>
                  
                  {/* Category Tags */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {TEMPLATE_CATEGORIES.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveTemplateCategory(category)}
                        className={twMerge(
                          "px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all shrink-0 border cursor-pointer",
                          activeTemplateCategory === category
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : "bg-background border-border/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Templates Grid/List */}
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-1.5 custom-scrollbar min-h-[44px]">
                    {HABIT_TEMPLATES.filter(t => activeTemplateCategory === 'Semua' || t.category === activeTemplateCategory).map(template => (
                      <button
                        key={template.name}
                        type="button"
                        onClick={() => setFormData({ name: template.name, color: template.color, icon: template.icon })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-muted/50 border border-border/50 hover:border-foreground/20 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 text-foreground shadow-sm group/btn cursor-pointer"
                      >
                        <span className={twMerge("w-6 h-6 flex items-center justify-center rounded-lg text-sm shrink-0", template.color)}>
                          {template.icon}
                        </span>
                        <span className="truncate max-w-[120px]">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Habit Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Morning Meditation"
                  className="bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ICONS.map(icon => (
                    <button 
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={twMerge("w-10 h-10 flex items-center justify-center text-lg rounded-xl border-2 transition-all", formData.icon === icon ? "border-foreground bg-foreground/5 shadow-sm" : "border-border/30 hover:border-border bg-muted/20")}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={twMerge("w-8 h-8 rounded-full border-4 transition-all", color, formData.color === color ? "border-background shadow-[0_0_0_2px_currentColor]" : "border-transparent opacity-60 hover:opacity-100")}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSaveHabit} 
                disabled={!formData.name.trim()}
                className="px-6 py-2.5 bg-foreground text-background text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Save Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
