'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface LabeledSelectProps {
  id?: string;
  /** Visible label (translate with next-intl in the parent). */
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (next: string) => void;
}

export default function LabeledSelect({
  id: idProp,
  label,
  value,
  options,
  onChange,
}: LabeledSelectProps) {
  const autoId = useId();
  const id = idProp ?? `labeled-select-${autoId}`;
  const labelId = `${id}-label`;

  return (
    <div className="flex w-fit flex-col gap-1.5">
      <label
        id={labelId}
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-wide text-on-surface/50"
      >
        {label}
      </label>
      <div className="relative min-w-0">
        <select
          id={id}
          aria-labelledby={labelId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-auto min-w-[8rem] cursor-pointer appearance-none rounded-full border border-outline/30 bg-white px-3 py-2.5 pr-10 text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface/40"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
