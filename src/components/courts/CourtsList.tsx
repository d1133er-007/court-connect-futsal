
import React from 'react';
import { motion } from 'framer-motion';
import { Court } from '@/types';
import { CourtCard } from '@/components/CourtCard';

interface CourtsListProps {
  courts: Court[];
}

export const CourtsList = ({ courts }: CourtsListProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <motion.div
      key="courts"
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {courts.map((court) => (
        <motion.div
          key={court.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            y: -5, 
            transition: { duration: 0.2 } 
          }}
        >
          <CourtCard court={court} />
        </motion.div>
      ))}
    </motion.div>
  );
};
