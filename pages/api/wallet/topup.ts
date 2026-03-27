// POST /api/wallet/topup - Add funds to wallet (Admin only for security)
import type { NextApiResponse } from 'next';
import { withAdmin, AuthenticatedRequest } from '@/lib/api/middleware';
import { userDB, transactionDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError } from '@/lib/api/errors';
import { validateWalletTopUp, WalletTopUpInput } from '@/lib/api/validation';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const input: WalletTopUpInput = req.body;

        // Validate input
        validateWalletTopUp(input);

        // Get user
        const user = await userDB.getById(input.user_id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Add to wallet
        await userDB.addToWallet(input.user_id, input.amount);

        // Create transaction record
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await transactionDB.create(transactionId, {
            order_id: 'wallet_topup',
            user_id: input.user_id,
            amount: input.amount,
            method: 'upi', // Assuming UPI for top-ups
            status: 'completed',
        });

        // Get updated user data
        const updatedUser = await userDB.getById(input.user_id);

        return successResponse(res, {
            wallet_balance: updatedUser?.wallet_balance,
            amount_added: input.amount,
            message: 'Wallet topped up successfully',
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withAdmin(handler);
