import { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { env } from '../config/env';
import { prisma } from '../utils/prisma';
import { getFirebaseAdmin } from '../config/firebase';
import { z } from 'zod';

const firebaseAuthSchema = z.object({
  idToken: z.string().min(10),
  mode: z.enum(['signup', 'signin']),
  name: z.string().trim().min(1).max(60).optional(),
});

function setAuthCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * Exchange a Firebase phone-auth ID token for an app session.
 * The OTP itself is sent and verified by Firebase in the browser; here we only
 * verify the resulting ID token, then create (signup) or fetch (signin) the user.
 */
export const firebaseAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = firebaseAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors.map((e) => e.message).join(', '));
      return;
    }

    const { idToken, mode, name } = parsed.data;

    let decoded;
    try {
      // Guard against firebase-admin hanging (e.g. cert fetch) which would
      // otherwise blow the serverless timeout and surface as a CORS/network error.
      const verifyPromise = getFirebaseAdmin().auth().verifyIdToken(idToken);
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('verifyIdToken timed out after 8s')), 8000)
      );
      decoded = await Promise.race([verifyPromise, timeout]);
    } catch (verifyErr) {
      const detail = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
      sendError(res, `Verification failed: ${detail}`, 401);
      return;
    }

    const phone = decoded.phone_number;
    const uid = decoded.uid;
    if (!phone) {
      sendError(res, 'Phone number missing from verification', 400);
      return;
    }

    const existing = await prisma.user.findUnique({ where: { phone } });

    if (mode === 'signup') {
      if (existing) {
        sendError(res, 'An account with this number already exists. Please sign in.', 409);
        return;
      }
      if (!name) {
        sendError(res, 'Name is required to create an account');
        return;
      }

      const user = await prisma.user.create({
        data: {
          phone,
          googleId: `firebase:${uid}`,
          email: `${phone.replace(/\D/g, '')}@phone.local`,
          name,
        },
        select: { id: true, email: true, name: true, avatar: true, streak: true },
      });

      const token = signToken({ userId: user.id, email: user.email });
      setAuthCookie(res, token);
      sendSuccess(res, { token, user }, 'Account created', 201);
      return;
    }

    // mode === 'signin'
    if (!existing) {
      sendError(res, 'No account found for this number. Please sign up first.', 404);
      return;
    }

    const user = await prisma.user.update({
      where: { id: existing.id },
      data: { lastActiveAt: new Date() },
      select: { id: true, email: true, name: true, avatar: true, streak: true },
    });

    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);
    sendSuccess(res, { token, user }, 'Logged in');
  } catch (error) {
    console.error('firebaseAuth failed:', error);
    // Temporarily surface the real reason to speed up debugging.
    const detail = error instanceof Error ? error.message : String(error);
    sendError(res, `Login failed: ${detail}`, 500);
  }
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
