
import { supabase } from '@/integrations/supabase/client';
import { User, mapDbUser } from '@/types';

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return null;
    
    // Fetch additional user data from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profileError || !profile) return null;
    
    return mapDbUser(profile);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Add function to request password reset
export const requestPasswordReset = async (email: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });
  
  return { error };
};

// Add function to reset password with recovery token
export const resetPassword = async (newPassword: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  return { error };
};
