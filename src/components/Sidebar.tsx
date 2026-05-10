import { Search, Menu, ChevronsRight, ListTodo, Calendar as CalendarIcon, StickyNote, Plus, Settings, LogOut, Edit2, Trash2 } from 'lucide-react';
import { TodoList, Tag, ViewMode, Task } from '@/types/todo';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

interface SidebarProps {
  lists: TodoList[];
  tasks: Task[];
  tags: Tag[];
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedListId: string | null;
  onListSelect: (id: string | null) => void;
  onAddList: (name: string, color: string) => void;
  onUpdateList: (id: string, name: string, color: string) => void;
  onDeleteList: (id: string) => void;
}

export function Sidebar({ lists, tasks, tags, currentView, onViewChange, selectedListId, onListSelect, onAddList, onUpdateList, onDeleteList }: SidebarProps) {
  const [isAddingList, setIsAddingList] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('bg-blue-500');

  const colors = [
    'bg-red-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 
    'bg-cyan-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500'
  ];

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim(), newListColor);
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const handleStartEdit = (list: TodoList) => {
    setEditingListId(list.id);
    setNewListName(list.name);
    setNewListColor(list.color);
  };

  const handleUpdateList = () => {
    if (editingListId && newListName.trim()) {
      onUpdateList(editingListId, newListName.trim(), newListColor);
      setEditingListId(null);
      setNewListName('');
    }
  };

  const handleDeleteList = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this list and all its tasks?')) {
      onDeleteList(id);
      if (selectedListId === id) onListSelect(null);
    }
  };

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
          {lists.map(list => {
            const taskCount = tasks.filter(t => t.category === list.id).length;
            const isEditing = editingListId === list.id;

            if (isEditing) {
              return (
                <li key={list.id} className="animate-in fade-in slide-in-from-top-1 duration-200 py-2">
                  <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-3">
                    <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 py-2">
                      <div className={twMerge("w-3 h-3 rounded-[4px] shrink-0", newListColor)}></div>
                      <input 
                        autoFocus
                        type="text" 
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateList()}
                        className="w-full bg-transparent border-none text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 px-1">
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewListColor(color)}
                          className={twMerge(
                            "w-4 h-4 rounded-[4px] transition-all hover:scale-110",
                            color,
                            newListColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-muted/30 scale-110" : ""
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUpdateList}
                        className="flex-1 bg-foreground text-background text-[10px] font-bold py-1.5 rounded-md"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => setEditingListId(null)}
                        className="flex-1 bg-muted text-muted-foreground text-[10px] font-bold py-1.5 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={list.id} className="group relative">
                <div
                  onClick={() => { onListSelect(list.id); onViewChange('list'); }}
                  className={twMerge(
                    "w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                    selectedListId === list.id ? "bg-border font-medium text-foreground" : "hover:bg-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={twMerge("w-3 h-3 rounded-[4px]", list.color)}></div>
                    <span>{list.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md font-bold opacity-70 group-hover:hidden transition-opacity">
                      {taskCount}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartEdit(list); }}
                        className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteList(e, list.id)}
                        className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          
          {!isAddingList ? (
            <li>
              <button 
                onClick={() => setIsAddingList(true)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors mt-2"
              >
                <Plus size={16} />
                <span>Add New List</span>
              </button>
            </li>
          ) : (
            <li className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-3 py-2">
                  <div className={twMerge("w-3 h-3 rounded-[4px] shrink-0", newListColor)}></div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="List Name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                    className="w-full bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2 px-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewListColor(color)}
                      className={twMerge(
                        "w-4 h-4 rounded-[4px] transition-all hover:scale-110",
                        color,
                        newListColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-muted/30 scale-110" : ""
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddList}
                    className="flex-1 bg-foreground text-background text-[10px] font-bold py-1.5 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsAddingList(false)}
                    className="flex-1 bg-muted text-muted-foreground text-[10px] font-bold py-1.5 rounded-md hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          )}
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
