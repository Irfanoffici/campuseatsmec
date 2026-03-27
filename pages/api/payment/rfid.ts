// POST /api/payment/rfid - Process RFID payment (for pickup confirmation)
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { userDB, orderDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, BadRequestError } from '@/lib/api/errors';

interface RfidPaymentRequest {
    rfid_uid: string;
    order_id: string;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rfid_uid, order_id }: RfidPaymentRequest = req.body;

        if (!rfid_uid || !order_id) {
            throw new BadRequestError('RFID UID and order ID are required');
        }

        // Get user by RFID
        const user = await userDB.getByRfid(rfid_uid);
        if (!user) {
            throw new NotFoundError('RFID not found');
        }

        // Get order
        const order = await orderDB.getById(order_id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // Verify order belongs to this user
        if (order.user_id !== user.user_id) {
            throw new BadRequestError('Order does not belong to this RFID');
        }

        // Verify order is ready
        if (order.status !== 'ready') {
            throw new BadRequestError('Order is not ready for pickup');
        }

        // Verify payment method is RFID
        if (order.payment_method !== 'rfid') {
            throw new BadRequestError('Order payment method is not RFID');
        }

        // Check sufficient balance
        if (user.wallet_balance < order.total_amount) {
            throw new BadRequestError('Insufficient wallet balance');
        }

        return successResponse(res, {
            verified: true,
            user: {
                id: user.user_id,
                name: user.name,
                wallet_balance: user.wallet_balance,
            },
            order: {
                id: order.order_id,
                total_amount: order.total_amount,
            },
            message: 'RFID verified. Ready for pickup confirmation.',
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
