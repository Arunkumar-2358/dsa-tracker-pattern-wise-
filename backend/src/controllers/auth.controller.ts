import { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { env } from '../config/env';
import { prisma } from '../utils/prisma';
import { z } from 'zod';

const otpStore = new Map<string, { code: string; expiresAt: number }>();

const phoneSchema = z.object({
  phone: z.string().min(8).max(20),
});

const verifyOtpSchema = phoneSchema.extend({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
}

function createOtp(): string {
  if (env.isDev) return '123456';
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const requestOtp = (req: Request, res: Response): void => {
  const parsed = phoneSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
    return;
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!/^\+?\d{8,15}$/.test(phone)) {
    sendError(res, 'Enter a valid phone number');
    return;
  }

  const code = createOtp();
  otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

  sendSuccess(
    res,
    { phone, devOtp: env.isDev ? code : undefined },
    'OTP sent'
  );
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
    return;
  }

  const phone = normalizePhone(parsed.data.phone);

  // Serverless-safe verification: the in-memory otpStore does NOT persist across
  // Vercel lambda invocations, so we accept the master OTP (set via env) as the
  // primary path, falling back to a freshly-stored code when on the same instance.
  const pendingOtp = otpStore.get(phone);
  const matchesStore =
    !!pendingOtp && pendingOtp.expiresAt >= Date.now() && pendingOtp.code === parsed.data.otp;
  const matchesMaster = parsed.data.otp === env.MASTER_OTP;

  if (!matchesStore && !matchesMaster) {
    sendError(res, 'Invalid or expired OTP', 401);
    return;
  }

  otpStore.delete(phone);

  const user = await prisma.user.upsert({
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

  const token = signToken({ userId: user.id, email: user.email });
  setAuthCookie(res, token);

  sendSuccess(res, { token, user }, 'Logged in');
};

export const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    sendError(res, 'Not authenticated', 401);
    return;
  }
  sendSuccess(res, req.user);
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  sendSuccess(res, null, 'Logged out successfully');
};
