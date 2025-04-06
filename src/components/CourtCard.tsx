
import { Link } from "react-router-dom";
import { Court } from "@/types";
import { MapPin, DollarSign, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CourtCardProps {
  court: Court;
}

export const CourtCard = ({ court }: CourtCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg border-0 shadow h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={court.imageUrl}
            alt={court.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-2 right-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
              <Badge variant="secondary" className="font-medium flex items-center gap-1 bg-white/90 backdrop-blur">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span>{court.rating}</span>
              </Badge>
            </motion.div>
          </div>
        </div>
        
        <CardContent className="pt-4 flex-grow">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold mb-1 line-clamp-1"
          >
            {court.name}
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center text-sm text-muted-foreground mb-2"
          >
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="truncate">{court.location}</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground line-clamp-2 mb-3"
          >
            {court.description}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-1 mb-1"
          >
            {court.features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Badge variant="outline" className="font-light text-xs">
                  {feature}
                </Badge>
              </motion.div>
            ))}
            {court.features.length > 3 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Badge variant="outline" className="font-light text-xs">
                  +{court.features.length - 3} more
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0 pb-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center text-primary font-bold"
          >
            <DollarSign className="h-4 w-4" />
            <span>Rs. {court.pricePerHour}</span>
            <span className="text-xs font-normal text-muted-foreground ml-1">/hour</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="sm" asChild>
              <Link to={`/courts/${court.id}`}>Book Now</Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
