import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { api } from '@/lib/api-client';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function Signup() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rfid_uid: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/signup', {
                email: form.email,
                password: form.password,
                name: `${form.firstName} ${form.lastName}`,
                role: 'student', // Default to student
                rfid_uid: form.rfid_uid || undefined,
            });

            toast.success('Account created! Please log in.');
            router.push('/auth/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Signup failed');
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
                    <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                    <p className="text-slate-600">Join CampusEats and start ordering</p>
                </div>

                <Card className="p-8 shadow-soft-lg" variant="glass" hoverEffect={false}>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                <Input
                                    placeholder="John"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                <Input
                                    placeholder="Doe"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                            <Input
                                type="email"
                                placeholder="student@mec.ac.in"
                                icon={<Mail size={18} />}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">RFID Tag (Optional)</label>
                            <Input
                                type="text"
                                placeholder="ABC12345"
                                icon={<CreditCard size={18} />}
                                value={form.rfid_uid}
                                onChange={(e) => setForm({ ...form, rfid_uid: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={18} />}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button className="w-full mt-4" size="lg" isLoading={isLoading}>
                            Sign up <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-bold text-peach-600 hover:text-peach-500">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
