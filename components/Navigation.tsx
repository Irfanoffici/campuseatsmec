import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

export function Navigation() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const links = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/vendors', label: 'Restaurants', icon: Menu },
        { href: '/cart', label: 'Cart', icon: ShoppingBag },
    ];

    if (user) {
        links.push({ href: '/profile', label: 'Profile', icon: User });
    }

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
                <nav className="mx-4 mb-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-soft-lg p-2 flex justify-between items-center ring-1 ring-slate-900/5">
                    {links.map((link) => {
                        const isActive = router.pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link key={link.href} href={link.href} className="flex-1">
                                <div className="relative flex flex-col items-center justify-center py-2 h-14">
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-x-2 inset-y-1 bg-peach-100/50 rounded-2xl -z-10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <Icon
                                        size={24}
                                        className={cn(
                                            "transition-colors duration-200 stroke-[2px]",
                                            isActive ? "text-peach-600" : "text-slate-400"
                                        )}
                                    />
                                    <span className={cn(
                                        "text-[10px] font-bold mt-0.5 transition-colors duration-200",
                                        isActive ? "text-peach-600" : "text-slate-400"
                                    )}>
                                        {link.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Desktop Top Navigation */}
            <div className="hidden md:block sticky top-0 z-50 w-full transition-all duration-300">
                <nav className="mx-auto max-w-7xl px-6 py-4">
                    <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm px-6 py-3 flex justify-between items-center ring-1 ring-slate-900/5">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-gradient-to-tr from-peach-400 to-peach-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-peach-500/30 group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                                Campus<span className="text-peach-600">Eats</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-1">
                            {links.map((link) => {
                                const isActive = router.pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href} className="relative px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <span className={cn(
                                            "font-bold text-sm transition-colors",
                                            isActive ? "text-peach-600" : "text-slate-600 group-hover:text-slate-900"
                                        )}>
                                            {link.label}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                className="absolute bottom-1.5 left-5 right-5 h-0.5 bg-peach-500 rounded-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-9 pr-4 py-2 rounded-full bg-slate-100 border-none text-sm font-medium focus:ring-2 focus:ring-peach-400 w-48 transition-all focus:w-64"
                                />
                            </div>

                            {user ? (
                                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-xs text-slate-500 font-bold">Balance</div>
                                        <div className="text-sm font-bold text-green-600">₹850</div>
                                    </div>
                                    <button className="h-10 w-10 rounded-full bg-peach-100 border-2 border-white shadow-sm flex items-center justify-center text-peach-700 font-bold hover:scale-105 transition-transform">
                                        {user.email?.[0].toUpperCase()}
                                    </button>
                                    <button onClick={() => signOut()} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="pl-4">
                                    <span className="font-bold text-sm text-peach-600 hover:underline">Log in</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
