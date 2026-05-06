'use client';

import { useState, useEffect } from 'react';
import { Task, TodoList, Tag, Subtask } from '@/types/todo';
import { X, Plus } from 'lucide-react';
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
  // Local state for editing before saving
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [listId, setListId] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.deadline ? task.deadline.substring(0, 10) : '');
  const [selectedTags, setSelectedTags] = useState<string[]>(task.tags || []);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Sync state if task prop changes (e.g., clicking a different task)
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setListId(task.category);
    setDueDate(task.deadline ? task.deadline.substring(0, 10) : '');
    setSelectedTags(task.tags || []);
    setSubtasks(task.subtasks || []);
    setNewSubtaskTitle('');
  }, [task]);

  const handleSave = () => {
    onSave(task.id, {
      title,
      description,
      category: listId,
      deadline: dueDate ? new Date(dueDate).toISOString() : '',
      tags: selectedTags,
      subtasks,
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: uuidv4(), title: newSubtaskTitle.trim(), isCompleted: false }]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (subId: string) => {
    setSubtasks(subtasks.map(st => st.id === subId ? { ...st, isCompleted: !st.isCompleted } : st));
  };

  return (
    <aside className="w-80 h-screen bg-sidebar flex flex-col border-l border-border shrink-0 py-6 px-4 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xl font-bold tracking-tight">Task:</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-foreground transition-colors font-medium text-foreground"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-foreground transition-colors min-h-[100px] resize-y custom-scrollbar text-muted-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Properties */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-16">List</span>
          <select
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg py-1.5 px-2 text-sm focus:outline-none"
          >
            {lists.map(list => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-16">Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg py-1.5 px-2 text-sm focus:outline-none text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-16">Tags</span>
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Display selected tags (simplified mock) */}
            {selectedTags.length === 0 ? (
              <button className="px-3 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-border flex items-center gap-1 transition-colors">
                <Plus size={12} /> Add Tag
              </button>
            ) : (
              selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <span key={tag.id} className={twMerge("px-2 py-0.5 rounded-md text-[11px] font-medium", tag.color)}>
                    {tag.name}
                  </span>
                ) : null;
              })
            )}
          </div>
        </div>
      </div>

      {/* Subtasks */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-3">Subtasks:</h3>
        <form onSubmit={handleAddSubtask} className="flex items-center gap-3 mb-3">
          <Plus size={16} className="text-muted-foreground" />
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="Add New Subtask"
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
          />
        </form>
        
        <ul className="space-y-3 pl-2">
          {subtasks.map((st) => (
            <li key={st.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={st.isCompleted}
                onChange={() => toggleSubtask(st.id)}
                className="scale-90"
              />
              <span className={twMerge("text-sm", st.isCompleted ? "text-muted-foreground line-through" : "text-foreground")}>
                {st.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex items-center justify-between gap-3 border-t border-border">
        <button
          onClick={() => { onDelete(task.id); onClose(); }}
          className="flex-1 py-2.5 px-4 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground"
        >
          Delete Task
        </button>
        <button
          onClick={() => { handleSave(); onClose(); }}
          className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-500 border border-transparent rounded-lg text-sm font-medium text-amber-950 transition-colors shadow-sm"
        >
          Save changes
        </button>
      </div>
    </aside>
  );
}
