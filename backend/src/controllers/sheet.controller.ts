import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';
import { z } from 'zod';

const createSheetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const addProblemSchema = z.object({
  problemId: z.string().min(1),
  order: z.number().int().min(0).optional(),
});

export const getSheets = async (req: Request, res: Response): Promise<void> => {
  try {
    const sheets = await prisma.sheet.findMany({
      where: { userId: req.user!.id },
      include: {
        sheetProblems: {
          include: {
            problem: {
              include: {
                userProblems: {
                  where: { userId: req.user!.id },
                  select: { status: true },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const enriched = sheets.map((sheet) => ({
      ...sheet,
      problemCount: sheet.sheetProblems.length,
      solvedCount: sheet.sheetProblems.filter((sp) => {
        const up = sp.problem.userProblems[0];
        return up && ['SOLVED', 'REVISED', 'MASTERED'].includes(up.status);
      }).length,
    }));

    sendSuccess(res, enriched);
  } catch {
    sendError(res, 'Failed to fetch sheets', 500);
  }
};

export const getSheetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const sheet = await prisma.sheet.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        sheetProblems: {
          include: {
            problem: {
              include: {
                userProblems: {
                  where: { userId: req.user!.id },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!sheet) {
      sendError(res, 'Sheet not found', 404);
      return;
    }

    sendSuccess(res, sheet);
  } catch {
    sendError(res, 'Failed to fetch sheet', 500);
  }
};

export const createSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createSheetSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const sheet = await prisma.sheet.create({
      data: {
        ...parsed.data,
        userId: req.user!.id,
      },
    });

    sendSuccess(res, sheet, 'Sheet created', 201);
  } catch {
    sendError(res, 'Failed to create sheet', 500);
  }
};

export const updateSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createSheetSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const sheet = await prisma.sheet.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: parsed.data,
    });

    if (sheet.count === 0) {
      sendError(res, 'Sheet not found', 404);
      return;
    }

    sendSuccess(res, null, 'Sheet updated');
  } catch {
    sendError(res, 'Failed to update sheet', 500);
  }
};

export const deleteSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.sheet.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (result.count === 0) {
      sendError(res, 'Sheet not found', 404);
      return;
    }

    sendSuccess(res, null, 'Sheet deleted');
  } catch {
    sendError(res, 'Failed to delete sheet', 500);
  }
};

export const addProblemToSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = addProblemSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const sheet = await prisma.sheet.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!sheet) {
      sendError(res, 'Sheet not found', 404);
      return;
    }

    const { problemId, order } = parsed.data;

    const maxOrder = await prisma.sheetProblem.aggregate({
      where: { sheetId: sheet.id },
      _max: { order: true },
    });

    const sheetProblem = await prisma.sheetProblem.create({
      data: {
        sheetId: sheet.id,
        problemId,
        order: order ?? (maxOrder._max.order ?? -1) + 1,
      },
    });

    sendSuccess(res, sheetProblem, 'Problem added to sheet', 201);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      sendError(res, 'Problem already in sheet', 409);
      return;
    }
    sendError(res, 'Failed to add problem to sheet', 500);
  }
};

export const removeProblemFromSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const sheet = await prisma.sheet.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!sheet) {
      sendError(res, 'Sheet not found', 404);
      return;
    }

    await prisma.sheetProblem.deleteMany({
      where: { sheetId: sheet.id, problemId: req.params.problemId },
    });

    sendSuccess(res, null, 'Problem removed from sheet');
  } catch {
    sendError(res, 'Failed to remove problem from sheet', 500);
  }
};
