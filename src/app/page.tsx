'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Sidebar';
import { TaskInput } from '@/components/TaskInput';
import { TaskItem } from '@/components/TaskItem';
import { TaskDetails } from '@/components/TaskDetails';
import { ViewMode } from '@/types/todo';
import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

export default function Home() {
  const { tasks, lists, tags, addTask, toggleTaskCompletion, updateTask, deleteTask } = useTasks();
  
  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filter tasks based on view or list
  const filteredTasks = useMemo(() => {
    if (selectedListId) {
      return tasks.filter(t => t.category === selectedListId);
    }
    
    return tasks.filter(task => {
      const date = parseISO(task.createdAt); // Simplified logic
      if (currentView === 'today') return isToday(date);
      if (currentView === 'upcoming') return isTomorrow(date) || isThisWeek(date);
      return true; // fallback for others
    });
  }, [tasks, currentView, selectedListId]);

  // Compute Header Title
  const headerTitle = useMemo(() => {
    if (selectedListId) {
      const list = lists.find(l => l.id === selectedListId);
      return list ? list.name : 'List';
    }
    switch (currentView) {
      case 'upcoming': return 'Upcoming';
      case 'today': return 'Today';
      case 'calendar': return 'Calendar';
      case 'sticky-wall': return 'Sticky Wall';
      default: return 'Tasks';
    }
  }, [currentView, selectedListId, lists]);

  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  return (
    <div className="flex w-full h-screen bg-background overflow-hidden">
      <Sidebar 
        lists={lists} 
        tags={tags} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        selectedListId={selectedListId}
        onListSelect={setSelectedListId}
      />
      
      <main className="flex-1 flex flex-col p-8 lg:px-12 xl:px-16 lg:py-10 overflow-y-auto custom-scrollbar">
        {/* Main Header */}
        <header className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{headerTitle}</h1>
          <div className="flex items-center justify-center min-w-8 h-8 px-2 rounded-lg border border-border text-foreground font-bold text-xl">
            {filteredTasks.length}
          </div>
        </header>

        {/* Task Input */}
        <TaskInput onAdd={(title) => addTask(title, selectedListId || '1')} />

        {/* Task List */}
        <div className="flex flex-col mt-4">
          {filteredTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm mt-4">No tasks found.</p>
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
