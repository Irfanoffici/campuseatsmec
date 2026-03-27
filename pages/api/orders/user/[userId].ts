// GET /api/orders/user/:userId - Get user orders
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { orderDB } from '@/lib/db';
import { handleApiError, successResponse, ForbiddenError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { userId } = req.query;

        if (typeof userId !== 'string') {
            throw new ForbiddenError('Invalid user ID');
        }

        // Users can only see their own orders (unless admin)
        if (req.user.role !== UserRole.ADMIN && userId !== req.user.id) {
            throw new ForbiddenError('You can only view your own orders');
        }

        const orders = await orderDB.getByUser(userId);

        return successResponse(res, { orders });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
