
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';
import { getCurrentUser, signIn, signOut, signUp } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error } = await signUp(email, password, name);
      if (error) throw error;
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      toast({
        title: 'Welcome back!',
        description: `You are now signed in as ${currentUser?.name}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
