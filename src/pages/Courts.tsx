
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { CourtCard } from '@/components/CourtCard';
import { getCourts } from '@/lib/supabase';
import { Court } from '@/types';

const Courts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getCourts();
      
      if (error) {
        console.error('Error fetching courts:', error);
        setError(error.message || 'Failed to load courts. Please try again.');
        setCourts([]);
      } else {
        setCourts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error in fetchCourts:', err);
      setError('An unexpected error occurred. Please try again.');
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Courts</h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Loading courts...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchCourts}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : courts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No courts are available at the moment.</p>
            <Button variant="outline" onClick={fetchCourts}>Refresh</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courts;
