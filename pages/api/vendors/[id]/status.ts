// PATCH /api/vendors/:id/status - Update vendor status
import type { NextApiResponse } from 'next';
import { withVendor, AuthenticatedRequest } from '@/lib/api/middleware';
import { vendorDB } from '@/lib/db';
import { handleApiError, successResponse, NotFoundError, ForbiddenError, BadRequestError } from '@/lib/api/errors';
import { UserRole } from '@/lib/supabase';
import { Vendor } from '@/lib/db/schema';

interface UpdateVendorStatusRequest {
    status: Vendor['availability_status'];
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!req.user) {
            throw new ForbiddenError('User not authenticated');
        }

        const { id } = req.query;
        const { status }: UpdateVendorStatusRequest = req.body;

        if (typeof id !== 'string') {
            throw new NotFoundError('Invalid vendor ID');
        }

        if (!status) {
            throw new BadRequestError('Status is required');
        }

        const validStatuses: Vendor['availability_status'][] = ['open', 'closed', 'busy'];
        if (!validStatuses.includes(status)) {
            throw new BadRequestError('Invalid status');
        }

        // Vendors can only update their own status (unless admin)
        if (req.user.role !== UserRole.ADMIN && id !== req.user.id) {
            throw new ForbiddenError('You can only update your own vendor status');
        }

        const vendor = await vendorDB.getById(id);
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        await vendorDB.updateStatus(id, status);

        const updatedVendor = await vendorDB.getById(id);

        return successResponse(res, { vendor: updatedVendor });

    } catch (error) {
        return handleApiError(error, res);
    }
}

export default withVendor(handler);
