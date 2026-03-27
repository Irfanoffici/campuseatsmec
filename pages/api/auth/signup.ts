// POST /api/auth/signup - User registration
import type { NextApiRequest, NextApiResponse } from 'next';
import { authHelpers, UserRole } from '@/lib/supabase';
import { userDB } from '@/lib/db';
import { handleApiError, successResponse, BadRequestError } from '@/lib/api/errors';
import { validateEmail, validatePassword, validateRequired } from '@/lib/api/validation';

interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    rfid_uid?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, name, role, rfid_uid }: SignUpRequest = req.body;

        // Validation
        validateRequired(email, 'email');
        validateRequired(password, 'password');
        validateRequired(name, 'name');
        validateRequired(role, 'role');

        if (!validateEmail(email)) {
            throw new BadRequestError('Invalid email format');
        }

        if (!validatePassword(password)) {
            throw new BadRequestError('Password must be at least 8 characters with letters and numbers');
        }

        if (!Object.values(UserRole).includes(role)) {
            throw new BadRequestError('Invalid role');
        }

        // Sign up with Supabase
        const { data, error } = await authHelpers.signUp(email, password, { name, role });

        if (error) {
            throw new BadRequestError(error.message);
        }

        if (!data.user) {
            throw new BadRequestError('Failed to create user');
        }

        // Create user in Firestore
        await userDB.create(data.user.id, {
            name,
            email,
            role,
            rfid_uid: rfid_uid || undefined,
            wallet_balance: 0, // Start with 0 balance
        });

        return successResponse(res, {
            user: {
                id: data.user.id,
                email: data.user.email,
                name,
                role,
            },
            session: data.session,
        }, 201);

    } catch (error) {
        return handleApiError(error, res);
    }
}
