export type Priority = 'High' | 'Medium' | 'Low';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string; // Optional description
  category: string; // Used as List ID now
  priority: Priority;
  deadline: string; // ISO string (Date part)
  startTime?: string; // e.g. "09:00"
  duration?: number; // in minutes
  isCompleted: boolean;
  createdAt: string; // ISO string
  tags: string[]; // Array of tag IDs or names
  subtasks: Subtask[]; // Support for subtasks
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
  count?: number; // derived
}

export interface Tag {
  id: string;
  name: string;
  color: string; // hex or tailwind class
}

export type ViewMode = 'upcoming' | 'today' | 'calendar' | 'sticky-wall' | 'list';
