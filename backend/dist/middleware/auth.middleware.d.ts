import { Request, Response, NextFunction, RequestHandler } from 'express';
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
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAuth: RequestHandler;
//# sourceMappingURL=auth.middleware.d.ts.map