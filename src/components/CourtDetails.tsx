
import { useState, useEffect } from "react";
import { Court, TimeSlot } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { getTimeSlotsByCourt } from "@/lib/supabase";

// Import our new components
import { 
  CourtHeader, 
  CourtDescription, 
  CourtFeatures,
  DateSelector,
  TimeSlotSelector,
  BookingButton
} from "@/components/court-details";

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

  return (
    <div className="space-y-8">
      <CourtHeader court={court} />
      
      <CourtDescription court={court} />
      
      <CourtFeatures court={court} />
      
      <DateSelector 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />
      
      <TimeSlotSelector 
        timeSlots={timeSlots}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        isLoading={isLoading}
      />
      
      <BookingButton 
        onBookNow={handleBookNow} 
        isDisabled={!selectedSlot} 
      />
    </div>
  );
};
