'use client';

import { Search, Menu, ChevronsRight, ListTodo, Calendar as CalendarIcon, StickyNote, Plus, Settings, LogOut } from 'lucide-react';
import { TodoList, Tag, ViewMode } from '@/types/todo';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  lists: TodoList[];
  tags: Tag[];
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedListId: string | null;
  onListSelect: (id: string | null) => void;
}

export function Sidebar({ lists, tags, currentView, onViewChange, selectedListId, onListSelect }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col border-r border-border shrink-0 py-6 px-4 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-xl font-bold tracking-tight">Menu</h1>
        <button className="text-muted-foreground hover:text-foreground">
          <Menu size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-background border border-border rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-foreground transition-colors"
        />
      </div>

      {/* TASKS Section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Tasks</h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => { onViewChange('upcoming'); onListSelect(null); }}
              className={twMerge(
                "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                currentView === 'upcoming' && !selectedListId ? "bg-border font-medium" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <ChevronsRight size={16} />
                <span>Upcoming</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange('today'); onListSelect(null); }}
              className={twMerge(
                "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                currentView === 'today' && !selectedListId ? "bg-border font-medium text-foreground" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <ListTodo size={16} />
                <span>Today</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange('calendar'); onListSelect(null); }}
              className={twMerge(
                "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                currentView === 'calendar' && !selectedListId ? "bg-border font-medium text-foreground" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon size={16} />
                <span>Calendar</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => { onViewChange('sticky-wall'); onListSelect(null); }}
              className={twMerge(
                "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                currentView === 'sticky-wall' && !selectedListId ? "bg-border font-medium text-foreground" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <StickyNote size={16} />
                <span>Sticky Wall</span>
              </div>
            </button>
          </li>
        </ul>
      </div>

      {/* LISTS Section */}
      <div className="mb-8 border-t border-border pt-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Lists</h2>
        <ul className="space-y-1">
          {lists.map(list => (
            <li key={list.id}>
              <button
                onClick={() => { onListSelect(list.id); onViewChange('list'); }}
                className={twMerge(
                  "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                  selectedListId === list.id ? "bg-border font-medium text-foreground" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={twMerge("w-3 h-3 rounded-sm", list.color)}></div>
                  <span>{list.name}</span>
                </div>
              </button>
            </li>
          ))}
          <li>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors mt-2">
              <Plus size={16} />
              <span>Add New List</span>
            </button>
          </li>
        </ul>
      </div>

      {/* TAGS Section */}
      <div className="mb-auto border-t border-border pt-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Tags</h2>
        <div className="flex flex-wrap gap-2 px-2">
          {tags.map(tag => (
            <span key={tag.id} className={twMerge("px-3 py-1 rounded-md text-xs font-medium", tag.color)}>
              {tag.name}
            </span>
          ))}
          <button className="px-3 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-border flex items-center gap-1 transition-colors">
            <Plus size={12} /> Add Tag
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 pt-6 border-t border-border">
        <button 
          onClick={() => { onViewChange('settings'); onListSelect(null); }}
          className={twMerge(
            "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors",
            currentView === 'settings' ? "bg-border font-medium text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-border/50"
          )}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
