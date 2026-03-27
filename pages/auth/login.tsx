import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'vendor' | 'admin'>('student');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Ideally we check if role matches or update user metadata if needed, 
            // but for now we trust the login and redirect based on role or home
            toast.success(`Welcome back!`);
            router.push('/');

        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex flex-col justify-center py-12 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-peach-500 to-peach-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-600">Sign in to order your favorite campus meals</p>
                </div>

                <Card className="p-8 shadow-soft-lg" variant="glass" hoverEffect={false}>
                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-100/50 rounded-xl mb-8">
                        {(['student', 'vendor', 'admin'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${role === r
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                            <Input
                                type="email"
                                placeholder="student@mec.ac.in"
                                icon={<Mail size={18} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={18} />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-slate-600">
                                <input type="checkbox" className="mr-2 rounded border-slate-300 text-peach-500 focus:ring-peach-400" />
                                Remember me
                            </label>
                            <a href="#" className="font-medium text-peach-600 hover:text-peach-500">
                                Forgot password?
                            </a>
                        </div>

                        <Button className="w-full" size="lg" isLoading={isLoading}>
                            Sign in <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="font-bold text-peach-600 hover:text-peach-500">
                            Create account
                        </Link>
                    </div>
                </Card>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-peach-200 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-mint-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
            </motion.div>
        </div>
    );
}
