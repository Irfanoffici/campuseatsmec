// GET /api/wallet/balance/:userId - Get wallet balance
import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/api/middleware';
import { userDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { userId } = req.query;

        if (typeof userId !== 'string') {
            throw new NotFoundError('Invalid user ID');
        }

        // Users can only see their own balance (unless admin)
        if (req.user.role !== UserRole.ADMIN && userId !== req.user.id) {
            throw new ForbiddenError('You can only view your own wallet balance');
        }

        const user = await userDB.getById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return successResponse(res, {
            user_id: user.user_id,
            wallet_balance: user.wallet_balance,
            rfid_uid: user.rfid_uid,
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAuth(handler);
