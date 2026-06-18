import { Request, Response } from 'express';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';
import { Difficulty, Phase } from '@prisma/client';
import { z } from 'zod';

const createProblemSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  difficulty: z.nativeEnum(Difficulty),
  topic: z.string().min(1).max(100),
  subtopic: z.string().max(100).optional(),
  companyTags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  solutionLink: z.string().url().optional().or(z.literal('')),
  youtubeLink: z.string().url().optional().or(z.literal('')),
  phase: z.nativeEnum(Phase),
  order: z.number().int().min(0).optional(),
});

const updateProblemSchema = createProblemSchema.partial();

export const getProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (req.query.topic) where.topic = req.query.topic as string;
    if (req.query.difficulty) where.difficulty = req.query.difficulty as Difficulty;
    if (req.query.phase) where.phase = req.query.phase as Phase;
    if (req.query.search) {
      where.title = { contains: req.query.search as string, mode: 'insensitive' };
    }
    if (req.query.company) {
      where.companyTags = { has: req.query.company as string };
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        orderBy: [{ topic: 'asc' }, { order: 'asc' }],
        skip,
        take: limit,
        include: req.user
          ? {
              userProblems: {
                where: { userId: req.user.id },
                select: { status: true, personalRating: true, revisionCount: true, firstSolvedAt: true },
              },
            }
          : undefined,
      }),
      prisma.problem.count({ where }),
    ]);

    const enriched = problems.map((p) => ({
      ...p,
      userProblem: 'userProblems' in p
        ? (p as typeof p & { userProblems: unknown[] }).userProblems[0] ?? null
        : null,
      userProblems: undefined,
    }));

    sendPaginated(res, enriched, total, page, limit);
  } catch (error) {
    sendError(res, 'Failed to fetch problems', 500);
  }
};

export const getProblemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: req.user
        ? {
            userProblems: {
              where: { userId: req.user.id },
            },
          }
        : undefined,
    });

    if (!problem) {
      sendError(res, 'Problem not found', 404);
      return;
    }

    const result = {
      ...problem,
      userProblem: 'userProblems' in problem
        ? (problem as typeof problem & { userProblems: unknown[] }).userProblems[0] ?? null
        : null,
      userProblems: undefined,
    };

    sendSuccess(res, result);
  } catch {
    sendError(res, 'Failed to fetch problem', 500);
  }
};

export const createProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createProblemSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const data = parsed.data;
    const problem = await prisma.problem.create({
      data: {
        ...data,
        solutionLink: data.solutionLink || null,
        youtubeLink: data.youtubeLink || null,
      },
    });

    sendSuccess(res, problem, 'Problem created', 201);
  } catch {
    sendError(res, 'Failed to create problem', 500);
  }
};

export const updateProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = updateProblemSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const data = parsed.data;
    const problem = await prisma.problem.update({
      where: { id: req.params.id },
      data: {
        ...data,
        solutionLink: data.solutionLink || null,
        youtubeLink: data.youtubeLink || null,
      },
    });

    sendSuccess(res, problem, 'Problem updated');
  } catch {
    sendError(res, 'Failed to update problem', 500);
  }
};

export const deleteProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.problem.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Problem deleted');
  } catch {
    sendError(res, 'Failed to delete problem', 500);
  }
};

export const getTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await prisma.problem.findMany({
      select: { topic: true, phase: true },
      distinct: ['topic'],
      orderBy: { topic: 'asc' },
    });
    sendSuccess(res, topics);
  } catch {
    sendError(res, 'Failed to fetch topics', 500);
  }
};

export const getCompanies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const problems = await prisma.problem.findMany({
      select: { companyTags: true },
    });

    const companies = [...new Set(problems.flatMap((p) => p.companyTags))].sort();
    sendSuccess(res, companies);
  } catch {
    sendError(res, 'Failed to fetch companies', 500);
  }
};
