// POST /api/auth/logout - User logout
import type { NextApiRequest, NextApiResponse } from 'next';
import { authHelpers } from '@/lib/supabase';
import { handleApiError, successResponse } from '@/lib/api/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { error } = await authHelpers.signOut();

        if (error) {
            throw error;
        }

        return successResponse(res, { message: 'Logged out successfully' });

    } catch (error) {
        return handleApiError(error, res);
    }
}
