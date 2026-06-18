import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  sub?: string;
  iconColor?: string;
  iconBg?: string;
}

export function StatsCard({ label, value, icon: Icon, sub, iconColor, iconBg }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', iconBg ?? 'bg-primary/10')}>
          <Icon className={cn('h-5 w-5', iconColor ?? 'text-primary')} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
