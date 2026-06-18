import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';

import authRoutes from './routes/auth.routes';
import problemRoutes from './routes/problem.routes';
import userProblemRoutes from './routes/userProblem.routes';
import roadmapRoutes from './routes/roadmap.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.isDev) {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TEMPORARY: verify Prisma can actually reach the DB from the serverless fn.
app.get('/api/db-check', async (_req, res) => {
  const start = Date.now();
  try {
    const { prisma } = await import('./utils/prisma');
    const users = await prisma.user.count();
    res.json({ ok: true, users, ms: Date.now() - start });
  } catch (error) {
    res.json({
      ok: false,
      ms: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// TEMPORARY: exercise the exact Prisma write path firebaseAuth uses.
app.get('/api/db-write-check', async (_req, res) => {
  const start = Date.now();
  const phone = '+19990000001';
  try {
    const { prisma } = await import('./utils/prisma');
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) await prisma.user.delete({ where: { id: existing.id } });
    const created = await prisma.user.create({
      data: {
        phone,
        googleId: `debug:${Date.now()}`,
        email: `debug${Date.now()}@phone.local`,
        name: 'debug',
      },
      select: { id: true },
    });
    await prisma.user.delete({ where: { id: created.id } });
    res.json({ ok: true, ms: Date.now() - start });
  } catch (error) {
    res.json({
      ok: false,
      ms: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/user-problems', userProblemRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
