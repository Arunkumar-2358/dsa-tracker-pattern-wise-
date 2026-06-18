"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserProblems = exports.trackClick = exports.updateStatus = exports.getUserProblem = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const dateUtils_1 = require("../utils/dateUtils");
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.ProblemStatus),
    timeTaken: zod_1.z.number().int().min(0).optional(),
    personalRating: zod_1.z.number().int().min(1).max(5).optional().nullable(),
    notes: zod_1.z.string().optional(),
});
const getUserProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.params;
        const userProblem = await prisma_1.prisma.userProblem.findUnique({
            where: { userId_problemId: { userId, problemId } },
            include: { problem: true },
        });
        (0, apiResponse_1.sendSuccess)(res, userProblem);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch user problem', 500);
    }
};
exports.getUserProblem = getUserProblem;
const updateStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.params;
        const parsed = updateStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const { status, timeTaken, personalRating } = parsed.data;
        const existing = await prisma_1.prisma.userProblem.findUnique({
            where: { userId_problemId: { userId, problemId } },
        });
        const now = new Date();
        const updateData = { status };
        if (timeTaken !== undefined)
            updateData.timeTaken = timeTaken;
        if (personalRating !== undefined)
            updateData.personalRating = personalRating;
        if (status === 'SOLVED' && !existing?.firstSolvedAt) {
            updateData.firstSolvedAt = now;
        }
        if (status === 'REVISED' || status === 'MASTERED') {
            updateData.lastRevisedAt = now;
            updateData.revisionCount = (existing?.revisionCount ?? 0) + 1;
        }
        const userProblem = await prisma_1.prisma.userProblem.upsert({
            where: { userId_problemId: { userId, problemId } },
            update: updateData,
            create: {
                userId,
                problemId,
                status,
                timeTaken: timeTaken ?? null,
                personalRating: personalRating ?? null,
                firstSolvedAt: status === 'SOLVED' ? now : null,
                lastRevisedAt: ['REVISED', 'MASTERED'].includes(status) ? now : null,
                revisionCount: ['REVISED', 'MASTERED'].includes(status) ? 1 : 0,
            },
        });
        // Update daily activity for heatmap
        if (status === 'SOLVED' || status === 'REVISED' || status === 'MASTERED') {
            const today = (0, dateUtils_1.startOfDay)(now);
            await prisma_1.prisma.dailyActivity.upsert({
                where: { userId_date: { userId, date: today } },
                update: { count: { increment: 1 } },
                create: { userId, date: today, count: 1 },
            });
            // Update streak
            await updateStreak(userId);
        }
        (0, apiResponse_1.sendSuccess)(res, userProblem, 'Status updated');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to update status', 500);
    }
};
exports.updateStatus = updateStatus;
const trackClick = async (req, res) => {
    try {
        const userId = req.user.id;
        const { problemId } = req.params;
        const userProblem = await prisma_1.prisma.userProblem.upsert({
            where: { userId_problemId: { userId, problemId } },
            update: {
                clickCount: { increment: 1 },
                lastOpenedAt: new Date(),
            },
            create: {
                userId,
                problemId,
                status: 'NOT_STARTED',
                clickCount: 1,
                lastOpenedAt: new Date(),
            },
        });
        (0, apiResponse_1.sendSuccess)(res, userProblem);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to track click', 500);
    }
};
exports.trackClick = trackClick;
const getAllUserProblems = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProblems = await prisma_1.prisma.userProblem.findMany({
            where: { userId },
            include: { problem: true },
            orderBy: { updatedAt: 'desc' },
        });
        (0, apiResponse_1.sendSuccess)(res, userProblems);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch user problems', 500);
    }
};
exports.getAllUserProblems = getAllUserProblems;
async function updateStreak(userId) {
    const today = (0, dateUtils_1.startOfDay)(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const [todayActivity, yesterdayActivity] = await Promise.all([
        prisma_1.prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: today } } }),
        prisma_1.prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
    ]);
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId }, select: { streak: true, lastActiveAt: true } });
    if (!user)
        return;
    const lastActiveDay = (0, dateUtils_1.startOfDay)(user.lastActiveAt);
    const wasActiveYesterday = lastActiveDay.getTime() === yesterday.getTime();
    const wasActiveToday = lastActiveDay.getTime() === today.getTime();
    let newStreak = user.streak;
    if (todayActivity && !wasActiveToday) {
        newStreak = wasActiveYesterday ? user.streak + 1 : 1;
    }
    void yesterdayActivity; // referenced to avoid unused warning
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { streak: newStreak, lastActiveAt: new Date() },
    });
}
//# sourceMappingURL=userProblem.controller.js.map