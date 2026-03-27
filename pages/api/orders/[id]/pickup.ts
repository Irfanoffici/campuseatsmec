// PATCH /api/orders/:id/pickup - Confirm pickup and process payment
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { orderDB, userDB, transactionDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError, BadRequestError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';

interface PickupRequest {
    rfid_uid?: string; // For RFID verification
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
        const { rfid_uid }: PickupRequest = req.body;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid order ID');
        }

        const order = await orderDB.getById(id);

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // Verify order is ready
        if (order.status !== 'ready') {
            throw new BadRequestError('Order is not ready for pickup');
        }

        // Verify user owns this order (or is vendor/admin)
        if (req.user.role === UserRole.STUDENT && order.user_id !== req.user.id) {
            throw new ForbiddenError('You can only pickup your own orders');
        }

        // For RFID payment, verify RFID UID
        if (order.payment_method === 'rfid') {
            const user = await userDB.getById(order.user_id);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            if (rfid_uid && user.rfid_uid !== rfid_uid) {
                throw new BadRequestError('RFID UID does not match');
            }

            // Deduct from wallet
            const success = await userDB.deductFromWallet(order.user_id, order.total_amount);

            if (!success) {
                throw new BadRequestError('Insufficient wallet balance');
            }
        }

        // Mark order as picked up
        await orderDB.markPickedUp(id);

        // Create transaction record
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await transactionDB.create(transactionId, {
            order_id: id,
            user_id: order.user_id,
            amount: order.total_amount,
            method: order.payment_method,
            status: 'completed',
        });

        const updatedOrder = await orderDB.getById(id);

        return successResponse(res, {
            order: updatedOrder,
            message: 'Order picked up successfully. Payment processed.',
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
