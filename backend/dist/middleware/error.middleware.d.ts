import { Request, Response, NextFunction } from 'express';
interface AppError extends Error {
    statusCode?: number;
    code?: string;
}
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export declare const notFound: (_req: Request, res: Response) => void;
export {};
//# sourceMappingURL=error.middleware.d.ts.map