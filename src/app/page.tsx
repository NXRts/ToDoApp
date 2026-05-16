'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Sidebar';
import { TaskInput } from '@/components/TaskInput';
import { TaskItem } from '@/components/TaskItem';
import { TaskDetails } from '@/components/TaskDetails';
import { CalendarView } from '@/components/CalendarView';
import { StickyWall } from '@/components/StickyWall';
import { SettingsView } from '@/components/SettingsView';
import { DashboardView } from '@/components/DashboardView';
import { HabitTrackerView } from '@/components/HabitTrackerView';
import { ViewMode } from '@/types/todo';
import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

export default function Home() {
  const { 
    tasks, lists, tags, habits,
    addTask, toggleTaskCompletion, updateTask, deleteTask, 
    addList, updateList, deleteList, 
    addTag, updateTag, deleteTag,
    addHabit, updateHabit, deleteHabit, toggleHabitLog
  } = useTasks();
  
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Apply Settings globally
  useEffect(() => {
    const applySettings = () => {
      const appearance = JSON.parse(localStorage.getItem('todo_appearance') || '{"theme": "light", "glassmorphism": true, "compact": false}');
      const root = window.document.documentElement;
      
      // Theme
      if (appearance.theme === 'dark') {
        root.classList.add('dark');
      } else if (appearance.theme === 'light') {
        root.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      }

      // Glassmorphism
      if (appearance.glassmorphism) {
        root.classList.add('glass-enabled');
      } else {
        root.classList.remove('glass-enabled');
      }

      // Compact
      if (appearance.compact) {
        root.classList.add('compact-mode');
      } else {
        root.classList.remove('compact-mode');
      }
    };

    applySettings();
    // Listen for storage changes (in case settings are changed in another tab or the same page)
    window.addEventListener('storage', applySettings);
    return () => window.removeEventListener('storage', applySettings);
  }, []);

  // Filter tasks based on view or list
  const filteredTasks = useMemo(() => {
    if (selectedListId) {
      return tasks.filter(t => t.category === selectedListId);
    }
    
    return tasks.filter(task => {
      const deadlineDate = task.deadline ? parseISO(task.deadline) : null;
      const createdDate = parseISO(task.createdAt);
      const isCompleted = task.isCompleted;
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      if (currentView === 'today') {
        // Show tasks due today OR uncompleted tasks from the past
        if (deadlineDate) {
          return isToday(deadlineDate) || (!isCompleted && deadlineDate < now);
        }
        // If no deadline, show if created today OR uncompleted from past
        return isToday(createdDate) || (!isCompleted && createdDate < now);
      }
      
      if (currentView === 'upcoming') {
        // Show tasks with future deadlines
        if (deadlineDate) {
          const sevenDaysLater = new Date(now);
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
          return deadlineDate >= now && deadlineDate <= sevenDaysLater;
        }
        // For tasks without deadline in Upcoming, maybe only show today's? 
        // Or show them in Sticky Wall instead. Let's keep it simple.
        return isToday(createdDate); 
      }
      
      return true;
    });
  }, [tasks, currentView, selectedListId]);

  // Compute Header Title
  const headerTitle = useMemo(() => {
    if (selectedListId) {
      const list = lists.find(l => l.id === selectedListId);
      return list ? list.name : 'List';
    }
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'habits': return 'Habit Tracker';
      case 'upcoming': return 'Upcoming';
      case 'today': return 'Today';
      case 'calendar': return 'Calendar';
      case 'sticky-wall': return 'Sticky Wall';
      case 'settings': return 'Settings';
      case 'list': return lists.find(l => l.id === selectedListId)?.name || 'Tasks';
      default: return 'Tasks';
    }
  }, [currentView, selectedListId, lists]);

  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  return (
    <div className="flex w-full h-screen bg-background overflow-hidden">
      <Sidebar 
        lists={lists} 
        tasks={tasks}
        tags={tags} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        selectedListId={selectedListId}
        onListSelect={setSelectedListId}
        onAddList={addList}
        onUpdateList={updateList}
        onDeleteList={deleteList}
        onAddTag={addTag}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
      />
      
      <main className="flex-1 flex flex-col p-8 lg:px-12 xl:px-16 lg:py-10 overflow-y-auto custom-scrollbar">
        {/* Main Header */}
        <header className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{headerTitle}</h1>
          <div className="flex items-center justify-center min-w-8 h-8 px-2 rounded-lg border border-border text-foreground font-bold text-xl">
            {currentView === 'dashboard' ? (tasks.filter(t => !t.isCompleted).length) : 
             currentView === 'habits' ? habits.length : 
             filteredTasks.length}
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex flex-col">
          {currentView === 'dashboard' ? (
            <DashboardView 
              tasks={tasks} 
              habits={habits} 
              lists={lists}
              onTaskToggle={toggleTaskCompletion}
              onHabitToggle={toggleHabitLog}
              onNavigate={(view) => { setCurrentView(view); setSelectedListId(null); }}
            />
          ) : currentView === 'habits' ? (
            <HabitTrackerView 
              habits={habits}
              onToggleHabit={toggleHabitLog}
              onAddHabit={(name, color, icon) => {
                addHabit(name, color, icon, 'daily', 7);
              }}
              onUpdateHabit={updateHabit}
              onDeleteHabit={deleteHabit}
            />
          ) : currentView === 'calendar' ? (
            <CalendarView 
              tasks={tasks} 
              lists={lists} 
              onTaskClick={setSelectedTaskId}
              selectedTaskId={selectedTaskId}
            />
          ) : currentView === 'sticky-wall' ? (
            <StickyWall 
              tasks={tasks} 
              lists={lists} 
              onTaskClick={setSelectedTaskId} 
              onAddTask={() => {
                const id = addTask('New Note', selectedListId || '');
                setSelectedTaskId(id);
              }} 
            />
          ) : currentView === 'settings' ? (
            <SettingsView />
          ) : currentView === 'upcoming' && !selectedListId ? (
            // Grouped 3-Card Bento view for Upcoming
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {/* Today Section (Full Width) */}
              <div className="col-span-1 md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">Today</h3>
                <TaskInput onAdd={(title) => addTask(title, '', 'Medium', new Date().toISOString())} />
                <div className="flex flex-col mt-4">
                  {filteredTasks.filter(t => {
                    const d = t.deadline ? parseISO(t.deadline) : parseISO(t.createdAt);
                    return isToday(d);
                  }).map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskCompletion} 
                      listDetails={lists.find(l => l.id === task.category)}
                      onClick={() => setSelectedTaskId(task.id)}
                      isSelected={selectedTaskId === task.id}
                    />
                  ))}
                </div>
              </div>

              {/* Tomorrow Section */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">Tomorrow</h3>
                <TaskInput onAdd={(title) => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  addTask(title, '', 'Medium', tomorrow.toISOString());
                }} />
                <div className="flex flex-col mt-4">
                  {filteredTasks.filter(t => t.deadline && isTomorrow(parseISO(t.deadline))).map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskCompletion} 
                      listDetails={lists.find(l => l.id === task.category)}
                      onClick={() => setSelectedTaskId(task.id)}
                      isSelected={selectedTaskId === task.id}
                    />
                  ))}
                </div>
              </div>

              {/* This Week Section */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">This Week</h3>
                <TaskInput onAdd={(title) => addTask(title, '', 'Medium', '')} />
                <div className="flex flex-col mt-4">
                  {filteredTasks.filter(t => {
                    if (!t.deadline) return false;
                    const d = parseISO(t.deadline);
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    return d > new Date() && !isToday(d) && !isTomorrow(d) && d <= nextWeek;
                  }).map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskCompletion} 
                      listDetails={lists.find(l => l.id === task.category)}
                      onClick={() => setSelectedTaskId(task.id)}
                      isSelected={selectedTaskId === task.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Standard list view for Today or specific Lists
            <div className="flex flex-col">
              <TaskInput onAdd={(title) => addTask(title, selectedListId || '')} />
              <div className="mt-4">
                {filteredTasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tasks found.</p>
                ) : (
                  filteredTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTaskCompletion} 
                      listDetails={lists.find(l => l.id === task.category)}
                      onClick={() => setSelectedTaskId(task.id)}
                      isSelected={selectedTaskId === task.id}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Task Details Panel */}
      {selectedTask && (
        <TaskDetails 
          task={selectedTask}
          lists={lists}
          tags={tags}
          onSave={updateTask}
          onDelete={deleteTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
