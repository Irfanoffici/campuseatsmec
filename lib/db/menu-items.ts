// Menu Items Database Operations
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { MenuItem, COLLECTIONS } from './schema';

export const menuItemDB = {
    // Create a new menu item
    create: async (itemId: string, itemData: Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>) => {
        const itemRef = doc(db, COLLECTIONS.MENU_ITEMS, itemId);
        const newItem: MenuItem = {
            item_id: itemId,
            ...itemData,
            created_at: serverTimestamp() as any,
            updated_at: serverTimestamp() as any,
        };
        await setDoc(itemRef, newItem);
        return newItem;
    },

    // Get menu item by ID
    getById: async (itemId: string): Promise<MenuItem | null> => {
        const itemRef = doc(db, COLLECTIONS.MENU_ITEMS, itemId);
        const itemSnap = await getDoc(itemRef);
        return itemSnap.exists() ? (itemSnap.data() as MenuItem) : null;
    },

    // Get all menu items for a vendor
    getByVendor: async (vendorId: string): Promise<MenuItem[]> => {
        const itemsRef = collection(db, COLLECTIONS.MENU_ITEMS);
        const q = query(itemsRef, where('vendor_id', '==', vendorId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as MenuItem);
    },

    // Get available menu items for a vendor
    getAvailableByVendor: async (vendorId: string): Promise<MenuItem[]> => {
        const itemsRef = collection(db, COLLECTIONS.MENU_ITEMS);
        const q = query(
            itemsRef,
            where('vendor_id', '==', vendorId),
            where('available', '==', true)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as MenuItem);
    },

    // Get all available menu items
    getAllAvailable: async (): Promise<MenuItem[]> => {
        const itemsRef = collection(db, COLLECTIONS.MENU_ITEMS);
        const q = query(itemsRef, where('available', '==', true));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as MenuItem);
    },

    // Update menu item availability
    updateAvailability: async (itemId: string, available: boolean) => {
        const itemRef = doc(db, COLLECTIONS.MENU_ITEMS, itemId);
        await updateDoc(itemRef, {
            available,
            updated_at: serverTimestamp(),
        });
    },

    // Update menu item details
    update: async (itemId: string, updates: Partial<Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>>) => {
        const itemRef = doc(db, COLLECTIONS.MENU_ITEMS, itemId);
        await updateDoc(itemRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
    },

    // Delete menu item
    delete: async (itemId: string) => {
        const itemRef = doc(db, COLLECTIONS.MENU_ITEMS, itemId);
        await deleteDoc(itemRef);
    },

    // Get menu items by category
    getByCategory: async (category: string): Promise<MenuItem[]> => {
        const itemsRef = collection(db, COLLECTIONS.MENU_ITEMS);
        const q = query(itemsRef, where('category', '==', category));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as MenuItem);
    },
};
