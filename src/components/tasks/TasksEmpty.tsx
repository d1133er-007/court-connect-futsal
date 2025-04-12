
import React from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TasksEmptyProps {
  onCreateTask: () => void;
}

export const TasksEmpty = ({ onCreateTask }: TasksEmptyProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-16"
  >
    <div className="flex justify-center mb-6">
      <div className="bg-gray-100 rounded-full p-4">
        <ClipboardList className="w-10 h-10 text-gray-500" />
      </div>
    </div>
    
    <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks yet</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Create your first task to start organizing your work. Tasks help you keep track of what you need to do.
    </p>
    
    <Button onClick={onCreateTask} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Create Your First Task
    </Button>
  </motion.div>
);
