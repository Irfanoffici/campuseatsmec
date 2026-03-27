// GET /api/vendors - Get all vendors
import type { NextApiRequest, NextApiResponse } from 'next';
import { vendorDB } from '@/lib/db';
import { handleApiError, successResponse } from '@/lib/api/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { available } = req.query;

        let vendors;
        if (available === 'true') {
            vendors = await vendorDB.getAvailable();
        } else {
            vendors = await vendorDB.getAll();
        }

        return successResponse(res, { vendors });

    } catch (error) {
        return handleApiError(error, res);
    }
}
