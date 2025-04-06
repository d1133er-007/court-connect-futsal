
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
      <motion.p 
        className="text-gray-500 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        No courts available at the moment.
      </motion.p>
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
