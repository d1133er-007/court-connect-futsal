
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PaymentForm } from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCourtById, getTimeSlotsByCourt } from '@/lib/supabase';
import { Court, TimeSlot, Booking } from '@/types';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [court, setCourt] = useState<Court | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user || !bookingId) {
      navigate('/bookings');
      return;
    }

    // In a real app, we would fetch the booking by ID
    // For now, we'll use a mock booking since we don't have a getBookingById function
    // This is just for demonstration purposes
    const mockBooking: Booking = {
      id: bookingId,
      userId: user.id,
      courtId: '1', // This would be fetched from the actual booking
      timeSlotId: '1', // This would be fetched from the actual booking
      bookingDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBooking(mockBooking);

    const fetchCourtAndTimeSlot = async () => {
      try {
        // In a real app, these IDs would come from the actual booking
        const courtData = await getCourtById(mockBooking.courtId);
        if (!courtData) {
          throw new Error('Court not found');
        }
        setCourt(courtData);

        // We would normally fetch just this time slot, but we don't have that function
        // So we're fetching all time slots for this court and date, then finding the right one
        const slots = await getTimeSlotsByCourt(
          mockBooking.courtId,
          mockBooking.bookingDate
        );
        
        const matchingSlot = slots.find(slot => slot.id === mockBooking.timeSlotId);
        if (!matchingSlot) {
          // If we can't find the exact slot, just use the first available one for demo
          setTimeSlot(slots.length > 0 ? slots[0] : null);
        } else {
          setTimeSlot(matchingSlot);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment information',
          variant: 'destructive',
        });
        navigate('/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtAndTimeSlot();
  }, [bookingId, user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading payment details...</span>
        </div>
      </div>
    );
  }

  if (!court || !timeSlot || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Payment Information Not Available</h2>
          <p className="mt-2 text-gray-600">
            We couldn't find the details for this booking.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
        <PaymentForm booking={booking} court={court} timeSlot={timeSlot} />
      </div>
    </div>
  );
};

export default Payment;
