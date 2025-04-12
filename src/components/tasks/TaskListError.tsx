
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskListErrorProps {
  error: string;
  fetchTasks: () => void;
}

export const TaskListError = ({ error, fetchTasks }: TaskListErrorProps) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-8"
  >
    <div className="flex justify-center mb-4">
      <div className="bg-red-100 rounded-full p-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
    </div>
    
    <p className="text-red-500 font-medium mb-2">Something went wrong</p>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
    
    <Button variant="outline" onClick={() => fetchTasks()}>
      Try Again
    </Button>
  </motion.div>
);
