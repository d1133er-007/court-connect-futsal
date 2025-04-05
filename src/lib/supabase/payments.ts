
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '@/types';

// Payment functions
export const createPayment = async (
  bookingId: string,
  userId: string,
  amount: number
): Promise<Payment | null> => {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      user_id: userId,
      amount,
      currency: 'NPR',
      status: 'pending',
      payment_method: 'card',
    })
    .select()
    .single();
    
  if (error) return null;
  return data as unknown as Payment;
};

// Add function to get user payments
export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as unknown as Payment[] || [];
};
