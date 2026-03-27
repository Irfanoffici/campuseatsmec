import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function truncate(str: string, length: number) {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export const glassClass = "bg-white/70 backdrop-blur-md border border-white/20 shadow-soft";
export const glassDarkClass = "bg-black/70 backdrop-blur-md border border-white/10 shadow-soft";
