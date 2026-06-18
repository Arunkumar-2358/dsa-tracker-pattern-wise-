"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeatmap = exports.getDashboard = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const dateUtils_1 = require("../utils/dateUtils");
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const [user, totalProblems, userProblems, topicStats, difficultyStats, activityLast365,] = await Promise.all([
            prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: { streak: true, name: true, avatar: true },
            }),
            prisma_1.prisma.problem.count(),
            prisma_1.prisma.userProblem.findMany({
                where: { userId },
                select: {
                    status: true,
                    problem: {
                        select: { topic: true, difficulty: true, phase: true },
                    },
                },
            }),
            prisma_1.prisma.problem.groupBy({
                by: ['topic'],
                _count: { id: true },
                orderBy: { topic: 'asc' },
            }),
            prisma_1.prisma.problem.groupBy({
                by: ['difficulty'],
                _count: { id: true },
            }),
            prisma_1.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    date: {
                        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
                    },
                },
                select: { date: true, count: true },
                orderBy: { date: 'asc' },
            }),
        ]);
        const solved = userProblems.filter((up) => ['SOLVED', 'REVISED', 'MASTERED'].includes(up.status)).length;
        const attempted = userProblems.filter((up) => up.status === 'ATTEMPTED').length;
        const mastered = userProblems.filter((up) => up.status === 'MASTERED').length;
        const revised = userProblems.filter((up) => up.status === 'REVISED').length;
        // Topic completion
        const topicCompletion = {};
        for (const t of topicStats) {
            topicCompletion[t.topic] = { total: t._count.id, solved: 0 };
        }
        for (const up of userProblems) {
            if (['SOLVED', 'REVISED', 'MASTERED'].includes(up.status)) {
                const topic = up.problem.topic;
                if (topicCompletion[topic]) {
                    topicCompletion[topic].solved++;
                }
            }
        }
        // Difficulty breakdown
        const difficultyBreakdown = {};
        for (const d of difficultyStats) {
            difficultyBreakdown[d.difficulty] = { total: d._count.id, solved: 0 };
        }
        for (const up of userProblems) {
            if (['SOLVED', 'REVISED', 'MASTERED'].includes(up.status)) {
                const diff = up.problem.difficulty;
                if (difficultyBreakdown[diff]) {
                    difficultyBreakdown[diff].solved++;
                }
            }
        }
        // Revision due today (problems last revised > 7 days ago with REVISED status)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const revisionDue = await prisma_1.prisma.userProblem.count({
            where: {
                userId,
                status: 'REVISED',
                lastRevisedAt: { lt: sevenDaysAgo },
            },
        });
        // Phase progress
        const phaseProgress = await getPhaseProgress(userId);
        // Weakest topics (lowest completion %)
        const topicList = Object.entries(topicCompletion)
            .map(([topic, { total, solved: s }]) => ({
            topic,
            total,
            solved: s,
            percentage: total > 0 ? Math.round((s / total) * 100) : 0,
        }))
            .sort((a, b) => a.percentage - b.percentage);
        const today = (0, dateUtils_1.startOfDay)(new Date());
        const todayActivity = activityLast365.find((a) => (0, dateUtils_1.startOfDay)(new Date(a.date)).getTime() === today.getTime());
        (0, apiResponse_1.sendSuccess)(res, {
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
    }
    catch (error) {
        console.error('Dashboard error:', error);
        (0, apiResponse_1.sendError)(res, 'Failed to load dashboard', 500);
    }
};
exports.getDashboard = getDashboard;
async function getPhaseProgress(userId) {
    const phases = ['PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4'];
    const results = await Promise.all(phases.map(async (phase) => {
        const [total, userProblems] = await Promise.all([
            prisma_1.prisma.problem.count({ where: { phase } }),
            prisma_1.prisma.userProblem.count({
                where: {
                    userId,
                    status: { in: ['SOLVED', 'REVISED', 'MASTERED'] },
                    problem: { phase },
                },
            }),
        ]);
        return {
            phase,
            total,
            solved: userProblems,
            percentage: total > 0 ? Math.round((userProblems / total) * 100) : 0,
        };
    }));
    return results;
}
const getHeatmap = async (req, res) => {
    try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 365;
        const activity = await prisma_1.prisma.dailyActivity.findMany({
            where: {
                userId,
                date: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
            },
            select: { date: true, count: true },
            orderBy: { date: 'asc' },
        });
        (0, apiResponse_1.sendSuccess)(res, activity);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch heatmap', 500);
    }
};
exports.getHeatmap = getHeatmap;
//# sourceMappingURL=dashboard.controller.js.map