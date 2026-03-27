// Vendor Database Operations
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
import { Vendor, COLLECTIONS } from './schema';

export const vendorDB = {
    // Create a new vendor
    create: async (vendorId: string, vendorData: Omit<Vendor, 'vendor_id' | 'created_at' | 'updated_at'>) => {
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        const newVendor: Vendor = {
            vendor_id: vendorId,
            ...vendorData,
            created_at: serverTimestamp() as any,
            updated_at: serverTimestamp() as any,
        };
        await setDoc(vendorRef, newVendor);
        return newVendor;
    },

    // Get vendor by ID
    getById: async (vendorId: string): Promise<Vendor | null> => {
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        const vendorSnap = await getDoc(vendorRef);
        return vendorSnap.exists() ? (vendorSnap.data() as Vendor) : null;
    },

    // Get all vendors
    getAll: async (): Promise<Vendor[]> => {
        const vendorsRef = collection(db, COLLECTIONS.VENDORS);
        const querySnapshot = await getDocs(vendorsRef);
        return querySnapshot.docs.map(doc => doc.data() as Vendor);
    },

    // Get available vendors (open status)
    getAvailable: async (): Promise<Vendor[]> => {
        const vendorsRef = collection(db, COLLECTIONS.VENDORS);
        const q = query(vendorsRef, where('availability_status', '==', 'open'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Vendor);
    },

    // Update vendor availability status
    updateStatus: async (vendorId: string, status: 'open' | 'closed' | 'busy') => {
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        await updateDoc(vendorRef, {
            availability_status: status,
            updated_at: serverTimestamp(),
        });
    },

    // Add menu item to vendor
    addMenuItem: async (vendorId: string, menuItemId: string) => {
        const vendor = await vendorDB.getById(vendorId);
        if (!vendor) throw new Error('Vendor not found');

        const updatedMenuItems = [...vendor.menu_items, menuItemId];
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        await updateDoc(vendorRef, {
            menu_items: updatedMenuItems,
            updated_at: serverTimestamp(),
        });
    },

    // Remove menu item from vendor
    removeMenuItem: async (vendorId: string, menuItemId: string) => {
        const vendor = await vendorDB.getById(vendorId);
        if (!vendor) throw new Error('Vendor not found');

        const updatedMenuItems = vendor.menu_items.filter(id => id !== menuItemId);
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        await updateDoc(vendorRef, {
            menu_items: updatedMenuItems,
            updated_at: serverTimestamp(),
        });
    },

    // Update vendor details
    update: async (vendorId: string, updates: Partial<Omit<Vendor, 'vendor_id' | 'created_at' | 'updated_at'>>) => {
        const vendorRef = doc(db, COLLECTIONS.VENDORS, vendorId);
        await updateDoc(vendorRef, {
            ...updates,
            updated_at: serverTimestamp(),
        });
    },
};
