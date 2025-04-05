
import { supabase } from '@/integrations/supabase/client';

// Add functions for managing user profile
export const updateUserProfile = async (
  userId: string, 
  profileData: { name?: string; phone?: string; avatar_url?: string }
): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId);
    
  return !error;
};
