
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@/types/tasks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  TaskTitleField,
  TaskDescriptionField,
  TaskPriorityField,
  TaskDueDateField,
  TaskFormActions
} from './form-fields';

// Task schema definition
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional()
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  task?: Task;
  isSubmitting: boolean;
}

export const TaskDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  task,
  isSubmitting
}: TaskDialogProps) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined
    }
  });
  
  // Update form when task changes
  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      });
    } else {
      form.reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: undefined
      });
    }
  }, [task, form]);
  
  const handleSubmit = async (values: TaskFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task 
              ? 'Update your task details below' 
              : 'Fill out the form below to create a new task'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-2">
            <TaskTitleField form={form} />
            <TaskDescriptionField form={form} />
            
            <div className="grid grid-cols-2 gap-4">
              <TaskPriorityField form={form} />
              <TaskDueDateField form={form} />
            </div>
            
            <TaskFormActions 
              isSubmitting={isSubmitting} 
              onCancel={() => onOpenChange(false)}
              isEditing={!!task}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
