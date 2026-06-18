"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProblemFromSheet = exports.addProblemToSheet = exports.deleteSheet = exports.updateSheet = exports.createSheet = exports.getSheetById = exports.getSheets = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
const createSheetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
});
const addProblemSchema = zod_1.z.object({
    problemId: zod_1.z.string().min(1),
    order: zod_1.z.number().int().min(0).optional(),
});
const getSheets = async (req, res) => {
    try {
        const sheets = await prisma_1.prisma.sheet.findMany({
            where: { userId: req.user.id },
            include: {
                sheetProblems: {
                    include: {
                        problem: {
                            include: {
                                userProblems: {
                                    where: { userId: req.user.id },
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
        (0, apiResponse_1.sendSuccess)(res, enriched);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch sheets', 500);
    }
};
exports.getSheets = getSheets;
const getSheetById = async (req, res) => {
    try {
        const sheet = await prisma_1.prisma.sheet.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: {
                sheetProblems: {
                    include: {
                        problem: {
                            include: {
                                userProblems: {
                                    where: { userId: req.user.id },
                                },
                            },
                        },
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!sheet) {
            (0, apiResponse_1.sendError)(res, 'Sheet not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, sheet);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch sheet', 500);
    }
};
exports.getSheetById = getSheetById;
const createSheet = async (req, res) => {
    try {
        const parsed = createSheetSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const sheet = await prisma_1.prisma.sheet.create({
            data: {
                ...parsed.data,
                userId: req.user.id,
            },
        });
        (0, apiResponse_1.sendSuccess)(res, sheet, 'Sheet created', 201);
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to create sheet', 500);
    }
};
exports.createSheet = createSheet;
const updateSheet = async (req, res) => {
    try {
        const parsed = createSheetSchema.partial().safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const sheet = await prisma_1.prisma.sheet.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: parsed.data,
        });
        if (sheet.count === 0) {
            (0, apiResponse_1.sendError)(res, 'Sheet not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, null, 'Sheet updated');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to update sheet', 500);
    }
};
exports.updateSheet = updateSheet;
const deleteSheet = async (req, res) => {
    try {
        const result = await prisma_1.prisma.sheet.deleteMany({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (result.count === 0) {
            (0, apiResponse_1.sendError)(res, 'Sheet not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, null, 'Sheet deleted');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to delete sheet', 500);
    }
};
exports.deleteSheet = deleteSheet;
const addProblemToSheet = async (req, res) => {
    try {
        const parsed = addProblemSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
            return;
        }
        const sheet = await prisma_1.prisma.sheet.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!sheet) {
            (0, apiResponse_1.sendError)(res, 'Sheet not found', 404);
            return;
        }
        const { problemId, order } = parsed.data;
        const maxOrder = await prisma_1.prisma.sheetProblem.aggregate({
            where: { sheetId: sheet.id },
            _max: { order: true },
        });
        const sheetProblem = await prisma_1.prisma.sheetProblem.create({
            data: {
                sheetId: sheet.id,
                problemId,
                order: order ?? (maxOrder._max.order ?? -1) + 1,
            },
        });
        (0, apiResponse_1.sendSuccess)(res, sheetProblem, 'Problem added to sheet', 201);
    }
    catch (err) {
        if (err.code === 'P2002') {
            (0, apiResponse_1.sendError)(res, 'Problem already in sheet', 409);
            return;
        }
        (0, apiResponse_1.sendError)(res, 'Failed to add problem to sheet', 500);
    }
};
exports.addProblemToSheet = addProblemToSheet;
const removeProblemFromSheet = async (req, res) => {
    try {
        const sheet = await prisma_1.prisma.sheet.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!sheet) {
            (0, apiResponse_1.sendError)(res, 'Sheet not found', 404);
            return;
        }
        await prisma_1.prisma.sheetProblem.deleteMany({
            where: { sheetId: sheet.id, problemId: req.params.problemId },
        });
        (0, apiResponse_1.sendSuccess)(res, null, 'Problem removed from sheet');
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Failed to remove problem from sheet', 500);
    }
};
exports.removeProblemFromSheet = removeProblemFromSheet;
//# sourceMappingURL=sheet.controller.js.map