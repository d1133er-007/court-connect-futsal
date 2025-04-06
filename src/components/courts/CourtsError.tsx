
import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface CourtsErrorProps {
  error: string;
  onRetry: () => void;
}

export const CourtsError = ({ error, onRetry }: CourtsErrorProps) => {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRetry}
                className="mt-2"
              >
                Try Again
              </Button>
            </motion.div>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
