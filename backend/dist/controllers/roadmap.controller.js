"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNode = exports.addNode = exports.deleteRoadmap = exports.updateRoadmap = exports.createRoadmap = exports.getRoadmapById = exports.getRoadmaps = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
const createRoadmapSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    nodes: zod_1.z
        .array(zod_1.z.object({
        topic: zod_1.z.string().min(1).max(100),
        order: zod_1.z.number().int().min(0),
        parentId: zod_1.z.string().optional().nullable(),
    }))
        .optional(),
});
const addNodeSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1).max(100),
    order: zod_1.z.number().int().min(0).optional(),
    parentId: zod_1.z.string().optional().nullable(),
});
const getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await prisma_1.prisma.roadmap.findMany({
            where: { userId: req.user.id },
            include: { nodes: { orderBy: { order: 'asc' } } },
            orderBy: { createdAt: 'asc' },
        });
        (0, apiResponse_1.sendSuccess)(res, roadmaps);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch roadmaps', 500);
    }
};
exports.getRoadmaps = getRoadmaps;
const getRoadmapById = async (req, res) => {
    try {
        const roadmap = await prisma_1.prisma.roadmap.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: { nodes: { orderBy: { order: 'asc' } } },
        });
        if (!roadmap) {
            (0, apiResponse_1.sendError)(res, 'Roadmap not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, roadmap);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch roadmap', 500);
    }
};
exports.getRoadmapById = getRoadmapById;
const createRoadmap = async (req, res) => {
    try {
        const parsed = createRoadmapSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const { name, description, nodes } = parsed.data;
        const roadmap = await prisma_1.prisma.roadmap.create({
            data: {
                name,
                description,
                userId: req.user.id,
                nodes: nodes
                    ? { createMany: { data: nodes.map((n) => ({ ...n, parentId: n.parentId ?? null })) } }
                    : undefined,
            },
            include: { nodes: { orderBy: { order: 'asc' } } },
        });
        (0, apiResponse_1.sendSuccess)(res, roadmap, 'Roadmap created', 201);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to create roadmap', 500);
    }
};
exports.createRoadmap = createRoadmap;
const updateRoadmap = async (req, res) => {
    try {
        const parsed = zod_1.z
            .object({ name: zod_1.z.string().min(1).max(100).optional(), description: zod_1.z.string().max(500).optional() })
            .safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const result = await prisma_1.prisma.roadmap.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: parsed.data,
        });
        if (result.count === 0) {
            (0, apiResponse_1.sendError)(res, 'Roadmap not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, null, 'Roadmap updated');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to update roadmap', 500);
    }
};
exports.updateRoadmap = updateRoadmap;
const deleteRoadmap = async (req, res) => {
    try {
        const result = await prisma_1.prisma.roadmap.deleteMany({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (result.count === 0) {
            (0, apiResponse_1.sendError)(res, 'Roadmap not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, null, 'Roadmap deleted');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to delete roadmap', 500);
    }
};
exports.deleteRoadmap = deleteRoadmap;
const addNode = async (req, res) => {
    try {
        const roadmap = await prisma_1.prisma.roadmap.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!roadmap) {
            (0, apiResponse_1.sendError)(res, 'Roadmap not found', 404);
            return;
        }
        const parsed = addNodeSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const maxOrder = await prisma_1.prisma.roadmapNode.aggregate({
            where: { roadmapId: roadmap.id },
            _max: { order: true },
        });
        const node = await prisma_1.prisma.roadmapNode.create({
            data: {
                roadmapId: roadmap.id,
                topic: parsed.data.topic,
                order: parsed.data.order ?? (maxOrder._max.order ?? -1) + 1,
                parentId: parsed.data.parentId ?? null,
            },
        });
        (0, apiResponse_1.sendSuccess)(res, node, 'Node added', 201);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to add node', 500);
    }
};
exports.addNode = addNode;
const deleteNode = async (req, res) => {
    try {
        const roadmap = await prisma_1.prisma.roadmap.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!roadmap) {
            (0, apiResponse_1.sendError)(res, 'Roadmap not found', 404);
            return;
        }
        await prisma_1.prisma.roadmapNode.delete({ where: { id: req.params.nodeId } });
        (0, apiResponse_1.sendSuccess)(res, null, 'Node deleted');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to delete node', 500);
    }
};
exports.deleteNode = deleteNode;
//# sourceMappingURL=roadmap.controller.js.map