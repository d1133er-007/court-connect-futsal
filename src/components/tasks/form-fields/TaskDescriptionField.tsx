
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// Use a generic type parameter to make this component more flexible
interface TaskDescriptionFieldProps<T extends { description?: string }> {
  form: UseFormReturn<T>;
}

export const TaskDescriptionField = <T extends { description?: string }>({ form }: TaskDescriptionFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name="description" as="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Add details about your task"
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
