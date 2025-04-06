
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Booking, Court, TimeSlot } from '@/types';
import { updateBookingStatus, createPayment } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { Loader2, CreditCard, Calendar, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentFormProps {
  booking: Booking;
  court: Court;
  timeSlot: TimeSlot;
}

export const PaymentForm = ({ booking, court, timeSlot }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for query parameters when returning from Stripe
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const bookingId = searchParams.get('booking_id');
    const sessionId = searchParams.get('session_id');
    
    if (status && bookingId && bookingId === booking.id) {
      if (status === 'success' && sessionId) {
        toast({
          title: 'Payment Successful',
          description: 'Your booking has been confirmed',
        });
        
        // Remove query parameters and navigate to bookings
        setTimeout(() => {
          navigate('/bookings', { replace: true });
        }, 2000);
      } else if (status === 'canceled') {
        toast({
          title: 'Payment Canceled',
          description: 'Your payment was not completed',
          variant: 'destructive',
        });
      }
    }
  }, [location, booking.id, toast, navigate]);

  const handlePayWithStripe = async () => {
    try {
      setIsProcessing(true);
      
      // Call our Supabase Edge Function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          bookingId: booking.id,
          courtName: court.name,
          amount: court.pricePerHour,
          returnUrl: window.location.origin + '/payment/' + booking.id,
        },
      });
      
      if (error) {
        console.error('Error creating checkout session:', error);
        throw new Error('Failed to initialize payment');
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from payment service');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment processing',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Legacy payment method (for demonstration only)
  const handleSubmitMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Create a payment record
      const payment = await createPayment(
        booking.id,
        booking.userId,
        court.pricePerHour
      );
      
      if (!payment) {
        throw new Error('Failed to process payment');
      }
      
      // Update booking status to confirmed
      const updated = await updateBookingStatus(booking.id, 'confirmed');
      
      if (!updated) {
        throw new Error('Failed to confirm booking');
      }
      
      // Show success message
      toast({
        title: 'Payment Successful',
        description: 'Your booking has been confirmed',
      });
      
      // Redirect to bookings page
      navigate('/bookings');
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during payment processing',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>Secure payment for your court booking</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500">Booking Details</div>
          <div className="font-medium">{court.name}</div>
          <div className="text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {format(parseISO(timeSlot.startTime), 'h:mm a')} - {format(parseISO(timeSlot.endTime), 'h:mm a')}
          </div>
          <div className="text-lg font-bold mt-2">Rs. {court.pricePerHour.toFixed(2)}</div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handlePayWithStripe} 
            className="w-full bg-[#6772E5] hover:bg-[#5469D4]"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Stripe (Rs. {court.pricePerHour.toFixed(2)})
              </>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmitMockPayment} className="space-y-4">
            <div className="text-sm text-center text-gray-500 mb-2">
              Use test payment method below
            </div>
            
            <Button type="submit" className="w-full" variant="outline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Test Payment (Rs. ${court.pricePerHour.toFixed(2)})`
              )}
            </Button>
          </form>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center text-xs text-gray-500">
        <div className="flex flex-col items-center space-y-1">
          <div>Your payment is secure and encrypted</div>
          <div>We do not store your card details</div>
        </div>
      </CardFooter>
    </Card>
  );
};
