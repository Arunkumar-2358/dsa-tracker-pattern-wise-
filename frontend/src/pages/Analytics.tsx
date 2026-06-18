import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const DIFF_COLORS = {
  EASY: '#10b981',
  MEDIUM: '#f59e0b',
  HARD: '#ef4444',
};

export function Analytics() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <p className="text-muted-foreground">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const { topicCompletion, difficultyBreakdown, phaseProgress, weakestTopics, strongestTopics } = data;

  // Top 15 topics by total problems
  const topTopics = [...topicCompletion]
    .sort((a, b) => b.total - a.total)
    .slice(0, 15)
    .map((t) => ({ topic: t.topic.split(' ')[0], total: t.total, solved: t.solved }));

  // Difficulty pie data
  const pieData = (['EASY', 'MEDIUM', 'HARD'] as const)
    .map((d) => ({
      name: d.charAt(0) + d.slice(1).toLowerCase(),
      value: difficultyBreakdown[d]?.solved ?? 0,
      fill: DIFF_COLORS[d],
    }))
    .filter((d) => d.value > 0);

  // Phase bar data
  const phaseData = phaseProgress.map((p) => ({
    name: p.phase.replace('PHASE_', 'Phase '),
    solved: p.solved,
    remaining: p.total - p.solved,
    total: p.total,
  }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep dive into your preparation progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase Progress Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Phase Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={phaseData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [value, name === 'solved' ? 'Solved' : 'Remaining']}
                />
                <Bar dataKey="solved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="solved" />
                <Bar dataKey="remaining" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="remaining" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Solved by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No problems solved yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Problems per Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topTopics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="topic" width={80} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="solved" fill="hsl(var(--primary))" name="Solved" radius={[0, 4, 4, 0]} />
                <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weakest Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Weakest Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakestTopics.map((t) => (
                <div key={t.topic} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate" title={t.topic}>{t.topic}</span>
                    <span className="text-muted-foreground">{t.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strongest Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Strongest Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strongestTopics.map((t) => (
                <div key={t.topic} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate" title={t.topic}>{t.topic}</span>
                    <span className="text-muted-foreground">{t.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
