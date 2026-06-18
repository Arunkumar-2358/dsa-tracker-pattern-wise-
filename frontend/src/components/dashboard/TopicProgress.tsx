import { Progress } from '@/components/ui/progress';
import type { TopicStat } from '@/types';

interface TopicProgressProps {
  topics: TopicStat[];
  title: string;
}

export function TopicProgress({ topics, title }: TopicProgressProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.topic} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate max-w-[200px]" title={t.topic}>
                {t.topic}
              </span>
              <span className="text-muted-foreground tabular-nums shrink-0 ml-2">
                {t.solved}/{t.total} ({t.percentage}%)
              </span>
            </div>
            <Progress value={t.percentage} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
