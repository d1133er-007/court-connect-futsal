
import { supabase } from '@/integrations/supabase/client';
import { Court, TimeSlot, mapDbCourt, mapDbTimeSlot } from '@/types';

// Court functions
export const getCourts = async (): Promise<{ data: Court[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('courts')
      .select('*');
      
    if (error) {
      console.error("Supabase error fetching courts:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { 
      data: data ? data.map(mapDbCourt) : [], 
      error: null 
    };
  } catch (error) {
    console.error("Exception fetching courts:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error fetching courts') 
    };
  }
};

export const getCourtById = async (id: string): Promise<Court | null> => {
  try {
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Supabase error fetching court by ID:", error);
      return null;
    }
    
    return data ? mapDbCourt(data) : null;
  } catch (error) {
    console.error("Exception fetching court by ID:", error);
    return null;
  }
};

// Time slot functions
export const getTimeSlotsByCourt = async (courtId: string, date: string): Promise<TimeSlot[]> => {
  try {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;
    
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('court_id', courtId)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);
      
    if (error) {
      console.error("Supabase error fetching time slots:", error);
      throw error;
    }
    
    return data ? data.map(mapDbTimeSlot) : [];
  } catch (error) {
    console.error("Exception fetching time slots:", error);
    return [];
  }
};

// Add a function to create sample time slots for a court
// This is useful for development when you don't have time slots in the database
export const createSampleTimeSlots = async (courtId: string, date: string): Promise<void> => {
  try {
    // Create 8 time slots from 8 AM to 4 PM with 1-hour intervals
    const slots = [];
    const baseDate = new Date(`${date}T08:00:00`);
    
    for (let i = 0; i < 8; i++) {
      const startTime = new Date(baseDate);
      startTime.setHours(baseDate.getHours() + i);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
      
      slots.push({
        court_id: courtId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        is_booked: Math.random() > 0.7 // Randomly mark some slots as booked
      });
    }
    
    const { error } = await supabase
      .from('time_slots')
      .insert(slots);
      
    if (error) {
      console.error("Error creating sample time slots:", error);
    }
  } catch (error) {
    console.error("Exception creating sample time slots:", error);
  }
};
