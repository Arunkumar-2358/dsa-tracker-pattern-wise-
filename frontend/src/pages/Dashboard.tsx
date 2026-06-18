import {
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Star,
  Flame,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar';
import { TopicProgress } from '@/components/dashboard/TopicProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PHASE_LABELS } from '@/types';

export function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-muted-foreground">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const { stats, topicCompletion, difficultyBreakdown, phaseProgress, heatmap, weakestTopics } = data;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {data.user.name?.split(' ')[0]}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Problems"
          value={stats.totalProblems}
          icon={BookOpen}
          iconBg="bg-blue-50 dark:bg-blue-950"
          iconColor="text-blue-600"
        />
        <StatsCard
          label="Solved"
          value={stats.solved}
          icon={CheckCircle2}
          sub={`${Math.round((stats.solved / stats.totalProblems) * 100)}% complete`}
          iconBg="bg-green-50 dark:bg-green-950"
          iconColor="text-green-600"
        />
        <StatsCard
          label="Current Streak"
          value={`${stats.streak}d`}
          icon={Flame}
          sub="Keep it up!"
          iconBg="bg-orange-50 dark:bg-orange-950"
          iconColor="text-orange-600"
        />
        <StatsCard
          label="Revision Due"
          value={stats.revisionDue}
          icon={RefreshCw}
          sub="Problems to revisit"
          iconBg="bg-purple-50 dark:bg-purple-950"
          iconColor="text-purple-600"
        />
        <StatsCard
          label="Attempted"
          value={stats.attempted}
          icon={Zap}
          iconBg="bg-yellow-50 dark:bg-yellow-950"
          iconColor="text-yellow-600"
        />
        <StatsCard
          label="Mastered"
          value={stats.mastered}
          icon={Star}
          iconBg="bg-violet-50 dark:bg-violet-950"
          iconColor="text-violet-600"
        />
        <StatsCard
          label="Today Solved"
          value={stats.todaySolved}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 dark:bg-emerald-950"
          iconColor="text-emerald-600"
        />
        <StatsCard
          label="Revised"
          value={stats.revised}
          icon={RefreshCw}
          iconBg="bg-cyan-50 dark:bg-cyan-950"
          iconColor="text-cyan-600"
        />
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatmapCalendar activity={heatmap} />
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Phase Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phaseProgress.map((p) => (
            <div key={p.phase} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{PHASE_LABELS[p.phase]}</span>
                <span className="text-muted-foreground tabular-nums">
                  {p.solved}/{p.total} ({p.percentage}%)
                </span>
              </div>
              <Progress value={p.percentage} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['EASY', 'MEDIUM', 'HARD'] as const).map((d) => {
              const info = difficultyBreakdown[d];
              if (!info) return null;
              const pct = info.total > 0 ? Math.round((info.solved / info.total) * 100) : 0;
              const colorMap = {
                EASY: 'bg-emerald-500',
                MEDIUM: 'bg-amber-500',
                HARD: 'bg-red-500',
              };
              return (
                <div key={d} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{d.toLowerCase()}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {info.solved}/{info.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${colorMap[d]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Weakest Topics */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Topics to Improve</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicProgress topics={weakestTopics} title="" />
          </CardContent>
        </Card>
      </div>

      {/* All Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Topic Completion ({topicCompletion.length} topics)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {topicCompletion.map((t) => (
              <div key={t.topic} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate" title={t.topic}>{t.topic}</span>
                  <span className="text-muted-foreground tabular-nums shrink-0 ml-2">
                    {t.solved}/{t.total}
                  </span>
                </div>
                <Progress value={t.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
