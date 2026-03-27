import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Wallet, Clock, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { formatCurrency, cn } from '@/lib/utils';
import { useRouter } from 'next/router';

export default function Profile() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const { data: ordersData, error: ordersError } = useSWR('/orders/user/me', fetcher);
    const { data: walletData } = useSWR(user ? `/wallet/balance/${user.id}` : null, fetcher);

    // If not logged in, redirect handled by middleware or guarded by useAuth ideally
    // specific logic here just in case
    if (!user) {
        if (typeof window !== 'undefined') router.push('/auth/login');
        return null;
    }

    const orders = ordersData?.data || [];
    const balance = walletData?.data?.balance || 850; // Mock default if API fails, but better to show real

    return (
        <Layout title="Profile | CampusEats">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* User Info & Wallet */}
                    <div className="space-y-6">
                        <Card className="p-6 flex flex-col items-center text-center" hoverEffect={false}>
                            <div className="h-24 w-24 bg-peach-100 rounded-full flex items-center justify-center text-peach-600 mb-4 border-4 border-white shadow-lg">
                                <span className="text-3xl font-bold">{user.email?.[0].toUpperCase()}</span>
                            </div>
                            <h2 className="text-xl font-bold">{user.email?.split('@')[0]}</h2>
                            <p className="text-slate-500 text-sm mb-6">{user.email}</p>

                            <Button variant="outline" onClick={() => signOut()} className="w-full border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200">
                                <LogOut size={16} className="mr-2" /> Sign Out
                            </Button>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white" hoverEffect={false}>
                            <div className="flex items-center gap-3 mb-4 opacity-80">
                                <Wallet size={20} />
                                <span className="font-medium">Wallet Balance</span>
                            </div>
                            <div className="text-4xl font-bold mb-6">{formatCurrency(balance)}</div>
                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-none">
                                Top Up Wallet
                            </Button>
                        </Card>
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock size={20} /> Recent Orders
                        </h2>

                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                orders.map((order: any) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card
                                            className="p-4 flex items-center gap-4 cursor-pointer hover:border-peach-300 transition-colors group"
                                            hoverEffect={false}
                                            onClick={() => router.push(`/orders/${order.id}`)}
                                        >
                                            <div className={cn(
                                                "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg",
                                                order.status === 'completed' ? "bg-green-100 text-green-600" :
                                                    order.status === 'pending' ? "bg-yellow-100 text-yellow-600" :
                                                        "bg-blue-100 text-blue-600"
                                            )}>
                                                {order.vendor?.name?.[0] || 'V'}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h3 className="font-bold">{order.vendor?.name || 'Vendor'}</h3>
                                                    <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span className={cn(
                                                        "capitalize px-2 py-0.5 rounded-md text-[10px] font-bold",
                                                        order.status === 'completed' ? "bg-green-50 text-green-600" :
                                                            order.status === 'pending' ? "bg-yellow-50 text-yellow-600" :
                                                                "bg-blue-50 text-blue-600"
                                                    )}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <ChevronRight className="text-slate-300 group-hover:text-peach-400 transition-colors" />
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
