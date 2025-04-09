
import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export const TasksLoading = () => {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      <div className="space-y-3 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Skeleton className="h-16 w-full rounded-md" />
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    </motion.div>
  );
};
