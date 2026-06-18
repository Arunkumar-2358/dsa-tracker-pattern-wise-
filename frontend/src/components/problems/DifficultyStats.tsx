import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types';

interface Counts {
  solved: number;
  total: number;
}

interface DifficultyStatsProps {
  byDifficulty: Record<Difficulty, Counts>;
  overall: Counts;
  active?: Difficulty;
  onSelect: (difficulty?: Difficulty) => void;
}

const DIFF_META: Record<Difficulty, { label: string; color: string; ring: string }> = {
  EASY: { label: 'Easy', color: 'text-emerald-500', ring: 'ring-emerald-500' },
  MEDIUM: { label: 'Med.', color: 'text-amber-500', ring: 'ring-amber-500' },
  HARD: { label: 'Hard', color: 'text-red-500', ring: 'ring-red-500' },
};

export function DifficultyStats({ byDifficulty, overall, active, onSelect }: DifficultyStatsProps) {
  const pct = overall.total > 0 ? Math.round((overall.solved / overall.total) * 100) : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-5">
      {/* Overall ring */}
      <div className="relative h-24 w-24 shrink-0">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth="7"
            className="stroke-secondary"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            className="stroke-primary transition-all duration-500"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold tabular-nums leading-none">{overall.solved}</span>
          <span className="text-xs text-muted-foreground tabular-nums">/{overall.total}</span>
        </div>
      </div>

      {/* Difficulty chips */}
      <div className="flex flex-1 flex-wrap gap-3">
        <button
          onClick={() => onSelect(undefined)}
          className={cn(
            'flex flex-col items-start rounded-lg border px-4 py-2.5 transition-colors min-w-[88px]',
            !active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
          )}
        >
          <span className="text-xs text-muted-foreground">All</span>
          <span className="text-base font-semibold tabular-nums">
            {overall.solved}
            <span className="text-muted-foreground font-normal">/{overall.total}</span>
          </span>
        </button>

        {(Object.keys(DIFF_META) as Difficulty[]).map((d) => {
          const meta = DIFF_META[d];
          const c = byDifficulty[d];
          const isActive = active === d;
          return (
            <button
              key={d}
              onClick={() => onSelect(isActive ? undefined : d)}
              className={cn(
                'flex flex-col items-start rounded-lg border px-4 py-2.5 transition-colors min-w-[88px]',
                isActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              )}
            >
              <span className={cn('text-xs font-medium', meta.color)}>{meta.label}</span>
              <span className="text-base font-semibold tabular-nums">
                {c.solved}
                <span className="text-muted-foreground font-normal">/{c.total}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
