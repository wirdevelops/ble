'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: 'user' | 'admin';
  hasTalentProfile: boolean;
  hasPostedEvent: boolean;
  isVolunteer: boolean;
  bio?: string;
  location?: string;
  skills?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Supabase client
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.display_name || profile.full_name || 'Anonymous',
              email: profile.email || session.user.email || '',
              image: profile.avatar_url || '',
              role: profile.role || 'user',
              hasTalentProfile: false, // You can add these to your profile table
              hasPostedEvent: false,
              isVolunteer: false,
              bio: profile.bio,
              location: null,
              skills: [],
              socialLinks: {}
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/auth/signin');
      } else if (event === 'SIGNED_IN' && session) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profile) {
          setUser({
            id: session.user.id,
            name: profile.display_name || profile.full_name || 'Anonymous',
            email: profile.email || session.user.email || '',
            image: profile.avatar_url || '',
            role: profile.role || 'user',
            hasTalentProfile: false,
            hasPostedEvent: false,
            isVolunteer: false,
            bio: profile.bio,
            location: null,
            skills: [],
            socialLinks: {}
          });
        }
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      isLoading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock user data for testing (you can remove this in production)
export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  image: 'https://avatars.githubusercontent.com/u/1234567?v=4',
  role: 'user',
  hasTalentProfile: true,
  hasPostedEvent: true,
  isVolunteer: true,
  bio: 'I am a test user',
  location: 'Bamenda, Cameroon',
  skills: ['React', 'TypeScript', 'Node.js'],
  socialLinks: {
    twitter: 'https://twitter.com/test',
    linkedin: 'https://linkedin.com/in/test'
  }
};
