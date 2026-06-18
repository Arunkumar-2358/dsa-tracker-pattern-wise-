import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GitBranch } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useRoadmap, useAddNode, useDeleteNode } from '@/hooks/useRoadmaps';

export function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: roadmap, isLoading } = useRoadmap(id ?? '');
  const addNode = useAddNode();
  const deleteNode = useDeleteNode();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  if (isLoading || !roadmap) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const rootNodes = roadmap.nodes.filter((n) => !n.parentId).sort((a, b) => a.order - b.order);
  const getChildren = (nodeId: string) =>
    roadmap.nodes.filter((n) => n.parentId === nodeId).sort((a, b) => a.order - b.order);

  const handleAddNode = () => {
    if (!topic.trim()) return;
    addNode.mutate(
      { roadmapId: roadmap.id, data: { topic: topic.trim(), parentId } },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setTopic('');
          setParentId(null);
        },
      }
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    if (confirm('Delete this node?')) {
      deleteNode.mutate({ roadmapId: roadmap.id, nodeId });
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="space-y-2">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roadmaps
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{roadmap.name}</h1>
            {roadmap.description && (
              <p className="text-sm text-muted-foreground">{roadmap.description}</p>
            )}
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        {rootNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No nodes yet. Add a topic to get started.</p>
          </div>
        ) : (
          rootNodes.map((node, i) => {
            const children = getChildren(node.id);
            return (
              <div key={node.id} className="relative">
                {/* Connector line */}
                {i < rootNodes.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-px bg-border" />
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 group">
                      <span className="font-medium">{node.topic}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 text-xs"
                          onClick={() => {
                            setParentId(node.id);
                            setDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Sub-topic
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Children */}
                    {children.length > 0 && (
                      <div className="ml-6 space-y-2 border-l border-border pl-4">
                        {children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5 group"
                          >
                            <span className="text-sm">{child.topic}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteNode(child.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Node Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setParentId(null); setTopic(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentId ? 'Add Sub-topic' : 'Add Topic'}
            </DialogTitle>
          </DialogHeader>
          {parentId && (
            <p className="text-sm text-muted-foreground -mt-2">
              Under: {roadmap.nodes.find((n) => n.id === parentId)?.topic}
            </p>
          )}
          <div className="space-y-1.5 py-2">
            <Label>Topic Name *</Label>
            <Input
              placeholder="e.g. Dynamic Programming"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNode} disabled={!topic.trim() || addNode.isPending}>
              {addNode.isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
