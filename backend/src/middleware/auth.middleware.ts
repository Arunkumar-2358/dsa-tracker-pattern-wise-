import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { prisma } from '../utils/prisma';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      avatar: string | null;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies?.token) {
      token = req.cookies.token as string;
    }

    if (!token) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    let payload: JwtPayload;
    try {
      payload = verifyToken(token);
    } catch {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, avatar: true },
    });

    if (!user) {
      sendError(res, 'User not found', 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError(res, 'Authentication failed', 401);
  }
};

export const requireAuth: RequestHandler = authenticate;
