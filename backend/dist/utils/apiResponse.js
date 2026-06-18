"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendPaginated = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200) => {
    const response = { success: true, data, message };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendPaginated = (res, data, total, page, limit) => {
    const response = {
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
    return res.status(200).json(response);
};
exports.sendPaginated = sendPaginated;
const sendError = (res, message, statusCode = 400) => {
    const response = { success: false, error: message };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=apiResponse.js.map