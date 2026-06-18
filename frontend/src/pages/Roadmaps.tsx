import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Map, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRoadmaps, useCreateRoadmap, useDeleteRoadmap } from '@/hooks/useRoadmaps';
import type { Roadmap } from '@/types';

const TEMPLATES = [
  {
    name: 'FAANG DSA Roadmap',
    description: 'Complete roadmap from arrays to advanced algorithms',
    nodes: [
      { topic: 'Arrays & Hashing', order: 0 },
      { topic: 'Two Pointers', order: 1 },
      { topic: 'Sliding Window', order: 2 },
      { topic: 'Binary Search', order: 3 },
      { topic: 'Prefix Sum', order: 4 },
      { topic: 'Stack', order: 5 },
      { topic: 'Linked List', order: 6 },
      { topic: 'Trees', order: 7 },
      { topic: 'Heap', order: 8 },
      { topic: 'Backtracking', order: 9 },
      { topic: 'Graphs', order: 10 },
      { topic: 'Dynamic Programming', order: 11 },
      { topic: 'Trie', order: 12 },
      { topic: 'Bit Manipulation', order: 13 },
    ],
  },
];

export function Roadmaps() {
  const { data: roadmaps, isLoading } = useRoadmaps();
  const createRoadmap = useCreateRoadmap();
  const deleteRoadmap = useDeleteRoadmap();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    createRoadmap.mutate(
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

  const handleDelete = (roadmap: Roadmap) => {
    if (confirm(`Delete roadmap "${roadmap.name}"?`)) {
      deleteRoadmap.mutate(roadmap.id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roadmaps</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build custom learning paths for your preparation
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Roadmap
        </Button>
      </div>

      {/* Templates */}
      {(!roadmaps || roadmaps.length === 0) && !isLoading && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Start with a template</p>
          <div className="flex gap-2">
            {TEMPLATES.map((t) => (
              <Button
                key={t.name}
                variant="outline"
                size="sm"
                onClick={() => createRoadmap.mutate({ name: t.name, description: t.description })}
                disabled={createRoadmap.isPending}
              >
                {t.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : roadmaps?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Map className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No roadmaps yet. Create one to track your learning path.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmaps?.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Roadmap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Roadmap Name *</Label>
              <Input
                placeholder="e.g. FAANG Preparation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                placeholder="Optional description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createRoadmap.isPending}>
              {createRoadmap.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RoadmapCard({ roadmap, onDelete }: { roadmap: Roadmap; onDelete: (r: Roadmap) => void }) {
  const rootNodes = roadmap.nodes.filter((n) => !n.parentId).slice(0, 5);

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-primary shrink-0" />
            <CardTitle className="text-base">{roadmap.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(roadmap)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        {roadmap.description && (
          <CardDescription className="text-xs">{roadmap.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {rootNodes.map((node) => (
            <span
              key={node.id}
              className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
            >
              {node.topic}
            </span>
          ))}
          {roadmap.nodes.length > 5 && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              +{roadmap.nodes.length - 5} more
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{roadmap.nodes.length} topics</p>
        <Link
          to={`/roadmaps/${roadmap.id}`}
          className="flex items-center justify-between text-sm text-primary hover:underline"
        >
          View roadmap <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
