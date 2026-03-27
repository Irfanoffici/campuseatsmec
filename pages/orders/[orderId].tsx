import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, ChefHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function OrderStatus() {
    const router = useRouter();
    const { orderId } = router.query;
    const { data: order, error } = useSWR(orderId ? `/orders/${orderId}` : null, fetcher, {
        refreshInterval: 5000 // Poll every 5s for updates
    });

    if (!order && !error) return <Layout><div className="flex justify-center py-20">Loading order...</div></Layout>;
    if (error) return <Layout><div className="text-center py-20 text-red-500">Failed to load order</div></Layout>;

    // Status mapping
    const statusSteps = ['pending', 'accepted', 'ready', 'completed'];
    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <Layout title={`Order #${order.id.slice(0, 6)} | CampusEats`}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"
                    >
                        <Check size={40} strokeWidth={3} />
                    </motion.div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent mb-2">
                        Order Placed!
                    </h1>
                    <p className="text-slate-600">Order ID: #{order.id.slice(0, 8).toUpperCase()}</p>
                </div>

                <Card className="p-8 mb-8" hoverEffect={false}>
                    {/* Progress Steps */}
                    <div className="flex justify-between relative mb-12">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -z-10 -translate-y-1/2" />
                        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-1000"
                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />

                        {statusSteps.map((step, i) => {
                            const isCompleted = i <= currentStepIndex;
                            const isCurrent = i === currentStepIndex;

                            return (
                                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {isCompleted ? <Check size={16} /> : <div className="h-2 w-2 rounded-full bg-slate-200" />}
                                    </div>
                                    <span className={`text-xs font-bold uppercase ${isCurrent ? 'text-green-600' : 'text-slate-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Info */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
                            <div>
                                <div className="font-bold text-lg mb-1">{order.vendor?.name || 'Canteen'}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin size={14} /> Main Block
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-500 mb-1">Estimated Time</div>
                                <div className="font-bold text-xl text-slate-900">10-15 min</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="flex gap-2">
                                        <span className="font-bold text-slate-700">{item.quantity}x</span>
                                        {item.menu_item?.name || 'Item'}
                                    </span>
                                    <span className="font-medium text-slate-600">{formatCurrency(item.price)}</span>
                                </div>
                            ))}
                            <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg mt-4">
                                <span>Total Paid</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full" size="lg">I've Arrived at Counter</Button>
                        <Link href="/">
                            <Button variant="ghost" className="w-full">Back to Home</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
