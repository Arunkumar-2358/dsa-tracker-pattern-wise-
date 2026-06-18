import { useMemo, useState } from 'react';
import { Plus, Search, ChevronsDownUp, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProblemForm } from '@/components/problems/ProblemForm';
import { ProblemAccordion } from '@/components/problems/ProblemAccordion';
import { DifficultyStats } from '@/components/problems/DifficultyStats';
import {
  useProblems,
  useCreateProblem,
  useUpdateProblem,
  useDeleteProblem,
} from '@/hooks/useProblems';
import { PHASE_LABELS } from '@/types';
import type { Problem, Difficulty, Phase, ProblemStatus } from '@/types';

const PHASE_ORDER: Phase[] = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4'];
const SOLVED_STATES: ProblemStatus[] = ['SOLVED', 'REVISED', 'MASTERED'];

function isSolved(status?: ProblemStatus): boolean {
  return !!status && SOLVED_STATES.includes(status);
}

interface TopicGroup {
  topic: string;
  problems: Problem[];
}

interface PhaseGroup {
  phase: Phase;
  topics: TopicGroup[];
}

export function Problems() {
  const { data, isLoading } = useProblems({ limit: 500 });
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const deleteProblem = useDeleteProblem();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const allProblems = useMemo(() => data?.data ?? [], [data]);

  // Overall + per-difficulty stats (from the full list, independent of filters)
  const stats = useMemo(() => {
    const byDifficulty: Record<Difficulty, { solved: number; total: number }> = {
      EASY: { solved: 0, total: 0 },
      MEDIUM: { solved: 0, total: 0 },
      HARD: { solved: 0, total: 0 },
    };
    let solved = 0;
    for (const p of allProblems) {
      byDifficulty[p.difficulty].total++;
      if (isSolved(p.userProblem?.status)) {
        byDifficulty[p.difficulty].solved++;
        solved++;
      }
    }
    return { byDifficulty, overall: { solved, total: allProblems.length } };
  }, [allProblems]);

  const searchActive = search.trim().length > 0;

  // Filter + group by phase → topic, preserving curriculum order
  const phaseGroups = useMemo<PhaseGroup[]>(() => {
    const term = search.trim().toLowerCase();
    const filtered = allProblems.filter((p) => {
      if (difficulty && p.difficulty !== difficulty) return false;
      if (term && !p.title.toLowerCase().includes(term) && !p.topic.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });

    const result: PhaseGroup[] = [];
    for (const phase of PHASE_ORDER) {
      const phaseProblems = filtered.filter((p) => p.phase === phase);
      if (phaseProblems.length === 0) continue;

      const topicMap = new Map<string, Problem[]>();
      for (const p of phaseProblems) {
        const list = topicMap.get(p.topic) ?? [];
        list.push(p);
        topicMap.set(p.topic, list);
      }

      const topics: TopicGroup[] = [...topicMap.entries()]
        .map(([topic, problems]) => ({
          topic,
          problems: [...problems].sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => a.problems[0].order - b.problems[0].order);

      result.push({ phase, topics });
    }
    return result;
  }, [allProblems, difficulty, search]);

  const allTopicNames = useMemo(
    () => phaseGroups.flatMap((pg) => pg.topics.map((t) => t.topic)),
    [phaseGroups]
  );

  const isExpanded = (topic: string) => (searchActive ? true : expandedTopics.has(topic));

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const expandAll = () => setExpandedTopics(new Set(allTopicNames));
  const collapseAll = () => setExpandedTopics(new Set());
  const allExpanded = allTopicNames.length > 0 && allTopicNames.every((t) => expandedTopics.has(t));

  const clearFilters = () => {
    setSearch('');
    setDifficulty(undefined);
  };
  const hasFilters = searchActive || !!difficulty;

  const handleCreate = (payload: Partial<Problem>) => {
    createProblem.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleUpdate = (payload: Partial<Problem>) => {
    if (!editingProblem) return;
    updateProblem.mutate(
      { id: editingProblem.id, data: payload },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingProblem(null);
        },
      }
    );
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setDialogOpen(true);
  };

  const handleDelete = (problem: Problem) => {
    if (confirm(`Delete "${problem.title}"?`)) {
      deleteProblem.mutate(problem.id);
    }
  };

  const noResults = !isLoading && phaseGroups.length === 0;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.overall.total} problems, organized by pattern · click a problem to open LeetCode
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProblem(null);
            setDialogOpen(true);
          }}
          className="gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </div>

      {/* Stats */}
      <DifficultyStats
        byDifficulty={stats.byDifficulty}
        overall={stats.overall}
        active={difficulty}
        onSelect={setDifficulty}
      />

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems or patterns..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={allExpanded ? collapseAll : expandAll}
            className="gap-1.5"
            disabled={searchActive}
          >
            {allExpanded ? (
              <ChevronsDownUp className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : noResults ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No problems match your filters</p>
        </div>
      ) : (
        <div className="space-y-8">
          {phaseGroups.map((pg) => (
            <section key={pg.phase} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
                {PHASE_LABELS[pg.phase]}
              </h2>
              <div className="space-y-2.5">
                {pg.topics.map((tg) => (
                  <ProblemAccordion
                    key={tg.topic}
                    topic={tg.topic}
                    problems={tg.problems}
                    expanded={isExpanded(tg.topic)}
                    onToggle={() => toggleTopic(tg.topic)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingProblem(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ProblemForm
            defaultValues={editingProblem ?? undefined}
            onSubmit={editingProblem ? handleUpdate : handleCreate}
            isLoading={createProblem.isPending || updateProblem.isPending}
            onCancel={() => {
              setDialogOpen(false);
              setEditingProblem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
