// Supabase Configuration and Initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined',
    },
});

// User roles enum
export enum UserRole {
    STUDENT = 'student',
    VENDOR = 'vendor',
    ADMIN = 'admin',
}

// Authentication helper functions
export const authHelpers = {
    // Sign up with email and password
    signUp: async (email: string, password: string, userData: { name: string; role: UserRole }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: userData.name,
                    role: userData.role,
                },
            },
        });
        return { data, error };
    },

    // Sign in with email and password
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    // Get user role
    getUserRole: async (): Promise<UserRole | null> => {
        const { user } = await authHelpers.getCurrentUser();
        return user?.user_metadata?.role || null;
    },

    // Check if user has specific role
    hasRole: async (role: UserRole): Promise<boolean> => {
        const userRole = await authHelpers.getUserRole();
        return userRole === role;
    },
};
