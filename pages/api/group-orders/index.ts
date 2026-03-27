// POST /api/group-orders - Create group order
import type { NextApiResponse } from 'next';
import { withStudent, AuthenticatedRequest } from '@/lib/api/middleware';
import { groupOrderDB } from '@/lib/db';
import { handleApiError, successResponse, BadRequestError } from '@/lib/api/errors';

interface CreateGroupOrderRequest {
    linked_orders?: string[];
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new BadRequestError('User not authenticated');
        }

        const { linked_orders = [] }: CreateGroupOrderRequest = req.body;

        // Create group order
        const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const groupOrder = await groupOrderDB.create(groupId, {
            linked_orders,
            status: 'active',
            created_by: req.user.id,
        });

        return successResponse(res, { groupOrder }, 201);

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withStudent(handler);
