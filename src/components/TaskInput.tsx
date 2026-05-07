'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAdd: (title: string) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAdd(inputValue.trim());
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="flex items-center gap-4 py-3 px-4 rounded-xl border border-border text-muted-foreground bg-card hover:bg-muted/50 transition-colors focus-within:border-foreground focus-within:text-foreground group">
        <button type="submit" className="focus:outline-none hover:text-foreground transition-colors">
          <Plus size={18} className="group-focus-within:text-foreground text-muted-foreground" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add New Task"
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
