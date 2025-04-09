
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormValues, Project } from '@/types/tasks';

// Task functions
export const getTasks = async (): Promise<{ data: Task[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Supabase error fetching tasks:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { 
      data: data as Task[] || [], 
      error: null 
    };
  } catch (error) {
    console.error("Exception fetching tasks:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error fetching tasks') 
    };
  }
};

export const createTask = async (
  userId: string,
  task: TaskFormValues
): Promise<{ data: Task | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: task.title,
        description: task.description || null,
        priority: task.priority,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        completed: false
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating task:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data: data as Task, error: null };
  } catch (error) {
    console.error("Exception creating task:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error creating task') 
    };
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<TaskFormValues & { completed?: boolean }>
): Promise<{ data: Task | null; error: Error | null }> => {
  try {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString();
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating task:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data: data as Task, error: null };
  } catch (error) {
    console.error("Exception updating task:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error updating task') 
    };
  }
};

export const deleteTask = async (taskId: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) {
      console.error("Error deleting task:", error);
      return { success: false, error: new Error(error.message) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception deleting task:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error deleting task') 
    };
  }
};

// Project functions
export const getProjects = async (): Promise<{ data: Project[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Supabase error fetching projects:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { 
      data: data as Project[] || [], 
      error: null 
    };
  } catch (error) {
    console.error("Exception fetching projects:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error fetching projects') 
    };
  }
};

export const createProject = async (
  userId: string,
  name: string,
  description?: string
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name,
        description: description || null
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating project:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data: data as Project, error: null };
  } catch (error) {
    console.error("Exception creating project:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error creating project') 
    };
  }
};
