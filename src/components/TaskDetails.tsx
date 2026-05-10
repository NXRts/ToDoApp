import { useState, useEffect } from 'react';
import { Task, TodoList, Tag, Subtask } from '@/types/todo';
import { X, Plus, Trash2, ChevronDown, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

interface TaskDetailsProps {
  task: Task;
  lists: TodoList[];
  tags: Tag[];
  onSave: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskDetails({ task, lists, tags, onSave, onDelete, onClose }: TaskDetailsProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [listId, setListId] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.deadline ? task.deadline.substring(0, 10) : '');
  const [selectedTags, setSelectedTags] = useState<string[]>(task.tags || []);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [startTime, setStartTime] = useState(task.startTime || '');
  const [duration, setDuration] = useState(task.duration || 60);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setListId(task.category);
    setDueDate(task.deadline ? task.deadline.substring(0, 10) : '');
    setSelectedTags(task.tags || []);
    setSubtasks(task.subtasks || []);
    setStartTime(task.startTime || '');
    setDuration(task.duration || 60);
    setNewSubtaskTitle('');
  }, [task]);

  const handleSave = () => {
    onSave(task.id, {
      title,
      description,
      category: listId,
      deadline: dueDate ? new Date(dueDate).toISOString() : '',
      startTime,
      duration,
      tags: selectedTags,
      subtasks,
    });
  };

  const handleAddSubtask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: uuidv4(), title: newSubtaskTitle.trim(), isCompleted: false }]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (subId: string) => {
    setSubtasks(subtasks.map(st => st.id === subId ? { ...st, isCompleted: !st.isCompleted } : st));
  };

  const deleteSubtask = (subId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subId));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <aside className="w-[350px] h-screen bg-sidebar flex flex-col border-l border-border/50 shrink-0 py-8 px-6 overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Task:</h2>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
          className="w-full bg-muted/20 border border-border/40 rounded-xl py-3 px-4 text-base font-medium focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all text-foreground placeholder:text-muted-foreground/30"
        />

        {/* Description Textarea */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full bg-muted/20 border border-border/40 rounded-xl py-4 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all min-h-[120px] resize-none custom-scrollbar text-foreground placeholder:text-muted-foreground/30"
        />

        {/* Properties Grid */}
        <div className="flex flex-col gap-5">
          {/* List Selector */}
          <div className="flex items-center justify-between group">
            <span className="text-sm font-semibold text-muted-foreground">List</span>
            <div className="relative w-48">
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="w-full appearance-none bg-muted/20 border border-border/40 rounded-xl py-2 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all pr-10"
              >
                {lists.map(list => (
                  <option key={list.id} value={list.id} className="bg-sidebar">{list.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between group">
            <span className="text-sm font-semibold text-muted-foreground">Due date</span>
            <div className="relative w-48">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-muted/20 border border-border/40 rounded-xl py-2 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all text-foreground dark:scheme-dark"
              />
            </div>
          </div>

          {/* Time & Duration */}
          <div className="flex items-center justify-between group">
            <span className="text-sm font-semibold text-muted-foreground">Time</span>
            <div className="flex items-center gap-2 w-48">
              {/* Custom Time Picker Popover */}
              <div className="relative flex-1">
                <button 
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  className="w-full flex items-center justify-between bg-muted/20 border border-border/40 rounded-xl py-2 px-3 text-sm font-medium hover:bg-muted/30 transition-all"
                >
                  <span className="text-foreground">{startTime || '--:--'}</span>
                  <Clock size={14} className="text-muted-foreground" />
                </button>

                {showTimePicker && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-sidebar border border-border rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex gap-2 h-48">
                      {/* Hours Column (24h) */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => {
                          const hStr = h.toString().padStart(2, '0');
                          const isSelected = (startTime || '').split(':')[0] === hStr;
                          return (
                            <button
                              key={h}
                              onClick={() => {
                                const [, m = '00'] = (startTime || '12:00').split(':');
                                setStartTime(`${hStr}:${m}`);
                              }}
                              className={twMerge(
                                "py-2 rounded-lg text-xs font-bold transition-all",
                                isSelected ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
                              )}
                            >
                              {hStr}
                            </button>
                          );
                        })}
                      </div>

                      {/* Minutes Column */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 border-l border-border/40 pl-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(m => {
                          const mStr = m.toString().padStart(2, '0');
                          const isSelected = (startTime || '').split(':')[1] === mStr;
                          return (
                            <button
                              key={m}
                              onClick={() => {
                                const [h = '12'] = (startTime || '12:00').split(':');
                                setStartTime(`${h}:${mStr}`);
                              }}
                              className={twMerge(
                                "py-2 rounded-lg text-xs font-bold transition-all",
                                isSelected ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
                              )}
                            >
                              {mStr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowTimePicker(false)}
                      className="w-full mt-3 py-2 bg-muted/50 rounded-xl text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              
              {/* Duration Input */}
              <div className="flex items-center bg-muted/20 border border-border/40 rounded-xl px-2 w-20">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-transparent border-none py-2 text-sm font-medium focus:outline-none text-center"
                />
                <div className="flex flex-col">
                  <button onClick={() => setDuration(d => d + 5)} className="hover:text-foreground p-0.5"><ChevronDown size={12} className="rotate-180" /></button>
                  <button onClick={() => setDuration(d => Math.max(0, d - 5))} className="hover:text-foreground p-0.5"><ChevronDown size={12} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Tags</span>
            <div className="flex flex-wrap gap-2 justify-end w-48">
              {selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <span 
                    key={tag.id} 
                    onClick={() => toggleTag(tag.id)}
                    className={twMerge("px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity", tag.color)}
                  >
                    {tag.name}
                  </span>
                ) : null;
              })}
              <div className="relative">
                <button 
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-muted text-muted-foreground hover:bg-border transition-colors flex items-center gap-1"
                >
                  <Plus size={12} /> Add Tag
                </button>
                
                {showTagPicker && (
                  <div className="absolute right-0 bottom-full mb-2 w-40 bg-sidebar border border-border rounded-xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-1">
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => { toggleTag(tag.id); setShowTagPicker(false); }}
                          className={twMerge(
                            "text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            selectedTags.includes(tag.id) ? "bg-muted text-foreground" : "hover:bg-muted/50 text-muted-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={twMerge("w-2 h-2 rounded-full", tag.color.split(' ')[0])}></div>
                            {tag.name}
                          </div>
                        </button>
                      ))}
                      {tags.length === 0 && <p className="text-[10px] text-muted-foreground p-2">No tags available</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-foreground mb-4">Subtasks:</h3>
          
          <ul className="space-y-3 mb-4">
            {subtasks.map((st) => (
              <li key={st.id} className="flex items-center justify-between group animate-in slide-in-from-left duration-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={st.isCompleted}
                    onChange={() => toggleSubtask(st.id)}
                    className="w-4 h-4 rounded border-border/50 text-foreground focus:ring-offset-background"
                  />
                  <span className={twMerge("text-sm font-medium transition-all", st.isCompleted ? "text-muted-foreground line-through opacity-50" : "text-foreground")}>
                    {st.title}
                  </span>
                </div>
                <button 
                  onClick={() => deleteSubtask(st.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 bg-muted/10 border border-border/30 rounded-xl px-4 py-2 hover:bg-muted/20 transition-colors">
            <Plus size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              placeholder="Add New Subtask"
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/30 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-8 flex items-center gap-4">
        <button
          onClick={() => { onDelete(task.id); onClose(); }}
          className="flex-1 py-3 px-4 bg-muted/20 border border-border/40 rounded-xl text-sm font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all text-muted-foreground"
        >
          Delete Task
        </button>
        <button
          onClick={() => { handleSave(); onClose(); }}
          className="flex-[1.5] py-3 px-4 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg"
        >
          Save changes
        </button>
      </div>
    </aside>
  );
}
