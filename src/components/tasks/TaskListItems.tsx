
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';
import { TaskItem } from './TaskItem';

interface TaskListItemsProps {
  filteredTasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskListItems = ({
  filteredTasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask
}: TaskListItemsProps) => (
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
);
