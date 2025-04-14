
import React from 'react';
import { UseFormReturn, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Use a generic type parameter to make this component more flexible
interface TaskTitleFieldProps<T extends { title: string }> {
  form: UseFormReturn<T>;
}

export const TaskTitleField = <T extends { title: string }>({ form }: TaskTitleFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={"title" as Path<T>}
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
