
import { createClient } from '@supabase/supabase-js';
import { Booking, Court, Payment, TimeSlot, User } from '@/types';

// Note: In a real implementation, these would come from environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'player',
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
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  
  // Fetch additional user data from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (!profile) return null;
  
  return {
    id: data.user.id,
    email: data.user.email!,
    name: profile.name,
    role: profile.role,
    phone: profile.phone,
    avatarUrl: profile.avatar_url,
  };
};

// Court functions
export const getCourts = async (): Promise<Court[]> => {
  const { data, error } = await supabase
    .from('courts')
    .select('*');
    
  if (error) throw error;
  return data || [];
};

export const getCourtById = async (id: string): Promise<Court | null> => {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return data;
};

// Time slot functions
export const getTimeSlotsByCourt = async (courtId: string, date: string): Promise<TimeSlot[]> => {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('court_id', courtId)
    .gte('start_time', `${date}T00:00:00`)
    .lte('start_time', `${date}T23:59:59`);
    
  if (error) throw error;
  return data || [];
};

// Booking functions
export const createBooking = async (
  userId: string,
  courtId: string,
  timeSlotId: string,
  bookingDate: string
): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      court_id: courtId,
      time_slot_id: timeSlotId,
      booking_date: bookingDate,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  if (error) return null;
  return data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      courts:court_id(name, location, price_per_hour),
      time_slots:time_slot_id(start_time, end_time)
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

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
      currency: 'USD',
      status: 'pending',
      payment_method: 'card',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  if (error) return null;
  return data;
};

// Admin functions
export const getAllBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users:user_id(email, name),
      courts:court_id(name, location),
      time_slots:time_slot_id(start_time, end_time),
      payments(status, amount)
    `)
    .order('booking_date', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'canceled'
): Promise<boolean> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);
    
  return !error;
};
