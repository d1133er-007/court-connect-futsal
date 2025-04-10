
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/tasks';

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
    
    // Map database fields to our Project interface
    const mappedData = data ? data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      description: item.description || undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) : [];
    
    return { 
      data: mappedData as Project[], 
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
    
    // Map database fields to our Project interface
    const mappedData = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: mappedData as Project, error: null };
  } catch (error) {
    console.error("Exception creating project:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error creating project') 
    };
  }
};

export const updateProject = async (
  projectId: string,
  updates: { name?: string; description?: string }
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const updateData: Record<string, any> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating project:", error);
      return { data: null, error: new Error(error.message) };
    }
    
    // Map database fields to our Project interface
    const mappedData = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: mappedData as Project, error: null };
  } catch (error) {
    console.error("Exception updating project:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error updating project') 
    };
  }
};

export const deleteProject = async (projectId: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (error) {
      console.error("Error deleting project:", error);
      return { success: false, error: new Error(error.message) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception deleting project:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error deleting project') 
    };
  }
};
