// GET /api/auth/me - Get current user
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { userDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError } from '@/lib/api/errors';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new NotFoundError('User not found');
        }

        // Get user data from Firestore
        const userData = await userDB.getById(req.user.id);

        if (!userData) {
            throw new NotFoundError('User not found');
        }

        return successResponse(res, {
            user: {
                id: userData.user_id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                wallet_balance: userData.wallet_balance,
                rfid_uid: userData.rfid_uid,
            },
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
