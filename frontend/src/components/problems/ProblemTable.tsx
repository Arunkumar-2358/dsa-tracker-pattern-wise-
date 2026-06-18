import { ExternalLink, Star, Youtube, BookOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
import { DIFFICULTY_CONFIG, type Problem, type ProblemStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTrackClick, useUpdateStatus } from '@/hooks/useProblems';

const diffVariantMap: Record<string, 'easy' | 'medium' | 'hard'> = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

interface ProblemTableProps {
  problems: Problem[];
  onEdit?: (problem: Problem) => void;
  onDelete?: (problem: Problem) => void;
}

export function ProblemTable({ problems, onEdit, onDelete }: ProblemTableProps) {
  const updateStatus = useUpdateStatus();
  const trackClick = useTrackClick();

  const handleStatusChange = (problemId: string, status: ProblemStatus) => {
    updateStatus.mutate({ problemId, status });
  };

  const handleClick = (problem: Problem) => {
    trackClick.mutate(problem.id);
    window.open(problem.url, '_blank', 'noopener,noreferrer');
  };

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">No problems found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-8">#</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4">Problem</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-24">Difficulty</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-28">Topic</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-36">Status</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-24">Rating</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-28">Solved</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-4 w-24">Companies</th>
            <th className="w-12 py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, idx) => {
            const up = problem.userProblem;
            const status: ProblemStatus = up?.status ?? 'NOT_STARTED';
            const diff = DIFFICULTY_CONFIG[problem.difficulty];

            return (
              <tr
                key={problem.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3 px-4 text-muted-foreground tabular-nums">
                  {idx + 1}
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() => handleClick(problem)}
                    className="flex items-center gap-2 font-medium hover:text-primary transition-colors text-left"
                  >
                    {problem.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-2 mt-0.5">
                    {problem.youtubeLink && (
                      <a
                        href={problem.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Youtube className="h-3 w-3" />
                      </a>
                    )}
                    {problem.solutionLink && (
                      <a
                        href={problem.solutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <BookOpen className="h-3 w-3" />
                      </a>
                    )}
                    {up && up.revisionCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ×{up.revisionCount} revised
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <Badge variant={diffVariantMap[problem.difficulty]}>
                    {diff.label}
                  </Badge>
                </td>

                <td className="py-3 px-4">
                  <span className="text-muted-foreground text-xs">{problem.topic}</span>
                </td>

                <td className="py-3 px-4">
                  <StatusSelector
                    currentStatus={status}
                    onChange={(s) => handleStatusChange(problem.id, s)}
                    disabled={updateStatus.isPending}
                  />
                </td>

                <td className="py-3 px-4">
                  {up?.personalRating ? (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < up.personalRating!
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">—</span>
                  )}
                </td>

                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {formatDate(up?.firstSolvedAt ?? null)}
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {problem.companyTags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {problem.companyTags.length > 2 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                        +{problem.companyTags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  {(onEdit ?? onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(problem)} className="gap-2 cursor-pointer">
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onEdit && onDelete && <DropdownMenuSeparator />}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(problem)}
                            className="gap-2 text-red-600 cursor-pointer focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
