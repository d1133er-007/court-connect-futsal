
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-2 mt-6"
  >
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
  </motion.div>
);
