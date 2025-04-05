
import { supabase } from '@/integrations/supabase/client';
import { Booking, ExtendedBooking, Payment, mapDbBooking, mapDbCourt, mapDbTimeSlot, mapDbUser } from '@/types';

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

// Add function to cancel a booking
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'canceled' })
    .eq('id', bookingId);
    
  return !error;
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
