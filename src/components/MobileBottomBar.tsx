'use client';

import { LayoutDashboard, ListTodo, Plus, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { ViewMode } from '@/types/todo';
import { twMerge } from 'tailwind-merge';

interface MobileBottomBarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onQuickAdd: () => void;
  todayTasksCount?: number;
}

export function MobileBottomBar({
  currentView,
  onViewChange,
  onQuickAdd,
  todayTasksCount = 0,
}: MobileBottomBarProps) {
  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Home',
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: 'today' as ViewMode,
      label: 'Today',
      icon: ListTodo,
      badge: todayTasksCount,
    },
    // Center FAB placeholder
    {
      id: 'fab' as const,
      label: 'Add',
      icon: Plus,
    },
    {
      id: 'habits' as ViewMode,
      label: 'Habits',
      icon: Activity,
      badge: 0,
    },
    {
      id: 'calendar' as ViewMode,
      label: 'Calendar',
      icon: CalendarIcon,
      badge: 0,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-card/90 backdrop-blur-md border-t border-border/60 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)] px-3 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.id === 'fab') {
            return (
              <button
                key="quick-add-fab"
                onClick={onQuickAdd}
                aria-label="Create new task"
                className="relative -top-5 flex items-center justify-center w-13 h-13 rounded-full bg-foreground text-background shadow-lg shadow-foreground/25 active:scale-90 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-foreground/20 ring-4 ring-background"
              >
                <Plus size={24} strokeWidth={2.5} />
              </button>
            );
          }

          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewMode)}
              className={twMerge(
                "relative flex flex-col items-center justify-center min-w-13 py-1 px-1 rounded-xl transition-all select-none active:scale-95",
                isActive 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={twMerge(
                "text-[10px] tracking-tight mt-0.5",
                isActive ? "font-bold text-foreground" : "font-medium"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
