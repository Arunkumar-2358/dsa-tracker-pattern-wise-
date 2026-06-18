"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.verifyOtp = exports.requestOtp = void 0;
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
const env_1 = require("../config/env");
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
const otpStore = new Map();
const phoneSchema = zod_1.z.object({
    phone: zod_1.z.string().min(8).max(20),
});
const verifyOtpSchema = phoneSchema.extend({
    otp: zod_1.z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});
function normalizePhone(phone) {
    return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
}
function createOtp() {
    if (env_1.env.isDev)
        return '123456';
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        secure: env_1.env.isProd,
        sameSite: env_1.env.isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
const requestOtp = (req, res) => {
    const parsed = phoneSchema.safeParse(req.body);
    if (!parsed.success) {
        (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
        return;
    }
    const phone = normalizePhone(parsed.data.phone);
    if (!/^\+?\d{8,15}$/.test(phone)) {
        (0, apiResponse_1.sendError)(res, 'Enter a valid phone number');
        return;
    }
    const code = createOtp();
    otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    (0, apiResponse_1.sendSuccess)(res, { phone, devOtp: env_1.env.isDev ? code : undefined }, 'OTP sent');
};
exports.requestOtp = requestOtp;
const verifyOtp = async (req, res) => {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        (0, apiResponse_1.sendError)(res, parsed.error.errors.map((e) => e.message).join(', '));
        return;
    }
    const phone = normalizePhone(parsed.data.phone);
    const pendingOtp = otpStore.get(phone);
    if (!pendingOtp || pendingOtp.expiresAt < Date.now()) {
        otpStore.delete(phone);
        (0, apiResponse_1.sendError)(res, 'OTP expired. Request a new code.', 401);
        return;
    }
    if (pendingOtp.code !== parsed.data.otp) {
        (0, apiResponse_1.sendError)(res, 'Invalid OTP', 401);
        return;
    }
    otpStore.delete(phone);
    const user = await prisma_1.prisma.user.upsert({
        where: { googleId: `phone:${phone}` },
        update: {
            lastActiveAt: new Date(),
        },
        create: {
            googleId: `phone:${phone}`,
            email: `${phone.replace(/\D/g, '')}@phone.local`,
            name: 'Arun',
            avatar: null,
        },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            streak: true,
        },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email });
    setAuthCookie(res, token);
    (0, apiResponse_1.sendSuccess)(res, { token, user }, 'Logged in');
};
exports.verifyOtp = verifyOtp;
const getMe = (req, res) => {
    if (!req.user) {
        (0, apiResponse_1.sendError)(res, 'Not authenticated', 401);
        return;
    }
    (0, apiResponse_1.sendSuccess)(res, req.user);
};
exports.getMe = getMe;
const logout = (_req, res) => {
    res.clearCookie('token');
    (0, apiResponse_1.sendSuccess)(res, null, 'Logged out successfully');
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map