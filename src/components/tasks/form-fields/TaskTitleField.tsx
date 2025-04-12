
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TaskFormValues } from '@/types/tasks';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TaskTitleFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Task title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
