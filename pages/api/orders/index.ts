// POST /api/orders - Create new order
import type { NextApiResponse } from 'next';
import { withStudent, AuthenticatedRequest } from '@/lib/api/middleware';
import { orderDB, userDB, vendorDB, menuItemDB } from '@/lib/db';
import { handleApiError, successResponse, BadRequestError, NotFoundError } from '@/lib/api/errors';
import { validateCreateOrder, CreateOrderInput } from '@/lib/api/validation';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new BadRequestError('User not authenticated');
        }

        const input: CreateOrderInput = req.body;

        // Validate input
        validateCreateOrder(input);

        // Verify vendor exists and is available
        const vendor = await vendorDB.getById(input.vendor_id);
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        if (vendor.availability_status === 'closed') {
            throw new BadRequestError('Vendor is currently closed');
        }

        // Verify all menu items exist and are available
        for (const item of input.items) {
            const menuItem = await menuItemDB.getById(item.item_id);
            if (!menuItem) {
                throw new NotFoundError(`Menu item ${item.item_id} not found`);
            }
            if (!menuItem.available) {
                throw new BadRequestError(`Menu item ${menuItem.name} is not available`);
            }
            if (menuItem.vendor_id !== input.vendor_id) {
                throw new BadRequestError(`Menu item ${menuItem.name} does not belong to this vendor`);
            }
        }

        // Calculate total amount
        const total_amount = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Verify user has sufficient balance (for RFID payment)
        if (input.payment_method === 'rfid') {
            const user = await userDB.getById(req.user.id);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            if (user.wallet_balance < total_amount) {
                throw new BadRequestError('Insufficient wallet balance');
            }
            if (!user.rfid_uid) {
                throw new BadRequestError('RFID not linked to account');
            }
        }

        // Create order
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const order = await orderDB.create(orderId, {
            user_id: req.user.id,
            vendor_id: input.vendor_id,
            items: input.items,
            total_amount,
            status: 'pending',
            payment_method: input.payment_method,
            payment_status: 'pending',
        });

        return successResponse(res, { order }, 201);

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withStudent(handler);
