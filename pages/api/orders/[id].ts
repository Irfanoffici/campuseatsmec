// GET /api/orders/:id - Get order details
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { orderDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { id } = req.query;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid order ID');
        }

        const order = await orderDB.getById(id);

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // Check permissions - users can only see their own orders, vendors can see orders for them
        if (
            req.user.role !== UserRole.ADMIN &&
            order.user_id !== req.user.id &&
            order.vendor_id !== req.user.id
        ) {
            throw new ForbiddenError('You do not have permission to view this order');
        }

        return successResponse(res, { order });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
