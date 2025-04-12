
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface TaskFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({ 
  isSubmitting, 
  onCancel, 
  isEditing 
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
      </Button>
    </DialogFooter>
  );
};
