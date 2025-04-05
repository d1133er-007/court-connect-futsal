
import { useState, useEffect } from "react";
import { Court, TimeSlot } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, parseISO, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Star, DollarSign, Award, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTimeSlotsByCourt, createBooking } from "@/lib/supabase";

interface CourtDetailsProps {
  court: Court;
}

export const CourtDetails = ({ court }: CourtDetailsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Generate next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const slots = await getTimeSlotsByCourt(court.id, formattedDate);
        setTimeSlots(slots);
        setSelectedSlot(null);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [court.id, selectedDate, toast]);

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book this court",
        variant: "default",
      });
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      toast({
        title: "Time Slot Required",
        description: "Please select a time slot to book",
        variant: "default",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const booking = await createBooking(
        user.id,
        court.id,
        selectedSlot.id,
        format(selectedDate, "yyyy-MM-dd")
      );

      if (booking) {
        toast({
          title: "Booking Successful",
          description: "Your court has been booked successfully",
        });
        navigate("/bookings");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = format(parseISO(slot.startTime), "h:mm a");
    const end = format(parseISO(slot.endTime), "h:mm a");
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-8">
      <div className="relative h-80 overflow-hidden rounded-xl">
        <img
          src={court.imageUrl}
          alt={court.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{court.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{court.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="font-medium">{court.rating}/5</span>
              <span className="ml-2 text-gray-500">(128 reviews)</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">About this court</h2>
            <p className="text-gray-700">{court.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <div className="grid grid-cols-2 gap-3">
              {court.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <Award className="w-5 h-5 text-court-green mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-court-green flex items-center">
              <DollarSign className="w-5 h-5" />
              <span>Rs. {court.pricePerHour}</span>
            </div>
            <div className="text-gray-600">per hour</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Select Date
            </h3>
            <Tabs defaultValue={format(dateOptions[0], "yyyy-MM-dd")}>
              <TabsList className="w-full mb-4">
                {dateOptions.slice(0, 4).map((date) => (
                  <TabsTrigger
                    key={date.toISOString()}
                    value={format(date, "yyyy-MM-dd")}
                    onClick={() => setSelectedDate(date)}
                    className="flex-1"
                  >
                    <div className="text-center">
                      <div className="text-sm">{format(date, "EEE")}</div>
                      <div className="font-medium">{format(date, "d MMM")}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Available Time Slots
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-court-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No slots available for this date
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.isBooked ? null : slot)}
                    disabled={slot.isBooked}
                    className={`
                      time-slot
                      ${slot.isBooked ? "time-slot-booked" : "time-slot-available"}
                      ${selectedSlot?.id === slot.id ? "time-slot-selected" : ""}
                    `}
                  >
                    {formatTimeSlot(slot)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleBookNow}
            className="w-full"
            disabled={!selectedSlot || bookingLoading}
          >
            {bookingLoading ? "Processing..." : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};
