// POST /api/menu - Create menu item (Vendor/Admin only)
import type { NextApiResponse } from 'next';
import { withVendor, AuthenticatedRequest } from '@/lib/api/middleware';
import { menuItemDB, vendorDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { validateCreateMenuItem, CreateMenuItemInput } from '@/lib/api/validation';
import { UserRole } from '@/lib/supabase';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const input: CreateMenuItemInput = req.body;

        // Validate input
        validateCreateMenuItem(input);

        // Vendors can only create items for themselves (unless admin)
        if (req.user.role !== UserRole.ADMIN && input.vendor_id !== req.user.id) {
            throw new ForbiddenError('You can only create menu items for your own vendor');
        }

        // Verify vendor exists
        const vendor = await vendorDB.getById(input.vendor_id);
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        // Create menu item
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const menuItem = await menuItemDB.create(itemId, input);

        // Add item to vendor's menu_items array
        await vendorDB.addMenuItem(input.vendor_id, itemId);

        return successResponse(res, { menuItem }, 201);

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withVendor(handler);
