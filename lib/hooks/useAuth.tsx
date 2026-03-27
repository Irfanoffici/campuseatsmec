import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { api } from '@/lib/api-client';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userDetails: any | null;
    isLoading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userDetails, setUserDetails] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchUserDetails(session.user.id);
            setIsLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserDetails(session.user.id);
            } else {
                setUserDetails(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserDetails = async (userId: string) => {
        try {
            const { data } = await api.get('/auth/me');
            setUserDetails(data.user);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const signIn = async (email: string) => {
        // Implement sign in logic wrapper if needed
    };

    return (
        <AuthContext.Provider value={{ user, session, userDetails, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
