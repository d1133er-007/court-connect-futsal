
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Court, ExtendedBooking, Payment, TimeSlot, User, mapDbBooking, mapDbCourt, mapDbTimeSlot, mapDbUser } from '@/types';

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
};

// Court functions
export const getCourts = async (): Promise<Court[]> => {
  const { data, error } = await supabase
    .from('courts')
    .select('*');
    
  if (error) throw error;
  return data ? data.map(mapDbCourt) : [];
};

export const getCourtById = async (id: string): Promise<Court | null> => {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return data ? mapDbCourt(data) : null;
};

// Time slot functions
export const getTimeSlotsByCourt = async (courtId: string, date: string): Promise<TimeSlot[]> => {
  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;
  
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('court_id', courtId)
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay);
    
  if (error) throw error;
  return data ? data.map(mapDbTimeSlot) : [];
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
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  return data ? mapDbBooking(data) : null;
};

export const getUserBookings = async (userId: string): Promise<ExtendedBooking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      courts:court_id(*),
      time_slots:time_slot_id(*)
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];
  
  return data.map(booking => {
    const mappedBooking = mapDbBooking(booking);
    return {
      ...mappedBooking,
      court: booking.courts ? mapDbCourt(booking.courts) : undefined,
      timeSlot: booking.time_slots ? mapDbTimeSlot(booking.time_slots) : undefined
    };
  });
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
    })
    .select()
    .single();
    
  if (error) return null;
  return data as unknown as Payment;
};

// Admin functions
export const getAllBookings = async (): Promise<ExtendedBooking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles:user_id(*),
      courts:court_id(*),
      time_slots:time_slot_id(*)
    `)
    .order('booking_date', { ascending: false });
    
  if (error) throw error;
  
  if (!data) return [];
  
  return data.map(booking => {
    const mappedBooking = mapDbBooking(booking);
    return {
      ...mappedBooking,
      court: booking.courts ? mapDbCourt(booking.courts) : undefined,
      timeSlot: booking.time_slots ? mapDbTimeSlot(booking.time_slots) : undefined,
      user: booking.profiles ? mapDbUser(booking.profiles) : undefined
    };
  });
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
