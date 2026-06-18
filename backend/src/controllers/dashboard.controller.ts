import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';
import { startOfDay } from '../utils/dateUtils';

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    // One parallel batch of all reads, then everything else is computed in
    // memory — avoids extra DB round-trips (costly when the DB is far away).
    const [
      user,
      totalProblems,
      userProblems,
      topicStats,
      difficultyStats,
      phaseStats,
      activityLast365,
      revisionDue,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { streak: true, name: true, avatar: true },
      }),
      prisma.problem.count(),
      prisma.userProblem.findMany({
        where: { userId },
        select: {
          status: true,
          problem: {
            select: { topic: true, difficulty: true, phase: true },
          },
        },
      }),
      prisma.problem.groupBy({
        by: ['topic'],
        _count: { id: true },
        orderBy: { topic: 'asc' },
      }),
      prisma.problem.groupBy({
        by: ['difficulty'],
        _count: { id: true },
      }),
      prisma.problem.groupBy({
        by: ['phase'],
        _count: { id: true },
      }),
      prisma.dailyActivity.findMany({
        where: { userId, date: { gte: yearAgo } },
        select: { date: true, count: true },
        orderBy: { date: 'asc' },
      }),
      prisma.userProblem.count({
        where: { userId, status: 'REVISED', lastRevisedAt: { lt: sevenDaysAgo } },
      }),
    ]);

    const isSolved = (s: string) => ['SOLVED', 'REVISED', 'MASTERED'].includes(s);
    const solved = userProblems.filter((up) => isSolved(up.status)).length;
    const attempted = userProblems.filter((up) => up.status === 'ATTEMPTED').length;
    const mastered = userProblems.filter((up) => up.status === 'MASTERED').length;
    const revised = userProblems.filter((up) => up.status === 'REVISED').length;

    // Per-topic / per-difficulty / per-phase totals from groupBy, solved counts
    // tallied from the user's problems in a single pass.
    const topicCompletion: Record<string, { total: number; solved: number }> = {};
    for (const t of topicStats) topicCompletion[t.topic] = { total: t._count.id, solved: 0 };

    const difficultyBreakdown: Record<string, { total: number; solved: number }> = {};
    for (const d of difficultyStats) difficultyBreakdown[d.difficulty] = { total: d._count.id, solved: 0 };

    const phaseSolved: Record<string, number> = {};
    for (const up of userProblems) {
      if (!isSolved(up.status)) continue;
      const { topic, difficulty, phase } = up.problem;
      if (topicCompletion[topic]) topicCompletion[topic].solved++;
      if (difficultyBreakdown[difficulty]) difficultyBreakdown[difficulty].solved++;
      phaseSolved[phase] = (phaseSolved[phase] ?? 0) + 1;
    }

    // Phase progress (computed in memory, no extra queries)
    const phaseOrder = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4'] as const;
    const phaseTotals: Record<string, number> = {};
    for (const p of phaseStats) phaseTotals[p.phase] = p._count.id;
    const phaseProgress = phaseOrder.map((phase) => {
      const total = phaseTotals[phase] ?? 0;
      const s = phaseSolved[phase] ?? 0;
      return { phase, total, solved: s, percentage: total > 0 ? Math.round((s / total) * 100) : 0 };
    });

    // Weakest topics (lowest completion %)
    const topicList = Object.entries(topicCompletion)
      .map(([topic, { total, solved: s }]) => ({
        topic,
        total,
        solved: s,
        percentage: total > 0 ? Math.round((s / total) * 100) : 0,
      }))
      .sort((a, b) => a.percentage - b.percentage);

    const today = startOfDay(new Date());
    const todayActivity = activityLast365.find(
      (a) => startOfDay(new Date(a.date)).getTime() === today.getTime()
    );

    sendSuccess(res, {
      user,
      stats: {
        totalProblems,
        solved,
        attempted,
        revised,
        mastered,
        revisionDue,
        streak: user?.streak ?? 0,
        todaySolved: todayActivity?.count ?? 0,
      },
      topicCompletion: topicList,
      difficultyBreakdown,
      phaseProgress,
      heatmap: activityLast365.map((a) => ({
        date: a.date,
        count: a.count,
      })),
      weakestTopics: topicList.slice(0, 5),
      strongestTopics: [...topicList].reverse().slice(0, 5),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    sendError(res, 'Failed to load dashboard', 500);
  }
};

export const getHeatmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 365;

    const activity = await prisma.dailyActivity.findMany({
      where: {
        userId,
        date: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      },
      select: { date: true, count: true },
      orderBy: { date: 'asc' },
    });

    sendSuccess(res, activity);
  } catch {
    sendError(res, 'Failed to fetch heatmap', 500);
  }
};
