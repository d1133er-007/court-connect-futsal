
import { useState, useEffect } from 'react';
import { PriorityLevel, Task } from '@/types/tasks';
import { useTaskOperations } from './useTaskOperations';
import { useTaskFilters } from './useTaskFilters';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useTasks = () => {
  const {
    tasks,
    loading,
    error,
    isRefreshing,
    fetchTasks,
    addTask,
    updateTaskItem,
    removeTask,
    setupRealtimeSubscription
  } = useTaskOperations();

  const { filterTasks } = useTaskFilters();
  const { user } = useAuth();
  const { toast } = useToast();

  // Setup effect for initial data load and real-time subscription
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view and manage your tasks",
        variant: "destructive"
      });
      return; // Don't set up subscription if not logged in
    }

    // Fetch initial data
    fetchTasks();

    // Set up real-time subscription
    const unsubscribe = setupRealtimeSubscription();

    return () => {
      unsubscribe();
    };
  }, [fetchTasks, setupRealtimeSubscription, user, toast]);

  return {
    tasks,
    loading,
    error,
    isRefreshing,
    fetchTasks,
    addTask,
    updateTaskItem,
    removeTask,
    filterTasks
  };
};
