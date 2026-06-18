import { useState } from 'react';
import { Plus, Layers, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSheets, useCreateSheet, useDeleteSheet } from '@/hooks/useSheets';
import type { Sheet } from '@/types';

const DEFAULT_SHEETS = [
  { name: 'NeetCode 150', description: 'Top 150 curated problems for FAANG interviews' },
  { name: 'Striver A2Z', description: 'Complete DSA roadmap by Striver' },
  { name: 'Blind 75', description: 'Classic 75 problems for interview prep' },
  { name: 'Google Prep', description: 'Google-specific interview patterns' },
  { name: 'Amazon Prep', description: 'Amazon OA and interview problems' },
];

export function Sheets() {
  const { data: sheets, isLoading } = useSheets();
  const createSheet = useCreateSheet();
  const deleteSheet = useDeleteSheet();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    createSheet.mutate(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setName('');
          setDescription('');
        },
      }
    );
  };

  const handleDelete = (sheet: Sheet) => {
    if (confirm(`Delete sheet "${sheet.name}"? This will not delete the problems.`)) {
      deleteSheet.mutate(sheet.id);
    }
  };

  const handleQuickCreate = (template: (typeof DEFAULT_SHEETS)[0]) => {
    createSheet.mutate({ name: template.name, description: template.description });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sheets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize problems into curated lists
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Sheet
        </Button>
      </div>

      {/* Quick Templates */}
      {(!sheets || sheets.length === 0) && !isLoading && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Quick start with a template</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SHEETS.map((t) => (
              <Button
                key={t.name}
                variant="outline"
                size="sm"
                onClick={() => handleQuickCreate(t)}
                disabled={createSheet.isPending}
              >
                {t.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Sheet Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : sheets?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Layers className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No sheets yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheets?.map((sheet) => (
            <SheetCard key={sheet.id} sheet={sheet} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Sheet Name *</Label>
              <Input
                placeholder="e.g. Google Preparation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createSheet.isPending}>
              {createSheet.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SheetCard({ sheet, onDelete }: { sheet: Sheet; onDelete: (s: Sheet) => void }) {
  const pct = sheet.problemCount > 0
    ? Math.round((sheet.solvedCount / sheet.problemCount) * 100)
    : 0;

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <CardTitle className="text-base">{sheet.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => onDelete(sheet)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        {sheet.description && (
          <CardDescription className="text-xs leading-relaxed">{sheet.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{sheet.solvedCount}/{sheet.problemCount} solved</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />

        <Link
          to={`/sheets/${sheet.id}`}
          className="flex items-center justify-between text-sm text-primary hover:underline mt-2"
        >
          View problems
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
