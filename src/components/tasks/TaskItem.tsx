
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task, PriorityLevel } from '@/types/tasks';

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800"
};

interface TaskItemProps {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskItem = ({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete 
}: TaskItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-3"
    >
      <Card className={cn(
        "hover:shadow-md transition-all duration-200",
        task.completed && "opacity-60"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="pt-0.5">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => onComplete(task)}
                className="h-5 w-5"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className={cn(
                  "font-medium text-base mb-1 break-words",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(task)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 break-words">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {task.dueDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <Badge 
                  variant="secondary"
                  className={cn(priorityColors[task.priority])}
                >
                  {task.priority}
                </Badge>
                
                <div className="flex items-center text-xs text-gray-500 ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistance(new Date(task.createdAt), new Date(), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
