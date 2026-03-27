// API Error Handling Utilities
import { NextApiResponse } from 'next';

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends ApiError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
        this.name = 'InternalServerError';
    }
}

// Error handler wrapper
export function handleApiError(error: unknown, res: NextApiResponse) {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            error: error.message,
            statusCode: error.statusCode,
        });
    }

    // Unknown error
    return res.status(500).json({
        error: 'Internal server error',
        statusCode: 500,
    });
}

// Success response helper
export function successResponse(res: NextApiResponse, data: any, statusCode: number = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
    });
}
