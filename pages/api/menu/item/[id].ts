// PATCH /api/menu/:id - Update menu item
import type { NextApiResponse } from 'next';
import { withVendor, AuthenticatedRequest } from '@/lib/api/middleware';
import { menuItemDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError, BadRequestError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { id } = req.query;

        if (typeof id !== 'string') {
            throw new BadRequestError('Invalid menu item ID');
        }

        const menuItem = await menuItemDB.getById(id);
        if (!menuItem) {
            throw new NotFoundError('Menu item not found');
        }

        // Vendors can only update their own items (unless admin)
        if (req.user.role !== UserRole.ADMIN && menuItem.vendor_id !== req.user.id) {
            throw new ForbiddenError('You can only update your own menu items');
        }

        const updates = req.body;
        await menuItemDB.update(id, updates);

        const updatedItem = await menuItemDB.getById(id);

        return successResponse(res, { menuItem: updatedItem });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withVendor(handler);
