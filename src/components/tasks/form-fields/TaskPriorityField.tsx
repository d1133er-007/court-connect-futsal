
import React from 'react';
import { UseFormReturn, Path } from 'react-hook-form';
import { PriorityLevel } from '@/types/tasks';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Use a generic type parameter to make this component more flexible
interface TaskPriorityFieldProps<T extends { priority: PriorityLevel }> {
  form: UseFormReturn<T>;
}

export const TaskPriorityField = <T extends { priority: PriorityLevel }>({ form }: TaskPriorityFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={"priority" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
