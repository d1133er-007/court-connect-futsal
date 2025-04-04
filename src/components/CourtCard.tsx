
import { Court } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface CourtCardProps {
  court: Court;
}

export const CourtCard = ({ court }: CourtCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={court.imageUrl}
          alt={court.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center text-sm font-medium">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          {court.rating}
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{court.name}</h3>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {court.location}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Available Slots
          </div>
          <div className="font-semibold text-court-green">
            ${court.pricePerHour}/hour
          </div>
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {court.description}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/courts/${court.id}`} className="w-full">
          <Button className="w-full">View & Book</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
