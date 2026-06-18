import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';
import { ProblemStatus } from '@prisma/client';
import { z } from 'zod';
import { startOfDay } from '../utils/dateUtils';

const updateStatusSchema = z.object({
  status: z.nativeEnum(ProblemStatus),
  timeTaken: z.number().int().min(0).optional(),
  personalRating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().optional(),
});

export const getUserProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { problemId } = req.params;

    const userProblem = await prisma.userProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
      include: { problem: true },
    });

    sendSuccess(res, userProblem);
  } catch {
    sendError(res, 'Failed to fetch user problem', 500);
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { problemId } = req.params;

    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const { status, timeTaken, personalRating } = parsed.data;

    const existing = await prisma.userProblem.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const now = new Date();
    const updateData: Record<string, unknown> = { status };

    if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
    if (personalRating !== undefined) updateData.personalRating = personalRating;

    if (status === 'SOLVED' && !existing?.firstSolvedAt) {
      updateData.firstSolvedAt = now;
    }

    if (status === 'REVISED' || status === 'MASTERED') {
      updateData.lastRevisedAt = now;
      updateData.revisionCount = (existing?.revisionCount ?? 0) + 1;
    }

    const userProblem = await prisma.userProblem.upsert({
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
      const today = startOfDay(now);
      await prisma.dailyActivity.upsert({
        where: { userId_date: { userId, date: today } },
        update: { count: { increment: 1 } },
        create: { userId, date: today, count: 1 },
      });

      // Update streak
      await updateStreak(userId);
    }

    sendSuccess(res, userProblem, 'Status updated');
  } catch {
    sendError(res, 'Failed to update status', 500);
  }
};

export const trackClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { problemId } = req.params;

    const userProblem = await prisma.userProblem.upsert({
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

    sendSuccess(res, userProblem);
  } catch {
    sendError(res, 'Failed to track click', 500);
  }
};

export const getAllUserProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const userProblems = await prisma.userProblem.findMany({
      where: { userId },
      include: { problem: true },
      orderBy: { updatedAt: 'desc' },
    });

    sendSuccess(res, userProblems);
  } catch {
    sendError(res, 'Failed to fetch user problems', 500);
  }
};

async function updateStreak(userId: string): Promise<void> {
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [todayActivity, yesterdayActivity] = await Promise.all([
    prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.dailyActivity.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
  ]);

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { streak: true, lastActiveAt: true } });
  if (!user) return;

  const lastActiveDay = startOfDay(user.lastActiveAt);
  const wasActiveYesterday = lastActiveDay.getTime() === yesterday.getTime();
  const wasActiveToday = lastActiveDay.getTime() === today.getTime();

  let newStreak = user.streak;

  if (todayActivity && !wasActiveToday) {
    newStreak = wasActiveYesterday ? user.streak + 1 : 1;
  }

  void yesterdayActivity; // referenced to avoid unused warning

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastActiveAt: new Date() },
  });
}
