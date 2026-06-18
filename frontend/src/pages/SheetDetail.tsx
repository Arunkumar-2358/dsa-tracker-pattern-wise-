import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { useSheet, useAddProblemToSheet, useRemoveProblemFromSheet } from '@/hooks/useSheets';
import { useProblems } from '@/hooks/useProblems';
import type { Problem } from '@/types';

export function SheetDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: sheet, isLoading } = useSheet(id ?? '');
  const addProblem = useAddProblemToSheet();
  const removeProblem = useRemoveProblemFromSheet();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: allProblems } = useProblems({ limit: 200 });

  if (isLoading || !sheet) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const sheetProblemIds = new Set(sheet.sheetProblems?.map((sp) => sp.problemId) ?? []);
  const sheetProblems = sheet.sheetProblems?.map((sp) => sp.problem) ?? [];

  const availableToAdd = (allProblems?.data ?? []).filter(
    (p) => !sheetProblemIds.has(p.id) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const pct = sheetProblems.length > 0
    ? Math.round(
        (sheetProblems.filter((p) => {
          const up = p.userProblem;
          return up && ['SOLVED', 'REVISED', 'MASTERED'].includes(up.status);
        }).length / sheetProblems.length) * 100
      )
    : 0;

  const handleAdd = (problemId: string) => {
    addProblem.mutate({ sheetId: sheet.id, problemId });
  };

  const handleRemove = (problem: Problem) => {
    if (confirm(`Remove "${problem.title}" from this sheet?`)) {
      removeProblem.mutate({ sheetId: sheet.id, problemId: problem.id });
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="space-y-3">
        <Link
          to="/sheets"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sheets
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{sheet.name}</h1>
            {sheet.description && (
              <p className="text-sm text-muted-foreground mt-1">{sheet.description}</p>
            )}
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Add Problems
          </Button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <Progress value={pct} className="flex-1" />
          <span className="text-sm font-medium shrink-0">
            {sheetProblems.filter((p) => {
              const up = p.userProblem;
              return up && ['SOLVED', 'REVISED', 'MASTERED'].includes(up.status);
            }).length}/{sheetProblems.length} solved ({pct}%)
          </span>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <ProblemTable
          problems={sheetProblems}
          onDelete={handleRemove}
        />
      </div>

      {/* Add Problems Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Problems to {sheet.name}</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
            {availableToAdd.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {search ? 'No problems match your search' : 'All problems already added'}
              </p>
            ) : (
              availableToAdd.slice(0, 50).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.topic} · {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(p.id)}
                    disabled={addProblem.isPending}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
