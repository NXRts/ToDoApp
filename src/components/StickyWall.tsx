'use client';

import { Note } from '@/types/todo';
import { Plus, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StickyWallProps {
  notes: Note[];
  onAddNote: () => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const getStickyColor = (color: string) => {
  switch (color) {
    case 'bg-red-400': return 'bg-red-100 border-red-200 text-red-900 placeholder:text-red-900/50';
    case 'bg-cyan-400': return 'bg-cyan-100 border-cyan-200 text-cyan-900 placeholder:text-cyan-900/50';
    case 'bg-yellow-400': return 'bg-[#FFF8CC] border-[#FFE975] text-[#7A6400] placeholder:text-[#7A6400]/50';
    case 'bg-blue-400': return 'bg-blue-100 border-blue-200 text-blue-900 placeholder:text-blue-900/50';
    case 'bg-green-400': return 'bg-green-100 border-green-200 text-green-900 placeholder:text-green-900/50';
    case 'bg-purple-400': return 'bg-purple-100 border-purple-200 text-purple-900 placeholder:text-purple-900/50';
    case 'bg-pink-400': return 'bg-pink-100 border-pink-200 text-pink-900 placeholder:text-pink-900/50';
    default: return 'bg-amber-100 border-amber-200 text-amber-900 placeholder:text-amber-900/50';
  }
};

const NOTE_COLORS = [
  'bg-yellow-400',
  'bg-red-400',
  'bg-cyan-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-pink-400'
];

export function StickyWall({ notes, onAddNote, onUpdateNote, onDeleteNote }: StickyWallProps) {
  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => {
          return (
            <div
              key={note.id}
              className={twMerge(
                "group relative min-h-[280px] p-8 rounded-3xl transition-all flex flex-col focus-within:ring-2 focus-within:ring-foreground/20 focus-within:shadow-xl",
                getStickyColor(note.color),
                "border shadow-sm"
              )}
            >
              <input
                type="text"
                value={note.title}
                onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
                placeholder="Note Title..."
                className="text-2xl font-bold bg-transparent outline-none mb-4 w-full"
              />
              <textarea
                value={note.content}
                onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
                placeholder="Write your note here..."
                className="bg-transparent outline-none flex-1 text-sm leading-relaxed resize-none w-full"
              />
              
              {/* Footer actions */}
              <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => onUpdateNote(note.id, { color: c })}
                      className={twMerge("w-4 h-4 rounded-full border border-black/10 transition-transform hover:scale-110", c, note.color === c ? "ring-2 ring-black/30 ring-offset-1" : "")}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => onDeleteNote(note.id)}
                  className="p-1.5 hover:bg-black/10 rounded-lg text-black/50 hover:text-black transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Note Card */}
        <div
          onClick={onAddNote}
          className="min-h-[280px] rounded-3xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/30 hover:border-muted-foreground/30 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
