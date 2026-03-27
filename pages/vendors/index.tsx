import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';

export default function Vendors() {
    const [search, setSearch] = useState('');

    // Fetch real vendors
    const { data: vendorsData } = useSWR('/vendors', fetcher);
    const vendors = vendorsData?.data?.vendors || [];

    const filteredVendors = vendors.filter((v: any) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout title="Restaurants | CampusEats">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">All Restaurants</h1>
                    <p className="text-slate-600">Find the best food on campus</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search restaurants..."
                        icon={<Search size={18} />}
                        className="w-full md:w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor: any, i: number) => (
                    <Link key={vendor.vendor_id || vendor.id} href={`/menu/${vendor.vendor_id || vendor.id}`}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="h-full group hover:shadow-lg transition-all duration-300" hoverEffect={false}>
                                <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                                    <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/0 transition-colors" />
                                    <img
                                        src={vendor.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000'}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {vendor.availability_status !== 'open' && (
                                        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded-lg uppercase tracking-wider">
                                                {vendor.availability_status}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                        <Star size={12} className="text-orange-500" fill="currentColor" /> {vendor.rating || 4.5}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold group-hover:text-peach-600 transition-colors">
                                            {vendor.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1"><Clock size={14} /> 15-20 min</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> MEC Campus</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {/* Mock tags for now as they aren't in simple schema */}
                                        {['Meals', 'Snacks'].map(tag => (
                                            <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </Layout>
    );
}
