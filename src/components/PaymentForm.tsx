
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Booking, Court, TimeSlot } from '@/types';
import { createPayment, updateBookingStatus } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { Loader2, CreditCard, Calendar, Clock } from 'lucide-react';

interface PaymentFormProps {
  booking: Booking;
  court: Court;
  timeSlot: TimeSlot;
}

export const PaymentForm = ({ booking, court, timeSlot }: PaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Only return at most 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        title: 'Invalid Card Number',
        description: 'Please enter a valid 16-digit card number',
        variant: 'destructive',
      });
      return;
    }
    
    if (!cardName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter the name on your card',
        variant: 'destructive',
      });
      return;
    }
    
    if (expiryDate.length !== 5) {
      toast({
        title: 'Invalid Expiry Date',
        description: 'Please enter a valid expiry date (MM/YY)',
        variant: 'destructive',
      });
      return;
    }
    
    if (cvv.length < 3) {
      toast({
        title: 'Invalid CVV',
        description: 'Please enter a valid CVV code',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would integrate with a payment processor
      // Here we'll just simulate a successful payment
      
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
          <div className="text-lg font-bold mt-2">${court.pricePerHour.toFixed(2)}</div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                required
                disabled={isLoading}
              />
              <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cardName" className="text-sm font-medium">
              Name on Card
            </label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                type="password"
                maxLength={4}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${court.pricePerHour.toFixed(2)}`
            )}
          </Button>
        </form>
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
