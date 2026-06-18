"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../utils/prisma");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            (0, apiResponse_1.sendError)(res, 'Authentication required', 401);
            return;
        }
        let payload;
        try {
            payload = (0, jwt_1.verifyToken)(token);
        }
        catch {
            (0, apiResponse_1.sendError)(res, 'Invalid or expired token', 401);
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true, avatar: true },
        });
        if (!user) {
            (0, apiResponse_1.sendError)(res, 'User not found', 401);
            return;
        }
        req.user = user;
        next();
    }
    catch {
        (0, apiResponse_1.sendError)(res, 'Authentication failed', 401);
    }
};
exports.authenticate = authenticate;
exports.requireAuth = exports.authenticate;
//# sourceMappingURL=auth.middleware.js.map