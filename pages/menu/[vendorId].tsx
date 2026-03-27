import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Star, ChefHat } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { useCart } from '@/lib/hooks/useCart';

type MenuItem = {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    is_vegetarian: boolean;
    category: string;
    rating?: number;
};

// Loading Skeleton
const MenuSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
    </div>
);

export default function VendorMenu() {
    const router = useRouter();
    const { vendorId } = router.query;
    const { addItem, updateQty, items: cartItems } = useCart();
    const [activeCategory, setActiveCategory] = useState("All");

    const { data: vendor, error: vendorError } = useSWR(vendorId ? `/vendors/${vendorId}` : null, fetcher);
    // Corrected API endpoint for menu
    const { data: menuData, error: menuError } = useSWR(vendorId ? `/menu/${vendorId}` : null, fetcher);

    // Now that fetcher returns res.data directly, and our API returns { success: true, data: { menuItems: [] } }
    // We access it as menuData?.data?.menuItems
    const menuItems: MenuItem[] = menuData?.data?.menuItems || [];
    const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

    const filteredItems = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const getCartQty = (id: string) => cartItems.find(i => i.id === id)?.qty || 0;

    if (vendorError || menuError) return <Layout><div className="text-center py-20">Failed to load menu</div></Layout>;

    return (
        <Layout>
            {/* Vendor Header */}
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-8 shadow-md">
                {vendor ? (
                    <>
                        <img src={vendor.data?.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{vendor.data?.name}</h1>
                            <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                                <span className="flex items-center gap-1"><Star size={16} className="text-orange-400" fill="currentColor" /> 4.5</span>
                                <span className="flex items-center gap-1"><ChefHat size={16} /> Campus Classic</span>
                            </div>
                        </div>
                    </>
                ) : <div className="w-full h-full bg-slate-200 animate-pulse" />}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Category Nav - Sticky */}
                <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 overflow-x-auto pb-4 lg:pb-0">
                    <div className="flex lg:flex-col gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left",
                                    activeCategory === cat
                                        ? "bg-peach-500 text-white shadow-md"
                                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="flex-1 w-full">
                    {!menuData ? <MenuSkeleton /> : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredItems.map((item) => {
                                const qty = getCartQty(item.id);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                    >
                                        <Card className={cn("p-4 flex gap-4 h-full", qty > 0 ? "border-peach-200 ring-1 ring-peach-100" : "")} hoverEffect={false}>
                                            <div className="h-24 w-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                {item.is_vegetarian ?
                                                    <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full p-0.5 border border-green-600 shadow-sm flex items-center justify-center">
                                                        <div className="h-2 w-2 rounded-full bg-green-600" />
                                                    </div> :
                                                    <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full p-0.5 border border-red-600 shadow-sm flex items-center justify-center">
                                                        <div className="h-2 w-2 rounded-full bg-red-600" />
                                                    </div>
                                                }
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                                                </div>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div className="font-bold text-lg">{formatCurrency(item.price)}</div>
                                                    {qty === 0 ? (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 px-4 rounded-lg bg-slate-50 text-peach-600 hover:bg-peach-50 border border-slate-200"
                                                            onClick={() => addItem({
                                                                id: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                                qty: 1,
                                                                vendorId: vendorId as string,
                                                                vendorName: vendor?.data?.name || "Vendor"
                                                            })}
                                                        >
                                                            ADD
                                                        </Button>
                                                    ) : (
                                                        <div className="flex items-center gap-3 bg-peach-50 px-2 py-1 rounded-lg border border-peach-100">
                                                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-peach-700 disabled:opacity-50">
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="font-bold text-sm min-w-[1ch] text-center">{qty}</span>
                                                            <button onClick={() => addItem({
                                                                id: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                                qty: 1,
                                                                vendorId: vendorId as string,
                                                                vendorName: vendor?.data?.name || "Vendor"
                                                            })} className="p-1 hover:text-peach-700">
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Cart Button */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-20 md:bottom-8 left-0 right-0 z-40 px-6 flex justify-center"
                    >
                        <Button
                            onClick={() => router.push('/cart')}
                            size="lg"
                            className="shadow-2xl shadow-peach-500/40 bg-slate-900 text-white hover:bg-slate-800 w-full max-w-md rounded-2xl flex justify-between items-center py-4 px-6 h-16 border border-white/10"
                        >
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{cartItems.length} Items</span>
                                <span className="font-bold text-lg">View Cart</span>
                            </div>
                            <div className="flex items-center gap-3 font-bold text-lg">
                                {formatCurrency(cartItems.reduce((acc, i) => acc + i.price * i.qty, 0))} <ShoppingBag className="text-peach-400" />
                            </div>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
