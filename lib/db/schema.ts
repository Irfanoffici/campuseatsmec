// Database Schema Types for CampusEats MEC
// Based on database.xml specifications

import { Timestamp } from 'firebase/firestore';

// User Collection
export interface User {
    user_id: string;
    name: string;
    email: string;
    role: 'student' | 'vendor' | 'admin';
    rfid_uid?: string; // Optional, for students
    wallet_balance: number; // In rupees
    created_at: Timestamp;
    updated_at: Timestamp;
}

// Vendor Collection
export interface Vendor {
    vendor_id: string;
    name: string;
    description?: string;
    menu_items: string[]; // Array of menu_item IDs
    availability_status: 'open' | 'closed' | 'busy';
    created_at: Timestamp;
    updated_at: Timestamp;
}

// Menu Item Collection
export interface MenuItem {
    item_id: string;
    vendor_id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image_url?: string;
    available: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
}

// Order Item (nested in Order)
export interface OrderItem {
    item_id: string;
    name: string;
    price: number;
    quantity: number;
}

// Order Collection
export interface Order {
    order_id: string;
    user_id: string;
    vendor_id: string;
    items: OrderItem[];
    total_amount: number;
    status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
    payment_method: 'rfid' | 'qr' | 'upi';
    payment_status: 'pending' | 'completed' | 'failed';
    created_at: Timestamp;
    accepted_at?: Timestamp;
    ready_at?: Timestamp;
    picked_up_at?: Timestamp;
    group_order_id?: string; // Optional, if part of group order
}

// Transaction Collection
export interface Transaction {
    transaction_id: string;
    order_id: string;
    user_id: string;
    amount: number;
    method: 'rfid' | 'qr' | 'upi';
    status: 'pending' | 'completed' | 'failed';
    timestamp: Timestamp;
}

// Group Order Collection
export interface GroupOrder {
    group_id: string;
    linked_orders: string[]; // Array of order IDs
    status: 'active' | 'completed' | 'cancelled';
    created_by: string; // user_id
    created_at: Timestamp;
    updated_at: Timestamp;
}

// Collection names as constants
export const COLLECTIONS = {
    USERS: 'users',
    VENDORS: 'vendors',
    MENU_ITEMS: 'menu_items',
    ORDERS: 'orders',
    TRANSACTIONS: 'transactions',
    GROUP_ORDERS: 'group_orders',
} as const;
