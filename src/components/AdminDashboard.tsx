
import { useState, useEffect } from "react";
import { Booking } from "@/types";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllBookings, updateBookingStatus } from "@/lib/supabase";

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoading(true);
      try {
        const allBookings = await getAllBookings();
        setBookings(allBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBookings();
  }, [toast]);

  const handleUpdateStatus = async (bookingId: string, status: "confirmed" | "canceled") => {
    try {
      const success = await updateBookingStatus(bookingId, status);
      if (success) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
        toast({
          title: "Status Updated",
          description: `Booking status has been updated to ${status}`,
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed");
  const canceledBookings = bookings.filter((booking) => booking.status === "canceled");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{pendingBookings.length}</CardTitle>
            <CardDescription>Pending Bookings</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{confirmedBookings.length}</CardTitle>
            <CardDescription>Confirmed Bookings</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{canceledBookings.length}</CardTitle>
            <CardDescription>Canceled Bookings</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
          <CardDescription>View and manage all court bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">
                Pending ({pendingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({confirmedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="canceled">
                Canceled ({canceledBookings.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending bookings
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      onConfirm={() => handleUpdateStatus(booking.id, "confirmed")}
                      onCancel={() => handleUpdateStatus(booking.id, "canceled")}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="confirmed">
              {confirmedBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No confirmed bookings
                </div>
              ) : (
                <div className="space-y-4">
                  {confirmedBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                      onCancel={() => handleUpdateStatus(booking.id, "canceled")}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="canceled">
              {canceledBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No canceled bookings
                </div>
              ) : (
                <div className="space-y-4">
                  {canceledBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={booking}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface BookingItemProps {
  booking: Booking;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const BookingItem = ({ booking, onConfirm, onCancel }: BookingItemProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h4 className="font-medium">{booking.court?.name}</h4>
          <div className="text-sm text-gray-500 mb-2">
            {format(parseISO(booking.bookingDate), "MMMM d, yyyy")} •{" "}
            {format(parseISO(booking.timeSlot?.startTime), "h:mm a")} -{" "}
            {format(parseISO(booking.timeSlot?.endTime), "h:mm a")}
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Customer:</span>{" "}
            <span>{booking.user?.name}</span> ({booking.user?.email})
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {onConfirm && (
            <Button size="sm" onClick={onConfirm}>
              Confirm
            </Button>
          )}
          {onCancel && (
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
