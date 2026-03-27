import Head from 'next/head';
import { Navigation } from './Navigation';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export function Layout({ children, title = 'CampusEats MEC', className }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Premium food ordering for MEC campus" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen pb-24 md:pb-0 bg-cream-50 selection:bg-peach-200 selection:text-peach-900">
                <Navigation />

                <main className={className}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mx-auto max-w-7xl px-4 md:px-6 py-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </>
    );
}
