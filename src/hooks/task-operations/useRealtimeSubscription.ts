
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSubscription = (onTaskChange: () => void) => {
  const setupRealtimeSubscription = useCallback(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        () => {
          // Just refetch all tasks when any change happens
          onTaskChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onTaskChange]);

  return { setupRealtimeSubscription };
};
