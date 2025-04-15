
import { useState, useEffect } from "react";
import { Court, TimeSlot } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, parseISO, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, DollarSign, Award, Clock, Calendar } from "lucide-react";
import { getTimeSlotsByCourt } from "@/lib/supabase";

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

  // Generate next 4 days for date selection
  const dateOptions = Array.from({ length: 4 }, (_, i) => addDays(new Date(), i));

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

  const handleBookNow = () => {
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

    // Navigate to payment page with the booking details
    navigate("/payment", {
      state: {
        courtId: court.id,
        timeSlotId: selectedSlot.id,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
      },
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = format(parseISO(slot.startTime), "h:mm a");
    const end = format(parseISO(slot.endTime), "h:mm a");
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{court.name}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-1" />
          <span>{court.location}</span>
        </div>
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="font-medium">{court.rating}/5</span>
          <span className="ml-2 text-gray-500">(128 reviews)</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">About this court</h2>
        <div className="text-xl text-green-500 font-bold flex items-center">
          <DollarSign className="w-5 h-5" />
          <span>Rs. {court.pricePerHour}</span>
          <span className="text-gray-600 text-sm ml-2">per hour</span>
        </div>
      </div>

      <p className="text-gray-700">{court.description}</p>

      <div>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-2 gap-3">
          {court.features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <Award className="w-5 h-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Select Date</h3>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {dateOptions.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-md text-center transition-colors ${
                format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="text-sm">
                {format(date, "EEE")}
              </div>
              <div className="font-medium">
                {format(date, "d MMM")}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Available Time Slots</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
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
                className={`p-3 rounded-md text-center ${
                  slot.isBooked 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selectedSlot?.id === slot.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {formatTimeSlot(slot)}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleBookNow}
        className="w-full py-6 text-lg bg-green-500 hover:bg-green-600"
        disabled={!selectedSlot}
      >
        Book Now
      </Button>
    </div>
  );
};
