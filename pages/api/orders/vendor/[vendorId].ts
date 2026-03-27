// GET /api/orders/vendor/:vendorId - Get vendor orders
import type { NextApiResponse } from 'next';
import { withVendor, AuthenticatedRequest } from '@/lib/api/middleware';
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

        const { vendorId } = req.query;

        if (typeof vendorId !== 'string') {
            throw new ForbiddenError('Invalid vendor ID');
        }

        // Vendors can only see their own orders (unless admin)
        if (req.user.role !== UserRole.ADMIN && vendorId !== req.user.id) {
            throw new ForbiddenError('You can only view your own orders');
        }

        // Get pending orders (order queue)
        const { status } = req.query;

        let orders;
        if (status === 'pending') {
            orders = await orderDB.getPendingByVendor(vendorId);
        } else {
            orders = await orderDB.getByVendor(vendorId);
        }

        return successResponse(res, { orders });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withVendor(handler);
