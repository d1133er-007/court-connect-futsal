
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { FilterIcon, Search } from 'lucide-react';
import { PriorityLevel } from '@/types/tasks';

interface TaskFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriorities: PriorityLevel[];
  onPriorityChange: (priorities: PriorityLevel[]) => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

export const TaskFilter = ({
  searchQuery,
  onSearchChange,
  selectedPriorities,
  onPriorityChange,
  showCompleted,
  onShowCompletedChange
}: TaskFilterProps) => {
  const handlePriorityToggle = (priority: PriorityLevel) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter(p => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuCheckboxItem
            checked={selectedPriorities.includes('high')}
            onCheckedChange={() => handlePriorityToggle('high')}
          >
            High Priority
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={selectedPriorities.includes('medium')}
            onCheckedChange={() => handlePriorityToggle('medium')}
          >
            Medium Priority
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuCheckboxItem
            checked={selectedPriorities.includes('low')}
            onCheckedChange={() => handlePriorityToggle('low')}
          >
            Low Priority
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuCheckboxItem
            checked={showCompleted}
            onCheckedChange={onShowCompletedChange}
          >
            Show Completed Tasks
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
