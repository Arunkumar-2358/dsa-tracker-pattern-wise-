import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Problem, Difficulty, Phase } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  url: z.string().url('Must be a valid URL'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'] as const),
  topic: z.string().min(1, 'Topic is required'),
  subtopic: z.string().optional(),
  companyTags: z.string().optional(),
  notes: z.string().optional(),
  solutionLink: z.string().url().optional().or(z.literal('')),
  youtubeLink: z.string().url().optional().or(z.literal('')),
  phase: z.enum(['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4'] as const),
});

type FormData = z.infer<typeof schema>;

interface ProblemFormProps {
  defaultValues?: Partial<Problem>;
  onSubmit: (data: Partial<Problem>) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function ProblemForm({ defaultValues, onSubmit, isLoading, onCancel }: ProblemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      url: defaultValues?.url ?? '',
      difficulty: defaultValues?.difficulty ?? 'MEDIUM',
      topic: defaultValues?.topic ?? '',
      subtopic: defaultValues?.subtopic ?? '',
      companyTags: defaultValues?.companyTags?.join(', ') ?? '',
      notes: defaultValues?.notes ?? '',
      solutionLink: defaultValues?.solutionLink ?? '',
      youtubeLink: defaultValues?.youtubeLink ?? '',
      phase: defaultValues?.phase ?? 'PHASE_1',
    },
  });

  const difficulty = watch('difficulty');
  const phase = watch('phase');

  const handleFormSubmit = (data: FormData) => {
    const companyTags = data.companyTags
      ? data.companyTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    onSubmit({
      ...data,
      companyTags,
      solutionLink: data.solutionLink || undefined,
      youtubeLink: data.youtubeLink || undefined,
      subtopic: data.subtopic || undefined,
      notes: data.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{defaultValues?.id ? 'Edit Problem' : 'Add Problem'}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        {/* Title */}
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="title">Problem Title *</Label>
          <Input id="title" placeholder="e.g. Two Sum" {...register('title')} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* URL */}
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="url">LeetCode URL *</Label>
          <Input
            id="url"
            placeholder="https://leetcode.com/problems/two-sum/"
            {...register('url')}
          />
          {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <Label>Difficulty *</Label>
          <Select
            value={difficulty}
            onValueChange={(v) => setValue('difficulty', v as Difficulty)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phase */}
        <div className="space-y-1.5">
          <Label>Phase *</Label>
          <Select value={phase} onValueChange={(v) => setValue('phase', v as Phase)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHASE_1">Phase 1 — Core Fundamentals</SelectItem>
              <SelectItem value="PHASE_2">Phase 2 — Structures & Recursion</SelectItem>
              <SelectItem value="PHASE_3">Phase 3 — Graphs & DP</SelectItem>
              <SelectItem value="PHASE_4">Phase 4 — Long Tail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <Label htmlFor="topic">Topic *</Label>
          <Input id="topic" placeholder="e.g. Hashing" {...register('topic')} />
          {errors.topic && <p className="text-xs text-red-500">{errors.topic.message}</p>}
        </div>

        {/* Subtopic */}
        <div className="space-y-1.5">
          <Label htmlFor="subtopic">Subtopic</Label>
          <Input id="subtopic" placeholder="e.g. Array Lookup" {...register('subtopic')} />
        </div>

        {/* Company Tags */}
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="companyTags">Company Tags (comma-separated)</Label>
          <Input
            id="companyTags"
            placeholder="e.g. Google, Amazon, Meta"
            {...register('companyTags')}
          />
        </div>

        {/* Solution Link */}
        <div className="space-y-1.5">
          <Label htmlFor="solutionLink">Solution Link</Label>
          <Input
            id="solutionLink"
            placeholder="https://github.com/..."
            {...register('solutionLink')}
          />
          {errors.solutionLink && <p className="text-xs text-red-500">{errors.solutionLink.message}</p>}
        </div>

        {/* YouTube Link */}
        <div className="space-y-1.5">
          <Label htmlFor="youtubeLink">YouTube Link</Label>
          <Input
            id="youtubeLink"
            placeholder="https://youtube.com/..."
            {...register('youtubeLink')}
          />
          {errors.youtubeLink && <p className="text-xs text-red-500">{errors.youtubeLink.message}</p>}
        </div>

        {/* Notes */}
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Key insights, approach, edge cases..."
            rows={3}
            {...register('notes')}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues?.id ? 'Update' : 'Add Problem'}
        </Button>
      </DialogFooter>
    </form>
  );
}
