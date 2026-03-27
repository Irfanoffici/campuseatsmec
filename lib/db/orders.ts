// Orders Database Operations
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, COLLECTIONS } from './schema';

export const orderDB = {
    // Create a new order
    create: async (orderId: string, orderData: Omit<Order, 'order_id' | 'created_at'>) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        const newOrder: Order = {
            order_id: orderId,
            ...orderData,
            created_at: serverTimestamp() as any,
        };
        await setDoc(orderRef, newOrder);
        return newOrder;
    },

    // Get order by ID
    getById: async (orderId: string): Promise<Order | null> => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        const orderSnap = await getDoc(orderRef);
        return orderSnap.exists() ? (orderSnap.data() as Order) : null;
    },

    // Get all orders for a user
    getByUser: async (userId: string): Promise<Order[]> => {
        const ordersRef = collection(db, COLLECTIONS.ORDERS);
        const q = query(
            ordersRef,
            where('user_id', '==', userId),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    },

    // Get all orders for a vendor
    getByVendor: async (vendorId: string): Promise<Order[]> => {
        const ordersRef = collection(db, COLLECTIONS.ORDERS);
        const q = query(
            ordersRef,
            where('vendor_id', '==', vendorId),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    },

    // Get pending orders for a vendor (order queue)
    getPendingByVendor: async (vendorId: string): Promise<Order[]> => {
        const ordersRef = collection(db, COLLECTIONS.ORDERS);
        const q = query(
            ordersRef,
            where('vendor_id', '==', vendorId),
            where('status', 'in', ['pending', 'accepted', 'preparing', 'ready']),
            orderBy('created_at', 'asc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    },

    // Update order status
    updateStatus: async (orderId: string, status: Order['status']) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        const updates: any = { status };

        // Add timestamp based on status
        if (status === 'accepted') {
            updates.accepted_at = serverTimestamp();
        } else if (status === 'ready') {
            updates.ready_at = serverTimestamp();
        } else if (status === 'picked_up') {
            updates.picked_up_at = serverTimestamp();
        }

        await updateDoc(orderRef, updates);
    },

    // Mark order as picked up (triggers payment)
    markPickedUp: async (orderId: string) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(orderRef, {
            status: 'picked_up',
            picked_up_at: serverTimestamp(),
            payment_status: 'completed',
        });
    },

    // Get active orders for a user (not picked up or cancelled)
    getActiveByUser: async (userId: string): Promise<Order[]> => {
        const ordersRef = collection(db, COLLECTIONS.ORDERS);
        const q = query(
            ordersRef,
            where('user_id', '==', userId),
            where('status', 'in', ['pending', 'accepted', 'preparing', 'ready']),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    },

    // Get recent orders for a user
    getRecentByUser: async (userId: string, limitCount: number = 10): Promise<Order[]> => {
        const ordersRef = collection(db, COLLECTIONS.ORDERS);
        const q = query(
            ordersRef,
            where('user_id', '==', userId),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    },

    // Cancel order
    cancel: async (orderId: string) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(orderRef, {
            status: 'cancelled',
        });
    },

    // Update payment status
    updatePaymentStatus: async (orderId: string, paymentStatus: Order['payment_status']) => {
        const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(orderRef, {
            payment_status: paymentStatus,
        });
    },
};
