// PATCH /api/orders/:id/status - Update order status
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { orderDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError, BadRequestError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';
import { Order } from '@/lib/db/schema';

interface UpdateStatusRequest {
    status: Order['status'];
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { id } = req.query;
        const { status }: UpdateStatusRequest = req.body;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid order ID');
        }

        if (!status) {
            throw new BadRequestError('Status is required');
        }

        const validStatuses: Order['status'][] = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new BadRequestError('Invalid status');
        }

        const order = await orderDB.getById(id);

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // Check permissions
        // Vendors can update their orders, students can cancel pending orders
        if (req.user.role === UserRole.VENDOR) {
            if (order.vendor_id !== req.user.id) {
                throw new ForbiddenError('You can only update your own orders');
            }
        } else if (req.user.role === UserRole.STUDENT) {
            if (order.user_id !== req.user.id) {
                throw new ForbiddenError('You can only update your own orders');
            }
            // Students can only cancel pending orders
            if (status !== 'cancelled' || order.status !== 'pending') {
                throw new ForbiddenError('You can only cancel pending orders');
            }
        } else if (req.user.role !== UserRole.ADMIN) {
            throw new ForbiddenError('Insufficient permissions');
        }

        // Cannot modify picked up orders
        if (order.status === 'picked_up') {
            throw new BadRequestError('Cannot modify picked up orders');
        }

        // Update status
        await orderDB.updateStatus(id, status);

        const updatedOrder = await orderDB.getById(id);

        return successResponse(res, { order: updatedOrder });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
