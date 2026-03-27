import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/api-client';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps, router }: AppProps) {
    return (
        <div className={inter.className}>
            <SWRConfig value={{ fetcher }}>
                <AuthProvider>
                    <AnimatePresence mode="wait" initial={false}>
                        <Component {...pageProps} key={router.asPath} />
                    </AnimatePresence>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            className: '!bg-white/80 !backdrop-blur-md !border !border-white/20 !shadow-soft !rounded-2xl !text-slate-800',
                            duration: 3000,
                        }}
                    />
                </AuthProvider>
            </SWRConfig>
        </div>
    );
}
