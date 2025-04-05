
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
