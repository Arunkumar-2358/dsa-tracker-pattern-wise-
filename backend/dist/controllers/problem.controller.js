"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = exports.getTopics = exports.deleteProblem = exports.updateProblem = exports.createProblem = exports.getProblemById = exports.getProblems = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createProblemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    url: zod_1.z.string().url(),
    difficulty: zod_1.z.nativeEnum(client_1.Difficulty),
    topic: zod_1.z.string().min(1).max(100),
    subtopic: zod_1.z.string().max(100).optional(),
    companyTags: zod_1.z.array(zod_1.z.string()).default([]),
    notes: zod_1.z.string().optional(),
    solutionLink: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    youtubeLink: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    phase: zod_1.z.nativeEnum(client_1.Phase),
    order: zod_1.z.number().int().min(0).optional(),
});
const updateProblemSchema = createProblemSchema.partial();
const getProblems = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;
        const where = {};
        if (req.query.topic)
            where.topic = req.query.topic;
        if (req.query.difficulty)
            where.difficulty = req.query.difficulty;
        if (req.query.phase)
            where.phase = req.query.phase;
        if (req.query.search) {
            where.title = { contains: req.query.search, mode: 'insensitive' };
        }
        if (req.query.company) {
            where.companyTags = { has: req.query.company };
        }
        const [problems, total] = await Promise.all([
            prisma_1.prisma.problem.findMany({
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
            prisma_1.prisma.problem.count({ where }),
        ]);
        const enriched = problems.map((p) => ({
            ...p,
            userProblem: 'userProblems' in p
                ? p.userProblems[0] ?? null
                : null,
            userProblems: undefined,
        }));
        (0, apiResponse_1.sendPaginated)(res, enriched, total, page, limit);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch problems', 500);
    }
};
exports.getProblems = getProblems;
const getProblemById = async (req, res) => {
    try {
        const problem = await prisma_1.prisma.problem.findUnique({
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
            (0, apiResponse_1.sendError)(res, 'Problem not found', 404);
            return;
        }
        const result = {
            ...problem,
            userProblem: 'userProblems' in problem
                ? problem.userProblems[0] ?? null
                : null,
            userProblems: undefined,
        };
        (0, apiResponse_1.sendSuccess)(res, result);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch problem', 500);
    }
};
exports.getProblemById = getProblemById;
const createProblem = async (req, res) => {
    try {
        const parsed = createProblemSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const data = parsed.data;
        const problem = await prisma_1.prisma.problem.create({
            data: {
                ...data,
                solutionLink: data.solutionLink || null,
                youtubeLink: data.youtubeLink || null,
            },
        });
        (0, apiResponse_1.sendSuccess)(res, problem, 'Problem created', 201);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to create problem', 500);
    }
};
exports.createProblem = createProblem;
const updateProblem = async (req, res) => {
    try {
        const parsed = updateProblemSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const data = parsed.data;
        const problem = await prisma_1.prisma.problem.update({
            where: { id: req.params.id },
            data: {
                ...data,
                solutionLink: data.solutionLink || null,
                youtubeLink: data.youtubeLink || null,
            },
        });
        (0, apiResponse_1.sendSuccess)(res, problem, 'Problem updated');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to update problem', 500);
    }
};
exports.updateProblem = updateProblem;
const deleteProblem = async (req, res) => {
    try {
        await prisma_1.prisma.problem.delete({ where: { id: req.params.id } });
        (0, apiResponse_1.sendSuccess)(res, null, 'Problem deleted');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to delete problem', 500);
    }
};
exports.deleteProblem = deleteProblem;
const getTopics = async (_req, res) => {
    try {
        const topics = await prisma_1.prisma.problem.findMany({
            select: { topic: true, phase: true },
            distinct: ['topic'],
            orderBy: { topic: 'asc' },
        });
        (0, apiResponse_1.sendSuccess)(res, topics);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch topics', 500);
    }
};
exports.getTopics = getTopics;
const getCompanies = async (_req, res) => {
    try {
        const problems = await prisma_1.prisma.problem.findMany({
            select: { companyTags: true },
        });
        const companies = [...new Set(problems.flatMap((p) => p.companyTags))].sort();
        (0, apiResponse_1.sendSuccess)(res, companies);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch companies', 500);
    }
};
exports.getCompanies = getCompanies;
//# sourceMappingURL=problem.controller.js.map