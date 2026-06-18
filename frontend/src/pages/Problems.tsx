import { useState, useCallback } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { ProblemForm } from '@/components/problems/ProblemForm';
import {
  useProblems,
  useTopics,
  useCreateProblem,
  useUpdateProblem,
  useDeleteProblem,
} from '@/hooks/useProblems';
import type { Problem, ProblemFilters, Difficulty, Phase } from '@/types';
import { PHASE_LABELS } from '@/types';

const PHASES: Phase[] = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4'];
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

export function Problems() {
  const [filters, setFilters] = useState<ProblemFilters>({ limit: 200 });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const { data, isLoading } = useProblems({ ...filters, search: search || undefined });
  const { data: topicsData } = useTopics();
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const deleteProblem = useDeleteProblem();

  const problems = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const topics = topicsData ?? [];

  const setFilter = useCallback(<K extends keyof ProblemFilters>(key: K, value: ProblemFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = () => {
    setFilters({ limit: 200 });
    setSearch('');
  };

  const hasFilters = !!(filters.topic ?? filters.difficulty ?? filters.phase ?? search);

  const handleCreate = (data: Partial<Problem>) => {
    createProblem.mutate(data, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleUpdate = (data: Partial<Problem>) => {
    if (!editingProblem) return;
    updateProblem.mutate(
      { id: editingProblem.id, data },
      { onSuccess: () => { setDialogOpen(false); setEditingProblem(null); } }
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

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} problems · Click any problem to open LeetCode
          </p>
        </div>
        <Button onClick={() => { setEditingProblem(null); setDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={filters.difficulty ?? ''}
          onValueChange={(v) => setFilter('difficulty', (v || undefined) as Difficulty | undefined)}
        >
          <SelectTrigger className="w-32">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.topic ?? ''}
          onValueChange={(v) => setFilter('topic', v || undefined)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Topics</SelectItem>
            {[...new Set(topics.map((t) => t.topic))].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Tabs by Phase */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="all" onClick={() => setFilter('phase', undefined)}>
            All ({total})
          </TabsTrigger>
          {PHASES.map((phase) => (
            <TabsTrigger
              key={phase}
              value={phase}
              onClick={() => setFilter('phase', phase)}
            >
              {phase.replace('PHASE_', 'P')}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ProblemsView
            problems={problems}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        {PHASES.map((phase) => (
          <TabsContent key={phase} value={phase} className="mt-0">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {PHASE_LABELS[phase]}
              </h2>
            </div>
            <ProblemsView
              problems={problems}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
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
            onCancel={() => { setDialogOpen(false); setEditingProblem(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProblemsView({
  problems,
  isLoading,
  onEdit,
  onDelete,
}: {
  problems: Problem[];
  isLoading: boolean;
  onEdit: (p: Problem) => void;
  onDelete: (p: Problem) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <ProblemTable problems={problems} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
