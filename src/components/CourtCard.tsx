
import { Link } from "react-router-dom";
import { Court } from "@/types";
import { MapPin, DollarSign, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourtCardProps {
  court: Court;
}

export const CourtCard = ({ court }: CourtCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-0 shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={court.imageUrl}
          alt={court.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-medium flex items-center gap-1 bg-white/90 backdrop-blur">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span>{court.rating}</span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{court.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="truncate">{court.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {court.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-1">
          {court.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="font-light text-xs">
              {feature}
            </Badge>
          ))}
          {court.features.length > 3 && (
            <Badge variant="outline" className="font-light text-xs">
              +{court.features.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0 pb-4">
        <div className="flex items-center text-primary font-bold">
          <DollarSign className="h-4 w-4" />
          <span>Rs. {court.pricePerHour}</span>
          <span className="text-xs font-normal text-muted-foreground ml-1">/hour</span>
        </div>
        <Button size="sm" asChild>
          <Link to={`/courts/${court.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
