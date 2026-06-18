import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';
import { z } from 'zod';

const createRoadmapSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  nodes: z
    .array(
      z.object({
        topic: z.string().min(1).max(100),
        order: z.number().int().min(0),
        parentId: z.string().optional().nullable(),
      })
    )
    .optional(),
});

const addNodeSchema = z.object({
  topic: z.string().min(1).max(100),
  order: z.number().int().min(0).optional(),
  parentId: z.string().optional().nullable(),
});

export const getRoadmaps = async (req: Request, res: Response): Promise<void> => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: req.user!.id },
      include: { nodes: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    sendSuccess(res, roadmaps);
  } catch {
    sendError(res, 'Failed to fetch roadmaps', 500);
  }
};

export const getRoadmapById = async (req: Request, res: Response): Promise<void> => {
  try {
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { nodes: { orderBy: { order: 'asc' } } },
    });

    if (!roadmap) {
      sendError(res, 'Roadmap not found', 404);
      return;
    }

    sendSuccess(res, roadmap);
  } catch {
    sendError(res, 'Failed to fetch roadmap', 500);
  }
};

export const createRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createRoadmapSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const { name, description, nodes } = parsed.data;

    const roadmap = await prisma.roadmap.create({
      data: {
        name,
        description,
        userId: req.user!.id,
        nodes: nodes
          ? { createMany: { data: nodes.map((n) => ({ ...n, parentId: n.parentId ?? null })) } }
          : undefined,
      },
      include: { nodes: { orderBy: { order: 'asc' } } },
    });

    sendSuccess(res, roadmap, 'Roadmap created', 201);
  } catch {
    sendError(res, 'Failed to create roadmap', 500);
  }
};

export const updateRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = z
      .object({ name: z.string().min(1).max(100).optional(), description: z.string().max(500).optional() })
      .safeParse(req.body);

    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const result = await prisma.roadmap.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: parsed.data,
    });

    if (result.count === 0) {
      sendError(res, 'Roadmap not found', 404);
      return;
    }

    sendSuccess(res, null, 'Roadmap updated');
  } catch {
    sendError(res, 'Failed to update roadmap', 500);
  }
};

export const deleteRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.roadmap.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (result.count === 0) {
      sendError(res, 'Roadmap not found', 404);
      return;
    }

    sendSuccess(res, null, 'Roadmap deleted');
  } catch {
    sendError(res, 'Failed to delete roadmap', 500);
  }
};

export const addNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!roadmap) {
      sendError(res, 'Roadmap not found', 404);
      return;
    }

    const parsed = addNodeSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const maxOrder = await prisma.roadmapNode.aggregate({
      where: { roadmapId: roadmap.id },
      _max: { order: true },
    });

    const node = await prisma.roadmapNode.create({
      data: {
        roadmapId: roadmap.id,
        topic: parsed.data.topic,
        order: parsed.data.order ?? (maxOrder._max.order ?? -1) + 1,
        parentId: parsed.data.parentId ?? null,
      },
    });

    sendSuccess(res, node, 'Node added', 201);
  } catch {
    sendError(res, 'Failed to add node', 500);
  }
};

export const deleteNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const roadmap = await prisma.roadmap.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!roadmap) {
      sendError(res, 'Roadmap not found', 404);
      return;
    }

    await prisma.roadmapNode.delete({ where: { id: req.params.nodeId } });
    sendSuccess(res, null, 'Node deleted');
  } catch {
    sendError(res, 'Failed to delete node', 500);
  }
};
