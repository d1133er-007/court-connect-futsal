
import { useCallback } from 'react';
import { Task, PriorityLevel } from '@/types/tasks';

export const useTaskFilters = () => {
  // Filter function
  const filterTasks = useCallback((
    taskList: Task[],
    searchQuery: string,
    priorities: PriorityLevel[],
    showCompleted: boolean
  ): Task[] => {
    return taskList.filter(task => {
      // Filter by completion status
      if (!showCompleted && task.completed) return false;
      
      // Filter by priority
      if (priorities.length > 0 && !priorities.includes(task.priority)) return false;
      
      // Filter by search query
      if (
        searchQuery && 
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  }, []);

  return {
    filterTasks
  };
};
