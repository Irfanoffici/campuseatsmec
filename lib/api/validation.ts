// Validation Utilities for API Requests
import { BadRequestError } from './errors';

// Email validation
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation (min 8 chars, at least 1 letter and 1 number)
export function validatePassword(password: string): boolean {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// RFID UID validation (alphanumeric, 8-16 chars)
export function validateRfidUid(rfidUid: string): boolean {
    return /^[a-zA-Z0-9]{8,16}$/.test(rfidUid);
}

// Amount validation (positive number)
export function validateAmount(amount: number): boolean {
    return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

// Required field validation
export function validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
        throw new BadRequestError(`${fieldName} is required`);
    }
}

// Order item validation
export interface OrderItemInput {
    item_id: string;
    name: string;
    price: number;
    quantity: number;
}

export function validateOrderItem(item: OrderItemInput): void {
    validateRequired(item.item_id, 'item_id');
    validateRequired(item.name, 'name');
    validateRequired(item.price, 'price');
    validateRequired(item.quantity, 'quantity');

    if (!validateAmount(item.price)) {
        throw new BadRequestError('Invalid item price');
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new BadRequestError('Quantity must be a positive integer');
    }
}

// Order validation
export interface CreateOrderInput {
    vendor_id: string;
    items: OrderItemInput[];
    payment_method: 'rfid' | 'qr' | 'upi';
}

export function validateCreateOrder(input: CreateOrderInput): void {
    validateRequired(input.vendor_id, 'vendor_id');
    validateRequired(input.items, 'items');
    validateRequired(input.payment_method, 'payment_method');

    if (!Array.isArray(input.items) || input.items.length === 0) {
        throw new BadRequestError('Order must contain at least one item');
    }

    input.items.forEach((item, index) => {
        try {
            validateOrderItem(item);
        } catch (error) {
            throw new BadRequestError(`Invalid item at index ${index}: ${(error as Error).message}`);
        }
    });

    if (!['rfid', 'qr', 'upi'].includes(input.payment_method)) {
        throw new BadRequestError('Invalid payment method');
    }
}

// Menu item validation
export interface CreateMenuItemInput {
    vendor_id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image_url?: string;
    available: boolean;
}

export function validateCreateMenuItem(input: CreateMenuItemInput): void {
    validateRequired(input.vendor_id, 'vendor_id');
    validateRequired(input.name, 'name');
    validateRequired(input.price, 'price');
    validateRequired(input.available, 'available');

    if (!validateAmount(input.price)) {
        throw new BadRequestError('Invalid price');
    }

    if (typeof input.available !== 'boolean') {
        throw new BadRequestError('available must be a boolean');
    }
}

// Wallet top-up validation
export interface WalletTopUpInput {
    user_id: string;
    amount: number;
}

export function validateWalletTopUp(input: WalletTopUpInput): void {
    validateRequired(input.user_id, 'user_id');
    validateRequired(input.amount, 'amount');

    if (!validateAmount(input.amount)) {
        throw new BadRequestError('Invalid amount');
    }

    if (input.amount > 10000) {
        throw new BadRequestError('Maximum top-up amount is ₹10,000');
    }
}
