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

  const addTask = (title: string, listId: string = '', priority: Priority = 'Medium', deadline: string = '', startTime: string = '', duration: number = 60) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      category: listId,
      priority,
      deadline: deadline || '',
      startTime,
      duration,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      tags: [],
      subtasks: [],
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask.id;
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

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: uuidv4(),
      name,
      color,
    };
    setTags((prev) => [...prev, newTag]);
    return newTag.id;
  };

  const updateTag = (id: string, name: string, color: string) => {
    setTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, name, color } : tag))
    );
  };

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    // Remove tag from all tasks
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.filter((tId) => tId !== id),
      }))
    );
  };

  const updateList = (id: string, name: string, color: string) => {
    setLists((prev) =>
      prev.map((list) => (list.id === id ? { ...list, name, color } : list))
    );
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
    // Also delete tasks in that list
    setTasks((prev) => prev.filter((task) => task.category !== id));
  };

  const addList = (name: string, color: string) => {
    const newList: TodoList = {
      id: uuidv4(),
      name,
      color,
    };
    setLists((prev) => [...prev, newList]);
    return newList.id;
  };

  return {
    tasks,
    lists,
    tags,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    addList,
    updateList,
    deleteList,
    addTag,
    updateTag,
    deleteTag,
  };
}
