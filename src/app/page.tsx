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
      const deadlineDate = task.deadline ? parseISO(task.deadline) : null;
      const createdDate = parseISO(task.createdAt);
      
      if (currentView === 'today') {
        return (deadlineDate && isToday(deadlineDate)) || (!deadlineDate && isToday(createdDate));
      }
      
      if (currentView === 'upcoming') {
        if (deadlineDate) {
          return isToday(deadlineDate) || isTomorrow(deadlineDate) || isThisWeek(deadlineDate);
        }
        return isToday(createdDate); // Show tasks created today in Upcoming/Today section
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

        {/* Task List */}
        <div className="flex flex-col">
          {currentView === 'upcoming' && !selectedListId ? (
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
                    return isThisWeek(d) && !isToday(d) && !isTomorrow(d);
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
