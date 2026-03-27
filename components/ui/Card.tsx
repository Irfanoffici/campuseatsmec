import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'flat';
    hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hoverEffect = true, children, ...props }, ref) => {

        const variants = {
            default: "bg-white border border-slate-100 shadow-soft",
            glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-soft",
            flat: "bg-slate-50 border-none",
        };

        return (
            <motion.div
                ref={ref}
                initial={hoverEffect ? { y: 0 } : undefined}
                whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn("rounded-3xl overflow-hidden", variants[variant], className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export { Card };
