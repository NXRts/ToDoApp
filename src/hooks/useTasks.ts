import { useLocalStorage } from './useLocalStorage';
import { Task, Priority, TodoList, Tag, Habit } from '@/types/todo';
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

  const [habits, setHabits] = useLocalStorage<Habit[]>('todo_habits', [
    { id: 'h1', name: 'Morning Meditation', color: 'bg-indigo-500', icon: '🧘', frequency: 'daily', goal: 7, logs: [], createdAt: new Date().toISOString() },
    { id: 'h2', name: 'Read 30 mins', color: 'bg-orange-500', icon: '📚', frequency: 'daily', goal: 7, logs: [], createdAt: new Date().toISOString() },
  ]);

  const addHabit = (name: string, color: string, icon: string, frequency: 'daily' | 'weekly', goal: number) => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      color,
      icon,
      frequency,
      goal,
      logs: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit.id;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitLog = (habitId: string, date: string) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== habitId) return h;
      const existingLogIndex = h.logs.findIndex(l => l.date === date);
      let newLogs = [...h.logs];
      if (existingLogIndex >= 0) {
        newLogs[existingLogIndex].completed = !newLogs[existingLogIndex].completed;
      } else {
        newLogs.push({ date, completed: true });
      }
      return { ...h, logs: newLogs };
    }));
  };

  return {
    tasks,
    lists,
    tags,
    habits,
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
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitLog,
  };
}
