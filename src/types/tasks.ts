
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  priority: PriorityLevel;
  dueDate?: Date;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
