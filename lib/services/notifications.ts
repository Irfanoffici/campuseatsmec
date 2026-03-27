// Notification Service for CampusEats
// Handles sending notifications for order events

export interface Notification {
    user_id: string;
    title: string;
    message: string;
    type: 'order_accepted' | 'order_ready' | 'pickup_confirmed' | 'order_cancelled';
    order_id?: string;
    timestamp: Date;
}

class NotificationService {
    private notifications: Map<string, Notification[]> = new Map();

    // Send notification (in production, this would integrate with push notification service)
    async send(notification: Notification): Promise<void> {
        console.log('📧 Sending notification:', notification);

        // Store notification in memory (in production, use database)
        const userNotifications = this.notifications.get(notification.user_id) || [];
        userNotifications.push(notification);
        this.notifications.set(notification.user_id, userNotifications);

        // TODO: Integrate with actual notification service (Firebase Cloud Messaging, etc.)
    }

    // Get notifications for a user
    async getForUser(userId: string): Promise<Notification[]> {
        return this.notifications.get(userId) || [];
    }

    // Clear notifications for a user
    async clearForUser(userId: string): Promise<void> {
        this.notifications.delete(userId);
    }

    // Order accepted notification
    async notifyOrderAccepted(userId: string, orderId: string, vendorName: string): Promise<void> {
        await this.send({
            user_id: userId,
            title: 'Order Accepted! 🎉',
            message: `${vendorName} has accepted your order and started preparing it.`,
            type: 'order_accepted',
            order_id: orderId,
            timestamp: new Date(),
        });
    }

    // Order ready notification
    async notifyOrderReady(userId: string, orderId: string, vendorName: string): Promise<void> {
        await this.send({
            user_id: userId,
            title: 'Order Ready! 🍽️',
            message: `Your order from ${vendorName} is ready for pickup!`,
            type: 'order_ready',
            order_id: orderId,
            timestamp: new Date(),
        });
    }

    // Pickup confirmed notification
    async notifyPickupConfirmed(userId: string, orderId: string, amount: number): Promise<void> {
        await this.send({
            user_id: userId,
            title: 'Pickup Confirmed ✅',
            message: `Order picked up successfully. ₹${amount} deducted from your wallet.`,
            type: 'pickup_confirmed',
            order_id: orderId,
            timestamp: new Date(),
        });
    }

    // Order cancelled notification
    async notifyOrderCancelled(userId: string, orderId: string): Promise<void> {
        await this.send({
            user_id: userId,
            title: 'Order Cancelled ❌',
            message: 'Your order has been cancelled.',
            type: 'order_cancelled',
            order_id: orderId,
            timestamp: new Date(),
        });
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
