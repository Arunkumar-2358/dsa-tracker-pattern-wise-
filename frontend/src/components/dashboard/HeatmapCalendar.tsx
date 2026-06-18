import { useMemo } from 'react';
import { generateCalendarDays, getHeatmapColor, formatDate } from '@/lib/utils';
import type { DailyActivity } from '@/types';

interface HeatmapCalendarProps {
  activity: DailyActivity[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function HeatmapCalendar({ activity }: HeatmapCalendarProps) {
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of activity) {
      const key = new Date(a.date).toISOString().split('T')[0];
      map.set(key, a.count);
    }
    return map;
  }, [activity]);

  const days = useMemo(() => generateCalendarDays(activityMap, 365), [activityMap]);

  const weeks = useMemo(() => {
    const result: (typeof days)[] = [];
    // Pad start to align to Sunday
    const firstDay = days[0].date.getDay();
    const padded = [...Array(firstDay).fill(null), ...days];
    for (let i = 0; i < padded.length; i += 7) {
      result.push(padded.slice(i, i + 7) as typeof days);
    }
    return result;
  }, [days]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; col: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const validDay = week.find((d) => d !== null);
      if (validDay) {
        const month = validDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], col: i });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  const totalSolved = activity.reduce((sum, a) => sum + a.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{totalSolved} submissions in the last year</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 3, 5, 7].map((c) => (
            <div key={c} className={`h-3 w-3 rounded-sm ${getHeatmapColor(c)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 pr-1 pt-5">
            {DAYS.map((d, i) => (
              <div key={i} className="h-3 w-6 text-right text-[10px] text-muted-foreground leading-3">
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="relative">
            {/* Month labels */}
            <div className="flex h-5">
              {monthLabels.map(({ month, col }) => (
                <div
                  key={`${month}-${col}`}
                  className="absolute text-[11px] text-muted-foreground"
                  style={{ left: col * 14 }}
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) =>
                    day === null ? (
                      <div key={di} className="h-3 w-3" />
                    ) : (
                      <div
                        key={day.dateStr}
                        title={`${formatDate(day.date)}: ${day.count} solved`}
                        className={`h-3 w-3 rounded-sm cursor-default transition-opacity hover:opacity-80 ${getHeatmapColor(day.count)}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
