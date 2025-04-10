
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task } from '@/types/tasks';
import { TaskItem } from './TaskItem';
import { TasksEmpty } from './TasksEmpty';
import { TasksLoading } from './TasksLoading';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  onCreateTask: () => void;
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onClearFilters: () => void;
  fetchTasks: () => void;
}

export const TaskList = ({
  tasks,
  filteredTasks,
  loading,
  error,
  onCreateTask,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onClearFilters,
  fetchTasks
}: TaskListProps) => {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <TasksLoading />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchTasks()}>
            Try Again
          </Button>
        </div>
      ) : filteredTasks.length === 0 ? (
        tasks.length === 0 ? (
          <TasksEmpty onCreateTask={onCreateTask} />
        ) : (
          <div className="text-center py-12 mt-6">
            <p className="text-gray-500">No tasks match your filters</p>
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )
      ) : (
        <div className="space-y-1 mt-4">
          <AnimatePresence initial={false}>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};
