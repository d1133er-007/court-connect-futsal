
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

interface CourtsEmptyProps {
  onRefresh: () => void;
}

export const CourtsEmpty = ({ onRefresh }: CourtsEmptyProps) => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SearchX className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">
          No courts available at the moment.
        </p>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="outline" onClick={onRefresh}>Refresh</Button>
      </motion.div>
    </motion.div>
  );
};
