import {
  ChevronDown,
  ExternalLink,
  Youtube,
  BookOpen,
  CheckCircle2,
  Circle,
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusSelector } from './StatusSelector';
import { cn } from '@/lib/utils';
import { DIFFICULTY_CONFIG, type Problem, type ProblemStatus } from '@/types';
import { useTrackClick, useUpdateStatus } from '@/hooks/useProblems';

const diffVariantMap: Record<string, 'easy' | 'medium' | 'hard'> = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

const SOLVED_STATES: ProblemStatus[] = ['SOLVED', 'REVISED', 'MASTERED'];

function isSolved(status: ProblemStatus | undefined): boolean {
  return !!status && SOLVED_STATES.includes(status);
}

interface ProblemAccordionProps {
  topic: string;
  problems: Problem[];
  expanded: boolean;
  onToggle: () => void;
  onEdit: (problem: Problem) => void;
  onDelete: (problem: Problem) => void;
}

export function ProblemAccordion({
  topic,
  problems,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: ProblemAccordionProps) {
  const solved = problems.filter((p) => isSolved(p.userProblem?.status)).length;
  const total = problems.length;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )}
        />
        <span className="flex-1 font-semibold">{topic}</span>

        {/* Progress bar */}
        <div className="hidden sm:block w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              pct === 100 ? 'bg-emerald-500' : 'bg-primary'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        <span
          className={cn(
            'shrink-0 text-sm tabular-nums font-medium w-16 text-right',
            pct === 100 ? 'text-emerald-500' : 'text-muted-foreground'
          )}
        >
          {solved}/{total}
        </span>
      </button>

      {/* Rows */}
      {expanded && (
        <div className="border-t border-border">
          {problems.map((problem) => (
            <ProblemRow
              key={problem.id}
              problem={problem}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProblemRow({
  problem,
  onEdit,
  onDelete,
}: {
  problem: Problem;
  onEdit: (p: Problem) => void;
  onDelete: (p: Problem) => void;
}) {
  const updateStatus = useUpdateStatus();
  const trackClick = useTrackClick();

  const up = problem.userProblem;
  const status: ProblemStatus = up?.status ?? 'NOT_STARTED';
  const solved = isSolved(status);

  const handleOpen = () => {
    trackClick.mutate(problem.id);
    window.open(problem.url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleSolved = () => {
    updateStatus.mutate({
      problemId: problem.id,
      status: solved ? 'NOT_STARTED' : 'SOLVED',
    });
  };

  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Solved toggle */}
      <button
        onClick={handleToggleSolved}
        disabled={updateStatus.isPending}
        title={solved ? 'Mark as not started' : 'Mark as solved'}
        className="shrink-0"
      >
        {solved ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-muted-foreground" />
        )}
      </button>

      {/* Title + links */}
      <div className="min-w-0 flex-1">
        <button
          onClick={handleOpen}
          className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors text-left"
        >
          <span className="truncate">{problem.title}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
        </button>
      </div>

      {/* Rating */}
      {up?.personalRating ? (
        <div className="hidden md:flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3 w-3',
                i < up.personalRating!
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-muted-foreground/25'
              )}
            />
          ))}
        </div>
      ) : null}

      {/* Resource links */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {problem.youtubeLink && (
          <a
            href={problem.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-600"
            title="Watch solution"
          >
            <Youtube className="h-4 w-4" />
          </a>
        )}
        {problem.solutionLink && (
          <a
            href={problem.solutionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
            title="View solution"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Status dropdown */}
      <div className="hidden md:block shrink-0">
        <StatusSelector
          currentStatus={status}
          onChange={(s) => updateStatus.mutate({ problemId: problem.id, status: s })}
          disabled={updateStatus.isPending}
        />
      </div>

      {/* Difficulty */}
      <Badge variant={diffVariantMap[problem.difficulty]} className="shrink-0 w-16 justify-center">
        {DIFFICULTY_CONFIG[problem.difficulty].label}
      </Badge>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(problem)} className="gap-2 cursor-pointer">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(problem)}
            className="gap-2 text-red-600 cursor-pointer focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
