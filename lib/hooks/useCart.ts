import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // menuItemId
    name: string;
    price: number;
    qty: number;
    vendorId: string;
    vendorName: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateQty: (itemId: string, delta: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items;
                const existing = items.find((i) => i.id === newItem.id);

                // Prevent adding items from multiple vendors for now (simple logic)
                if (items.length > 0 && items[0].vendorId !== newItem.vendorId) {
                    if (!confirm("Start a new cart? You can only order from one vendor at a time.")) return;
                    set({ items: [newItem] });
                    return;
                }

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.id === newItem.id ? { ...i, qty: i.qty + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...items, { ...newItem, qty: 1 }] });
                }
            },
            removeItem: (id) =>
                set({ items: get().items.filter((i) => i.id !== id) }),
            updateQty: (id, delta) => {
                const items = get().items.map((i) => {
                    if (i.id === id) {
                        const newQty = Math.max(0, i.qty + delta);
                        return { ...i, qty: newQty };
                    }
                    return i;
                });
                set({ items: items.filter((i) => i.qty > 0) });
            },
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
        }),
        {
            name: 'campus-eats-cart',
        }
    )
);
