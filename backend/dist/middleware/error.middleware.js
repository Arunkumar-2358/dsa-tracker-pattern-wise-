"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err.message);
    // Prisma unique constraint violation
    if (err.code === 'P2002') {
        res.status(409).json({ success: false, error: 'Resource already exists' });
        return;
    }
    // Prisma record not found
    if (err.code === 'P2025') {
        res.status(404).json({ success: false, error: 'Resource not found' });
        return;
    }
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;
    res.status(statusCode).json({ success: false, error: message });
};
exports.errorHandler = errorHandler;
const notFound = (_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map