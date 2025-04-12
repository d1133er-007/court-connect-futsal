
import { useCallback } from 'react';
import { TaskFormValues } from '@/types/tasks';
import { createTask, updateTask, deleteTask } from '@/lib/supabase/tasks';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useTaskMutations = () => {
  const { toast } = useToast();
  const { user } = useAuth();

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

  return {
    addTask,
    updateTaskItem,
    removeTask
  };
};
