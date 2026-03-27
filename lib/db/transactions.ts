// Transactions Database Operations
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
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, COLLECTIONS } from './schema';

export const transactionDB = {
    // Create a new transaction
    create: async (transactionId: string, transactionData: Omit<Transaction, 'transaction_id' | 'timestamp'>) => {
        const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
        const newTransaction: Transaction = {
            transaction_id: transactionId,
            ...transactionData,
            timestamp: serverTimestamp() as any,
        };
        await setDoc(transactionRef, newTransaction);
        return newTransaction;
    },

    // Get transaction by ID
    getById: async (transactionId: string): Promise<Transaction | null> => {
        const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
        const transactionSnap = await getDoc(transactionRef);
        return transactionSnap.exists() ? (transactionSnap.data() as Transaction) : null;
    },

    // Get all transactions for a user
    getByUser: async (userId: string): Promise<Transaction[]> => {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const q = query(
            transactionsRef,
            where('user_id', '==', userId),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Transaction);
    },

    // Get transaction for a specific order
    getByOrder: async (orderId: string): Promise<Transaction | null> => {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const q = query(transactionsRef, where('order_id', '==', orderId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;
        return querySnapshot.docs[0].data() as Transaction;
    },

    // Update transaction status
    updateStatus: async (transactionId: string, status: Transaction['status']) => {
        const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
        await updateDoc(transactionRef, {
            status,
        });
    },

    // Get completed transactions for a user
    getCompletedByUser: async (userId: string): Promise<Transaction[]> => {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const q = query(
            transactionsRef,
            where('user_id', '==', userId),
            where('status', '==', 'completed'),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Transaction);
    },

    // Get pending transactions for a user
    getPendingByUser: async (userId: string): Promise<Transaction[]> => {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const q = query(
            transactionsRef,
            where('user_id', '==', userId),
            where('status', '==', 'pending'),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Transaction);
    },
};
