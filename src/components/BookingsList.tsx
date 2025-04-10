
import { useState } from "react";
import { ExtendedBooking } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cancelBooking } from "@/lib/supabase";
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
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface BookingsListProps {
  bookings: ExtendedBooking[];
  emptyMessage: string;
  onStatusChange?: () => void;
}

export const BookingsList = ({ bookings, emptyMessage, onStatusChange }: BookingsListProps) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        toast({
          title: "Booking Canceled",
          description: "Your booking has been successfully canceled",
        });
        
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your booking",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <div className="text-muted-foreground mb-4">
          <Calendar className="w-16 h-16 mx-auto opacity-40" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Bookings</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {emptyMessage}
        </p>
        <Button asChild>
          <a href="/courts">Find Courts</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden border-0 shadow-md">
            <div className="sm:flex">
              {booking.court?.imageUrl && (
                <div className="sm:w-1/4 h-40 sm:h-auto">
                  <img
                    src={booking.court.imageUrl}
                    alt={booking.court.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">{booking.court?.name || 'Unknown Court'}</CardTitle>
                  {getStatusBadge(booking.status)}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-5 h-5 mr-2 text-primary" />
                          <span>
                            {format(parseISO(booking.bookingDate), "EEEE, MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-5 h-5 mr-2 text-primary" />
                          <span>
                            {booking.timeSlot ? format(parseISO(booking.timeSlot.startTime), "h:mm a") : 'Unknown time'} -{" "}
                            {booking.timeSlot ? format(parseISO(booking.timeSlot.endTime), "h:mm a") : ''}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-5 h-5 mr-2 text-primary" />
                          <span>{booking.court?.location || 'Unknown location'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        {booking.status !== "canceled" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive/10"
                              >
                                {cancellingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {booking.status === "canceled" && (
                          <div className="flex items-center text-muted-foreground">
                            <XCircle className="w-5 h-5 mr-2 text-destructive" />
                            <span>Booking Canceled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
