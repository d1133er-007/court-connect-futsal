
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';
import { TaskItem } from './TaskItem';
import { TasksEmpty } from './TasksEmpty';
import { TasksLoading } from './TasksLoading';
import { TaskListError } from './TaskListError';
import { TaskListFiltered } from './TaskListFiltered';
import { TaskListItems } from './TaskListItems';

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
        <TaskListError error={error} fetchTasks={fetchTasks} />
      ) : filteredTasks.length === 0 ? (
        tasks.length === 0 ? (
          <TasksEmpty onCreateTask={onCreateTask} />
        ) : (
          <TaskListFiltered onClearFilters={onClearFilters} />
        )
      ) : (
        <TaskListItems
          filteredTasks={filteredTasks}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </AnimatePresence>
  );
};
