// Group Orders Database Operations
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { GroupOrder, COLLECTIONS } from './schema';

export const groupOrderDB = {
    // Create a new group order
    create: async (groupId: string, groupData: Omit<GroupOrder, 'group_id' | 'created_at' | 'updated_at'>) => {
        const groupRef = doc(db, COLLECTIONS.GROUP_ORDERS, groupId);
        const newGroup: GroupOrder = {
            group_id: groupId,
            ...groupData,
            created_at: serverTimestamp() as any,
            updated_at: serverTimestamp() as any,
        };
        await setDoc(groupRef, newGroup);
        return newGroup;
    },

    // Get group order by ID
    getById: async (groupId: string): Promise<GroupOrder | null> => {
        const groupRef = doc(db, COLLECTIONS.GROUP_ORDERS, groupId);
        const groupSnap = await getDoc(groupRef);
        return groupSnap.exists() ? (groupSnap.data() as GroupOrder) : null;
    },

    // Get all group orders created by a user
    getByCreator: async (userId: string): Promise<GroupOrder[]> => {
        const groupsRef = collection(db, COLLECTIONS.GROUP_ORDERS);
        const q = query(groupsRef, where('created_by', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as GroupOrder);
    },

    // Get active group orders created by a user
    getActiveByCreator: async (userId: string): Promise<GroupOrder[]> => {
        const groupsRef = collection(db, COLLECTIONS.GROUP_ORDERS);
        const q = query(
            groupsRef,
            where('created_by', '==', userId),
            where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as GroupOrder);
    },

    // Add order to group
    addOrder: async (groupId: string, orderId: string) => {
        const group = await groupOrderDB.getById(groupId);
        if (!group) throw new Error('Group order not found');

        const updatedOrders = [...group.linked_orders, orderId];
        const groupRef = doc(db, COLLECTIONS.GROUP_ORDERS, groupId);
        await updateDoc(groupRef, {
            linked_orders: updatedOrders,
            updated_at: serverTimestamp(),
        });
    },

    // Remove order from group
    removeOrder: async (groupId: string, orderId: string) => {
        const group = await groupOrderDB.getById(groupId);
        if (!group) throw new Error('Group order not found');

        const updatedOrders = group.linked_orders.filter(id => id !== orderId);
        const groupRef = doc(db, COLLECTIONS.GROUP_ORDERS, groupId);
        await updateDoc(groupRef, {
            linked_orders: updatedOrders,
            updated_at: serverTimestamp(),
        });
    },

    // Update group order status
    updateStatus: async (groupId: string, status: GroupOrder['status']) => {
        const groupRef = doc(db, COLLECTIONS.GROUP_ORDERS, groupId);
        await updateDoc(groupRef, {
            status,
            updated_at: serverTimestamp(),
        });
    },

    // Complete group order
    complete: async (groupId: string) => {
        await groupOrderDB.updateStatus(groupId, 'completed');
    },

    // Cancel group order
    cancel: async (groupId: string) => {
        await groupOrderDB.updateStatus(groupId, 'cancelled');
    },
};
