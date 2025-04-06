
import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import { useCourts } from '@/hooks/useCourts';
import { CourtsHeader } from '@/components/courts/CourtsHeader';
import { CourtsLoading } from '@/components/courts/CourtsLoading';
import { CourtsError } from '@/components/courts/CourtsError';
import { CourtsEmpty } from '@/components/courts/CourtsEmpty';
import { CourtsList } from '@/components/courts/CourtsList';

const Courts = () => {
  const { courts, loading, error, isRefreshing, fetchCourts } = useCourts();

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleRefresh = () => {
    fetchCourts(true);
  };

  return (
    <AnimatedPage className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <CourtsHeader 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
          loading={loading} 
        />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <CourtsLoading />
          ) : error ? (
            <CourtsError error={error} onRetry={() => fetchCourts()} />
          ) : courts.length === 0 ? (
            <CourtsEmpty onRefresh={() => fetchCourts()} />
          ) : (
            <CourtsList courts={courts} />
          )}
        </AnimatePresence>
      </main>
    </AnimatedPage>
  );
};

export default Courts;
