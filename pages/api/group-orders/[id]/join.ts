// POST /api/group-orders/:id/join - Join group order
import type { NextApiResponse } from 'next';
import { withStudent, AuthenticatedRequest } from '@/lib/api/middleware';
import { groupOrderDB, orderDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, BadRequestError } from '@/lib/api/errors';

interface JoinGroupOrderRequest {
    order_id: string;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new BadRequestError('User not authenticated');
        }

        const { id } = req.query;
        const { order_id }: JoinGroupOrderRequest = req.body;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid group order ID');
        }

        if (!order_id) {
            throw new BadRequestError('Order ID is required');
        }

        const groupOrder = await groupOrderDB.getById(id);
        if (!groupOrder) {
            throw new NotFoundError('Group order not found');
        }

        if (groupOrder.status !== 'active') {
            throw new BadRequestError('Group order is not active');
        }

        // Verify order exists and belongs to user
        const order = await orderDB.getById(order_id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        if (order.user_id !== req.user.id) {
            throw new BadRequestError('You can only add your own orders to group');
        }

        // Add order to group
        await groupOrderDB.addOrder(id, order_id);

        const updatedGroup = await groupOrderDB.getById(id);

        return successResponse(res, { groupOrder: updatedGroup });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withStudent(handler);
