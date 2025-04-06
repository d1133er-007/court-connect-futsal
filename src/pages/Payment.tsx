
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PaymentForm } from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCourtById, getTimeSlotsByCourt, updateBookingStatus } from '@/lib/supabase';
import { Court, TimeSlot, Booking } from '@/types';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/AnimatedPage';

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [court, setCourt] = useState<Court | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'canceled' | 'normal'>('loading');

  useEffect(() => {
    if (!user || !bookingId) {
      navigate('/bookings');
      return;
    }

    // Process URL parameters (from Stripe redirect)
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('status');
    const sessionId = searchParams.get('session_id');
    const urlBookingId = searchParams.get('booking_id');

    if (paymentStatus && urlBookingId) {
      if (paymentStatus === 'success' && sessionId) {
        setStatus('success');
      } else if (paymentStatus === 'canceled') {
        setStatus('canceled');
      }
    } else {
      setStatus('normal');
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
  }, [bookingId, user, navigate, toast, location.search]);

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

  if (status === 'success') {
    return (
      <AnimatedPage className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Card className="text-center p-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your booking has been confirmed. Thank you for your payment.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/bookings')}>
                View My Bookings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  if (status === 'canceled') {
    return (
      <AnimatedPage className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-md">
          <Card className="text-center p-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Canceled</h2>
              <p className="text-gray-600 mb-4">
                Your payment was not completed. You can try again or view your bookings.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/bookings')}>
                My Bookings
              </Button>
              <Button onClick={() => setStatus('normal')}>
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  if (!court || !timeSlot || !booking) {
    return (
      <AnimatedPage className="min-h-screen bg-gray-50">
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
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
        <PaymentForm booking={booking} court={court} timeSlot={timeSlot} />
      </div>
    </AnimatedPage>
  );
};

export default Payment;
