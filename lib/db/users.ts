// User Database Operations
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { User, COLLECTIONS } from './schema';

export const userDB = {
    // Create a new user
    create: async (userId: string, userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>) => {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const newUser: User = {
            user_id: userId,
            ...userData,
            created_at: serverTimestamp() as any,
            updated_at: serverTimestamp() as any,
        };
        await setDoc(userRef, newUser);
        return newUser;
    },

    // Get user by ID
    getById: async (userId: string): Promise<User | null> => {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? (userSnap.data() as User) : null;
    },

    // Get user by RFID UID
    getByRfid: async (rfidUid: string): Promise<User | null> => {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, where('rfid_uid', '==', rfidUid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;
        return querySnapshot.docs[0].data() as User;
    },

    // Update user wallet balance
    updateWalletBalance: async (userId: string, newBalance: number) => {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            wallet_balance: newBalance,
            updated_at: serverTimestamp(),
        });
    },

    // Deduct from wallet (for order payment)
    deductFromWallet: async (userId: string, amount: number): Promise<boolean> => {
        const user = await userDB.getById(userId);
        if (!user || user.wallet_balance < amount) {
            return false; // Insufficient balance
        }

        const newBalance = user.wallet_balance - amount;
        await userDB.updateWalletBalance(userId, newBalance);
        return true;
    },

    // Add to wallet (for refunds or top-ups)
    addToWallet: async (userId: string, amount: number) => {
        const user = await userDB.getById(userId);
        if (!user) throw new Error('User not found');

        const newBalance = user.wallet_balance + amount;
        await userDB.updateWalletBalance(userId, newBalance);
    },

    // Update user RFID
    updateRfid: async (userId: string, rfidUid: string) => {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            rfid_uid: rfidUid,
            updated_at: serverTimestamp(),
        });
    },

    // Get all users by role
    getByRole: async (role: 'student' | 'vendor' | 'admin'): Promise<User[]> => {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, where('role', '==', role));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as User);
    },
};
