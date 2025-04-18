import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Court } from '@/types';
import { getCourts } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        
        {/* Featured Courts Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="my-12"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
          >
            Featured Courts
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg">Loading courts...</span>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
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
            </motion.div>
          ) : featuredCourts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-8"
            >
              No courts available at the moment.
            </motion.p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show" 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredCourts.map((court) => (
                <motion.div
                  key={court.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow">
                    <motion.div className="relative h-48 overflow-hidden">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={court.imageUrl || "/placeholder.svg"} 
                        alt={court.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                    <CardHeader className="relative">
                      <CardTitle className="text-xl">{court.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {court.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-gray-600">{court.description}</p>
                      <p className="mt-2 text-blue-600 font-semibold">Rs. {court.pricePerHour}/hour</p>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/courts/${court.id}`} className="w-full">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                        </motion.div>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <Link to="/courts">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="font-semibold">
                  View All Courts
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
        
        <FeaturesSection />
      </main>
      
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                Court Connect
              </h2>
              <p className="text-gray-400">The best way to book futsal courts</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>&copy; {new Date().getFullYear()} Court Connect. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
