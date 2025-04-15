
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { TimeSlot } from "@/types";

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  isLoading: boolean;
}

export const TimeSlotSelector = ({ 
  timeSlots, 
  selectedSlot, 
  setSelectedSlot, 
  isLoading 
}: TimeSlotSelectorProps) => {
  const formatTimeSlot = (slot: TimeSlot) => {
    const start = format(parseISO(slot.startTime), "h:mm a");
    const end = format(parseISO(slot.endTime), "h:mm a");
    return `${start} - ${end}`;
  };

  return (
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
  );
};
