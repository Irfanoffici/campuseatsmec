// GET /api/vendors/:id - Get vendor details
import type { NextApiRequest, NextApiResponse } from 'next';
import { vendorDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError } from '@/lib/api/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid vendor ID');
        }

        const vendor = await vendorDB.getById(id);

        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        return successResponse(res, { vendor });

    } catch (error) {
        return handleApiError(error, res);
    }
}
