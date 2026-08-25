import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  label?: string;
}

export function TagInput({ value, onChange, suggestions, placeholder = 'Type and press Enter', label }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean || value.some((v) => v.toLowerCase() === clean.toLowerCase())) return;
    onChange([...value, clean]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((v) => v !== tag));
  };

  const filteredSuggestions = (suggestions ?? [])
    .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()))
    .filter((s) => (input ? s.toLowerCase().includes(input.toLowerCase()) : true))
    .slice(0, 6);

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="rounded-xl bg-bg-elevated border border-bg-border px-2 py-2 focus-within:border-brand-500/60 focus-within:ring-2 focus-within:ring-brand-500/20 transition-colors">
        <div className="flex flex-wrap items-center gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500/15 px-2.5 py-1 text-xs font-medium text-brand-300 border border-brand-500/25"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-brand-300/70 hover:text-white"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag(input);
              }
              if (e.key === 'Backspace' && !input && value.length > 0) {
                removeTag(value[value.length - 1]);
              }
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent px-2 py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className={cn(
                'chip bg-white/5 text-slate-300 border border-white/10 hover:bg-brand-500/15 hover:text-brand-300 hover:border-brand-500/30 transition-colors',
              )}
            >
              <Plus className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
