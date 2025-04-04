
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BookingsList } from '@/components/BookingsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings } from '@/lib/supabase';
import { ExtendedBooking } from '@/types';
import { Loader2, Calendar, CalendarX } from 'lucide-react';

const Bookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userBookings = await getUserBookings(user.id);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [user]);
  
  // Filter bookings based on active tab
  const upcomingBookings = bookings.filter(
    booking => booking.status !== 'canceled'
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === 'canceled'
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Active Bookings
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center">
              <CalendarX className="h-4 w-4 mr-2" />
              Canceled Bookings
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading your bookings...</span>
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                <BookingsList 
                  bookings={upcomingBookings}
                  emptyMessage="You don't have any active bookings yet"
                  onStatusChange={fetchBookings}
                />
              </TabsContent>
              
              <TabsContent value="past">
                <BookingsList 
                  bookings={pastBookings}
                  emptyMessage="You don't have any canceled bookings"
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Bookings;
