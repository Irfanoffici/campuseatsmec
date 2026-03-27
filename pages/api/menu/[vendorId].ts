// GET /api/menu/:vendorId - Get vendor menu
import type { NextApiRequest, NextApiResponse } from 'next';
import { menuItemDB } from '@/lib/db';
import { handleApiError, successResponse } from '@/lib/api/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { vendorId } = req.query;
        const { available } = req.query;

        if (typeof vendorId !== 'string') {
            return res.status(400).json({ error: 'Invalid vendor ID' });
        }

        let menuItems;
        if (available === 'true') {
            menuItems = await menuItemDB.getAvailableByVendor(vendorId);
        } else {
            menuItems = await menuItemDB.getByVendor(vendorId);
        }

        return successResponse(res, { menuItems });

    } catch (error) {
        return handleApiError(error, res);
    }
}
