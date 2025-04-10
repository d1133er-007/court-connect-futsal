
import { useState, useCallback } from 'react';
import { Task, TaskFormValues } from '@/types/tasks';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/supabase/tasks';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useTaskOperations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const addTask = useCallback(async (taskData: TaskFormValues): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await createTask(user.id, taskData);
      
      if (error) {
        console.error('Error adding task:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create task",
          variant: "destructive",
        });
        return false;
      }
      
      if (data) {
        // Let the real-time subscription handle adding the task
        toast({
          title: "Success",
          description: "Task created successfully!",
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error in addTask:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const updateTaskItem = useCallback(async (
    taskId: string, 
    updates: Partial<TaskFormValues & { completed?: boolean }>
  ): Promise<boolean> => {
    try {
      const { data, error } = await updateTask(taskId, updates);
      
      if (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update task",
          variant: "destructive",
        });
        return false;
      }
      
      if (data) {
        // Let the real-time subscription handle updating the task
        const message = updates.completed !== undefined
          ? `Task marked as ${updates.completed ? 'completed' : 'incomplete'}`
          : "Task updated successfully!";
          
        toast({ title: "Success", description: message });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error in updateTaskItem:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const removeTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      const { success, error } = await deleteTask(taskId);
      
      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete task",
          variant: "destructive",
        });
        return false;
      }
      
      if (success) {
        // Let the real-time subscription handle removing the task
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error in removeTask:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Set up real-time subscription
  const setupRealtimeSubscription = useCallback(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' }, 
        () => {
          // Just refetch all tasks when any change happens
          fetchTasks(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    isRefreshing,
    fetchTasks,
    addTask,
    updateTaskItem,
    removeTask,
    setupRealtimeSubscription
  };
};
