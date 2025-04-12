
import { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { getTasks } from '@/lib/supabase/tasks';
import { useToast } from '@/hooks/use-toast';

export const useTaskFetching = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchTasks = useCallback(async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error } = await getTasks();
      
      if (error) {
        console.error('Error fetching tasks:', error);
        setError(error.message || 'Failed to load tasks. Please try again.');
        setTasks([]);
        
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } else {
        setTasks(data || []);
        
        if (showRefreshAnimation) {
          toast({
            title: "Success",
            description: "Tasks refreshed successfully!",
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error in fetchTasks:', err);
      setError('An unexpected error occurred. Please try again.');
      setTasks([]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (showRefreshAnimation) {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  }, [toast]);

  return {
    tasks,
    setTasks, // Expose for other hooks
    loading,
    error,
    isRefreshing,
    fetchTasks
  };
};
