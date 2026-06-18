import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDuration(minutes: number | null): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getHeatmapColor(count: number): string {
  if (count === 0) return 'bg-muted';
  if (count === 1) return 'bg-emerald-200 dark:bg-emerald-900';
  if (count <= 3) return 'bg-emerald-400 dark:bg-emerald-700';
  if (count <= 6) return 'bg-emerald-600 dark:bg-emerald-500';
  return 'bg-emerald-800 dark:bg-emerald-300';
}

export function generateCalendarDays(activityMap: Map<string, number>, days = 365) {
  const result: Array<{ date: Date; count: number; dateStr: string }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: d, count: activityMap.get(dateStr) ?? 0, dateStr });
  }

  return result;
}
