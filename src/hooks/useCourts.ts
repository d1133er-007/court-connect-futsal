
import { useState, useCallback } from 'react';
import { Court } from '@/types';
import { getCourts } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useCourts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchCourts = useCallback(async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error } = await getCourts();
      
      if (error) {
        console.error('Error fetching courts:', error);
        setError(error.message || 'Failed to load courts. Please try again.');
        setCourts([]);
        
        toast({
          title: "Error",
          description: "Failed to load courts. Please try again.",
          variant: "destructive",
        });
      } else {
        setCourts(data || []);
        
        if (showRefreshAnimation) {
          toast({
            title: "Success",
            description: "Courts refreshed successfully!",
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error in fetchCourts:', err);
      setError('An unexpected error occurred. Please try again.');
      setCourts([]);
      
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
    courts,
    loading,
    error,
    isRefreshing,
    fetchCourts
  };
};
