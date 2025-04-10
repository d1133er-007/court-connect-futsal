
import { Database } from './types';

// Define custom type for the tables we created
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Define specific table types
export type TasksInsert = TablesInsert<'tasks'>;
export type TasksRow = TablesRow<'tasks'>;

export type ProjectsInsert = TablesInsert<'projects'>;
export type ProjectsRow = TablesRow<'projects'>;
