// API Middleware for Authentication and Authorization
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, UserRole } from '../supabase';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

// Middleware to verify authentication
export async function withAuth(
    handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            // Get token from Authorization header
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({ error: 'Unauthorized - No token provided' });
            }

            // Verify token with Supabase
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }

            // Attach user to request
            req.user = {
                id: user.id,
                email: user.email || '',
                role: user.user_metadata?.role || UserRole.STUDENT,
            };

            return handler(req, res);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

// Middleware to check user role
export function withRole(allowedRoles: UserRole[]) {
    return (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
        return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
            }

            return handler(req, res);
        });
    };
}

// Middleware for admin-only routes
export const withAdmin = withRole([UserRole.ADMIN]);

// Middleware for vendor-only routes
export const withVendor = withRole([UserRole.VENDOR, UserRole.ADMIN]);

// Middleware for student-only routes
export const withStudent = withRole([UserRole.STUDENT, UserRole.ADMIN]);
