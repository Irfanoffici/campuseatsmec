import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, MapPin, ChefHat } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';

// Mock Categories (Static is fine for now, or fetch from DB if we had categories table)
const CATEGORIES = [
    { id: '1', name: 'All', icon: '🍽️' },
    { id: '2', name: 'South', icon: '🥞' },
    { id: '3', name: 'Chinese', icon: '🍜' },
    { id: '4', name: 'Snacks', icon: '🥪' },
    { id: '5', name: 'Juices', icon: '🥤' },
    { id: '6', name: 'Biryani', icon: '🍚' },
];

export default function Home() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, 100]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    // Fetch vendors from API
    const { data: vendorsData, error } = useSWR('/vendors', fetcher);
    const loading = !vendorsData && !error;
    const vendors = vendorsData?.data?.vendors || [];

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative mb-12 mt-4 md:mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="z-10"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-peach-100 text-peach-700 text-sm font-semibold mb-4 border border-peach-200">
                            Campus Exclusive 🎓
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance mb-6">
                            Skip the Queue, <br />
                            <span className="text-peach-500">Taste the Food.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-md">
                            Order from your favorite campus canteens and pick up when ready. No waiting, just eating.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="shadow-peach-300/50 shadow-lg">
                                Order Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="ghost">
                                View Menu
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y: y1, opacity }}
                        className="relative hidden md:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-peach-200 to-mint-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <Card className="p-4 rotate-[-6deg] translate-y-8" hoverEffect={false}>
                                <div className="h-32 w-full bg-slate-100 rounded-2xl mb-4 relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" alt="Burger" className="object-cover w-full h-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-bold">Cheese Burger</div>
                                    <div className="text-peach-600 font-bold">₹120</div>
                                </div>
                            </Card>
                            <Card className="p-4 rotate-[12deg] translate-x-4" hoverEffect={false}>
                                <div className="h-32 w-full bg-slate-100 rounded-2xl mb-4 relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=60" alt="Pasta" className="object-cover w-full h-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="font-bold">Creamy Pasta</div>
                                    <div className="text-peach-600 font-bold">₹150</div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">What's on your mind?</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {CATEGORIES.map((cat, i) => (
                        <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center gap-3 min-w-[80px] group"
                        >
                            <div className="h-20 w-20 rounded-full bg-white border border-slate-100 shadow-soft flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-soft-lg transition-all duration-300">
                                {cat.icon}
                            </div>
                            <span className="font-medium text-sm text-slate-700 group-hover:text-peach-600 transition-colors">
                                {cat.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Popular Venues */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Popular Spots</h2>
                    <Link href="/vendors" className="text-peach-600 font-medium hover:underline text-sm md:text-base">
                        See all
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors.map((vendor: any) => (
                            <Link key={vendor.vendor_id} href={`/menu/${vendor.vendor_id}`}>
                                <Card className="h-full group" hoverEffect>
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/0 transition-colors" />
                                        <img
                                            src={vendor.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000'} // Fallback image
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
                                        <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                            15-20 min { /* Dynamic time not in DB yet */}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-peach-600 transition-colors">
                                                {vendor.name}
                                            </h3>
                                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                                                4.5 <Star size={12} fill="currentColor" />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {/* Tags mocked mostly, or could be in DB */}
                                            {['Meals', 'Snacks'].map(tag => (
                                                <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-slate-400 text-xs font-medium border-t border-slate-100 pt-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} /> MEC Campus
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ChefHat size={14} /> {vendor.description || 'Live Kitchen'}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}
