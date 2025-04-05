
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';
import Navbar from '@/components/Navbar';
import { Court } from '@/types';
import { getCourts } from '@/lib/supabase';

const Index = () => {
  const [featuredCourts, setFeaturedCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: courts, error } = await getCourts();
      
      if (error) {
        setError(error.message || 'Failed to load courts data. Please try again.');
        setFeaturedCourts([]);
      } else {
        setFeaturedCourts(courts?.slice(0, 3) || []);
      }
    } catch (err) {
      console.error('Error in fetchCourts:', err);
      setError('Unexpected error occurred. Please try again.');
      setFeaturedCourts([]);
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-12 text-white shadow-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find and Book Your Perfect Futsal Court</h1>
            <p className="text-xl mb-8">Quick and easy booking for the best futsal courts in your area</p>
            <Link to="/courts">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Find Courts
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Featured Courts Section */}
        <div className="my-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Featured Courts</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <ReloadIcon className="h-8 w-8 animate-spin text-blue-600 mr-2" />
              <span className="text-lg">Loading courts...</span>
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
          ) : featuredCourts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No courts available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourts.map((court) => (
                <Card key={court.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={court.imageUrl || "/placeholder.svg"} 
                    alt={court.name} 
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{court.name}</CardTitle>
                    <CardDescription>{court.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-gray-600">{court.description}</p>
                    <p className="mt-2 text-blue-600 font-semibold">${court.pricePerHour}/hour</p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courts/${court.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/courts">
              <Button variant="outline" size="lg">View All Courts</Button>
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="my-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-gray-600">Book your court in seconds with our easy-to-use platform</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Courts</h3>
              <p className="text-gray-600">All our courts are vetted for quality and maintained regularly</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment options for all your bookings</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Court Connect</h2>
              <p className="text-gray-400">The best way to book futsal courts</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">About Us</a>
              <a href="#" className="hover:text-blue-400">Contact</a>
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Court Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
