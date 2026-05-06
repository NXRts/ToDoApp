import { useLocalStorage } from './useLocalStorage';
import { Task, Priority, TodoList, Tag } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo_tasks', []);
  const [lists, setLists] = useLocalStorage<TodoList[]>('todo_lists', [
    { id: '1', name: 'Personal', color: 'bg-red-400' },
    { id: '2', name: 'Work', color: 'bg-cyan-400' },
    { id: '3', name: 'List 1', color: 'bg-yellow-400' },
  ]);
  const [tags, setTags] = useLocalStorage<Tag[]>('todo_tags', [
    { id: 't1', name: 'Tag 1', color: 'bg-cyan-100 text-cyan-800' },
    { id: 't2', name: 'Tag 2', color: 'bg-red-100 text-red-800' },
  ]);

  const addTask = (title: string, listId: string = '1', priority: Priority = 'Medium', deadline: string = '') => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      category: listId,
      priority,
      deadline: deadline || new Date().toISOString(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      tags: [],
      subtasks: [],
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return {
    tasks,
    lists,
    tags,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  };
}
