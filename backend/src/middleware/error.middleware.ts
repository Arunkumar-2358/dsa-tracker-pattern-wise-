import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
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
  const message =
    statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({ success: false, error: message });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: 'Route not found' });
};
