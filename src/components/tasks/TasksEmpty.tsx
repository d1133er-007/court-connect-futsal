
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';

interface TasksEmptyProps {
  onCreateTask: () => void;
}

export const TasksEmpty = ({ onCreateTask }: TasksEmptyProps) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 mt-6"
    >
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No tasks yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Get started by creating your first task to stay organized and on track
        </p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button onClick={onCreateTask} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create First Task
        </Button>
      </motion.div>
    </motion.div>
  );
};
