import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

// Combine motion props with standard button props
// We omit 'className' from HTMLMotionProps because we defined it in the props destructuring
type ButtonProps = HTMLMotionProps<"button"> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 disabled:pointer-events-none disabled:opacity-50 select-none";

        const variants = {
            primary: "bg-peach-500 text-white hover:bg-peach-600 shadow-md hover:shadow-lg",
            secondary: "bg-sage-100 text-sage-800 hover:bg-sage-200",
            outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
            ghost: "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
            danger: "bg-red-500 text-white hover:bg-red-600",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-6 text-base",
            lg: "h-14 px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {children as React.ReactNode}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
