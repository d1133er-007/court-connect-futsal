
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskListFilteredProps {
  onClearFilters: () => void;
}

export const TaskListFiltered = ({ onClearFilters }: TaskListFilteredProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-12 mt-6"
  >
    <div className="flex justify-center mb-4">
      <div className="bg-gray-100 rounded-full p-3">
        <Filter className="w-6 h-6 text-gray-500" />
      </div>
    </div>
    
    <h3 className="text-lg font-medium text-gray-900 mb-2">No matching tasks</h3>
    <p className="text-gray-500 mb-6">
      No tasks match your current filter settings. Try adjusting your filters or clear them to see all tasks.
    </p>
    
    <Button 
      variant="outline" 
      onClick={onClearFilters}
      className="flex items-center gap-2"
    >
      <X className="h-4 w-4" />
      Clear Filters
    </Button>
  </motion.div>
);
