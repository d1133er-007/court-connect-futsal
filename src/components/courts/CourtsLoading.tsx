
import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CourtsLoading = () => {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-64 gap-2"
    >
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <motion.span 
        className="text-lg text-blue-600 font-medium mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading courts...
      </motion.span>
    </motion.div>
  );
};
