import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CreditCard, Wallet, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Cart() {
    const { items, removeItem, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const subtotal = total();
    const tax = subtotal * 0.05; // 5% tax
    const finalTotal = subtotal + tax;

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);

        try {
            // Group by vendor (though UI prevents multi-vendor, safeguards here)
            const vendorId = items[0].vendorId;

            const orderData = {
                vendorId,
                items: items.map(i => ({
                    menuItemId: i.id,
                    quantity: i.qty,
                    notes: '' // Add notes UI later
                })),
                paymentMethod: 'rfid_wallet' // Default for now
            };

            const { data } = await api.post('/orders', orderData);

            toast.success('Order placed successfully!');
            clearCart();
            router.push(`/orders/${data.id}`); // We need to create this page

        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Layout title="Cart | CampusEats">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={48} className="text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
                    <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything yet. Go ahead and explore top restaurants.</p>
                    <Link href="/">
                        <Button size="lg">Explore Restaurants</Button>
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout title="Cart | CampusEats">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-4 flex gap-4 items-center" hoverEffect={false}>
                                    <div className="h-20 w-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">IMG</div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-slate-500">{item.vendorName}</p>
                                        <p className="font-bold text-peach-600 mt-1">{formatCurrency(item.price * item.qty)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold">
                                            x{item.qty}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm flex items-center gap-2 border border-blue-100">
                        <span className="font-bold">Note:</span>
                        Ordering from {items[0]?.vendorName}.
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24" hoverEffect={false} variant="glass">
                        <h2 className="text-xl font-bold mb-6">Payment Details</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax (5%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>

                            <div className="flex gap-3">
                                <button className="flex-1 p-3 rounded-xl border-2 border-peach-500 bg-peach-50 text-peach-700 font-bold text-sm flex flex-col items-center gap-2">
                                    <CreditCard size={20} />
                                    RFID Card
                                </button>
                                <button disabled className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-slate-400 font-medium text-sm flex flex-col items-center gap-2 opacity-60 cursor-not-allowed">
                                    <Wallet size={20} />
                                    UPI (Soon)
                                </button>
                            </div>

                            <div className="text-xs text-center text-slate-500 mt-2">
                                Available Wallet Balance: <span className="font-bold text-green-600">₹850</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full shadow-peach-300/50 shadow-lg"
                            onClick={handleCheckout}
                            isLoading={loading}
                        >
                            Place Order <ArrowRight className="ml-2" />
                        </Button>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
