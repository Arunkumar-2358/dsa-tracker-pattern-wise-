import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number) => Response;
export declare const sendPaginated: <T>(res: Response, data: T, total: number, page: number, limit: number) => Response;
export declare const sendError: (res: Response, message: string, statusCode?: number) => Response;
//# sourceMappingURL=apiResponse.d.ts.map