
import { useCallback } from 'react';
import { Task, TaskFormValues } from '@/types/tasks';
import { 
  useTaskFetching,
  useTaskMutations,
  useRealtimeSubscription
} from './task-operations';

export const useTaskOperations = () => {
  const {
    tasks,
    loading,
    error,
    isRefreshing,
    fetchTasks
  } = useTaskFetching();

  const {
    addTask,
    updateTaskItem,
    removeTask
  } = useTaskMutations();

  const { setupRealtimeSubscription } = useRealtimeSubscription(
    // When tasks change, refetch them
    () => fetchTasks(false)
  );

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
