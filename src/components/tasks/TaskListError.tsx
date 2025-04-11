
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskListErrorProps {
  error: string;
  fetchTasks: () => void;
}

export const TaskListError = ({ error, fetchTasks }: TaskListErrorProps) => (
  <div className="text-center py-8">
    <p className="text-red-500 mb-4">{error}</p>
    <Button variant="outline" onClick={() => fetchTasks()}>
      Try Again
    </Button>
  </div>
);
