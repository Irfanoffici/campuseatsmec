// POST /api/auth/login - User login
import type { NextApiRequest, NextApiResponse } from 'next';
import { authHelpers } from '@/lib/supabase';
import { userDB } from '@/lib/db';
import { handleApiError, successResponse, BadRequestError, UnauthorizedError } from '@/lib/api/errors';
import { validateEmail, validateRequired } from '@/lib/api/validation';

interface LoginRequest {
    email: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password }: LoginRequest = req.body;

        // Validation
        validateRequired(email, 'email');
        validateRequired(password, 'password');

        if (!validateEmail(email)) {
            throw new BadRequestError('Invalid email format');
        }

        // Sign in with Supabase
        const { data, error } = await authHelpers.signIn(email, password);

        if (error) {
            throw new UnauthorizedError('Invalid email or password');
        }

        if (!data.user || !data.session) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Get user data from Firestore
        const userData = await userDB.getById(data.user.id);

        if (!userData) {
            throw new UnauthorizedError('User not found');
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
            session: data.session,
        });

    } catch (error) {
        return handleApiError(error, res);
    }
}
