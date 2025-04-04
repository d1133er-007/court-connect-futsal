
import { useState, useEffect } from "react";
import { Booking } from "@/types";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserBookings, updateBookingStatus } from "@/lib/supabase";

interface BookingsListProps {
  userId: string;
}

export const BookingsList = ({ userId }: BookingsListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const userBookings = await getUserBookings(userId);
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [userId, toast]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const success = await updateBookingStatus(bookingId, "canceled");
      if (success) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "canceled" }
              : booking
          )
        );
        toast({
          title: "Booking Canceled",
          description: "Your booking has been successfully canceled",
        });
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your booking",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "canceled":
        return "Canceled";
      default:
        return "Pending";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
        <p className="text-gray-500 mb-6">
          You haven't made any bookings yet. Start booking courts now!
        </p>
        <Button asChild>
          <a href="/courts">Find Courts</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Bookings</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{booking.court?.name}</CardTitle>
              <div className="flex items-center space-x-1">
                {getStatusIcon(booking.status)}
                <span
                  className={`
                    font-medium text-sm
                    ${booking.status === "confirmed" ? "text-green-600" : ""}
                    ${booking.status === "canceled" ? "text-red-600" : ""}
                    ${booking.status === "pending" ? "text-yellow-600" : ""}
                  `}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>
                      {format(parseISO(booking.bookingDate), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>
                      {format(parseISO(booking.timeSlot?.startTime), "h:mm a")} -{" "}
                      {format(parseISO(booking.timeSlot?.endTime), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{booking.court?.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  {booking.status === "pending" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                  {booking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
