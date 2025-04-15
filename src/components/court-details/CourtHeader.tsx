
import { Court } from "@/types";
import { MapPin, Star } from "lucide-react";

interface CourtHeaderProps {
  court: Court;
}

export const CourtHeader = ({ court }: CourtHeaderProps) => {
  return (
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
  );
};
