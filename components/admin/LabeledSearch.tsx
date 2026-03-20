'use client';

import { Search } from 'lucide-react';

interface LabeledSearchProps {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (next: string) => void;
}

export default function LabeledSearch({
  id,
  label,
  value,
  placeholder,
  onChange,
}: LabeledSearchProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wide text-on-surface/50"
      >
        {label}
      </label>
      <div className="relative min-w-0">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 rounded-full border border-outline/30 bg-white py-2.5 pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface/50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}

