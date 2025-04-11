
import React from 'react';
import { Button } from '@/components/ui/button';

interface TaskListFilteredProps {
  onClearFilters: () => void;
}

export const TaskListFiltered = ({ onClearFilters }: TaskListFilteredProps) => (
  <div className="text-center py-12 mt-6">
    <p className="text-gray-500">No tasks match your filters</p>
    <Button 
      variant="outline" 
      onClick={onClearFilters}
      className="mt-4"
    >
      Clear Filters
    </Button>
  </div>
);
