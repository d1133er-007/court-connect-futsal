
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { ExtendedBooking } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cancelBooking } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingItemProps {
  booking: ExtendedBooking;
  onStatusChange?: () => void;
}

export const BookingItem = ({ booking, onStatusChange }: BookingItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatTimeSlot = (startTime: string, endTime: string) => {
    return `${format(parseISO(startTime), 'h:mm a')} - ${format(parseISO(endTime), 'h:mm a')}`;
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      const success = await cancelBooking(booking.id);
      
      if (success) {
        toast({
          title: 'Booking Canceled',
          description: 'Your booking has been successfully canceled',
        });
        
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast({
          title: 'Cancellation Failed',
          description: 'There was an error canceling your booking',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast({
        title: 'Cancellation Failed',
        description: 'There was an error canceling your booking',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{booking.court?.name || 'Court'}</h3>
          <Badge variant={getBadgeVariant(booking.status) as any}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{booking.court?.location || 'Location unavailable'}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        
        {booking.timeSlot && (
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {formatTimeSlot(booking.timeSlot.startTime, booking.timeSlot.endTime)}
            </span>
          </div>
        )}
        
        {booking.status === 'pending' && (
          <div className="flex items-center text-amber-600 bg-amber-50 p-2 rounded mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Awaiting confirmation from the court</span>
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          Booked on {format(parseISO(booking.createdAt), 'MMM d, yyyy')}
        </div>
        
        {booking.status !== 'canceled' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? 'Canceling...' : 'Cancel Booking'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel This Booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelBooking}>
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
