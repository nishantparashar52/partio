// apps/web/src/components/CategoryPills.tsx
import { twMerge } from 'tailwind-merge';
const CATS = ['music','food','tech','sports','gaming','art','wellness'];

export default function CategoryPills({ value, onChange }: { value?: string; onChange: (v: string)=>void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATS.map(c => (
        <button
          key={c}
          className={twMerge('pill border-gray-300 dark:border-white/15', value===c && 'border-brand-500 text-brand-700 dark:text-brand-300')}
          onClick={() => onChange(value===c ? '' : c)}
          aria-pressed={value===c}
        >
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="capitalize">{c}</span>
        </button>
      ))}
    </div>
  );
}
