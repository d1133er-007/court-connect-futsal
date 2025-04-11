
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface TaskHeaderProps {
  onRefresh: () => void;
  onCreateTask: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  isUserLoggedIn: boolean;
}

export const TaskHeader = ({
  onRefresh,
  onCreateTask,
  isLoading,
  isRefreshing,
  isUserLoggedIn
}: TaskHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
      
      <div className="flex items-center gap-2">
        <RefreshButton 
          onRefresh={onRefresh} 
          isLoading={isLoading} 
          isRefreshing={isRefreshing} 
        />
        
        <NewTaskButton 
          onCreateTask={onCreateTask} 
          isUserLoggedIn={isUserLoggedIn} 
        />
      </div>
    </div>
  );
};

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

const RefreshButton = ({ onRefresh, isLoading, isRefreshing }: RefreshButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onRefresh}
    disabled={isLoading || isRefreshing}
    className="hidden sm:flex items-center gap-2"
  >
    <RefreshCw className="h-4 w-4" />
    Refresh
  </Button>
);

interface NewTaskButtonProps {
  onCreateTask: () => void;
  isUserLoggedIn: boolean;
}

const NewTaskButton = ({ onCreateTask, isUserLoggedIn }: NewTaskButtonProps) => (
  <Button
    onClick={onCreateTask}
    className="flex items-center gap-2"
    disabled={!isUserLoggedIn}
  >
    <Plus className="h-4 w-4" />
    <span className="hidden sm:inline">New Task</span>
  </Button>
);
