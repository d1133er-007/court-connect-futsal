
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CourtDetails } from "@/components/CourtDetails";
import { Court } from "@/types";
import { getCourtById } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const CourtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [court, setCourt] = useState<Court | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourt = async () => {
      if (!id) return;
      
      try {
        const courtData = await getCourtById(id);
        setCourt(courtData);
      } catch (error) {
        console.error("Error fetching court:", error);
        toast({
          title: "Error",
          description: "Failed to load court data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourt();
  }, [id, toast]);

  // Sample court for initial display before loading
  const sampleCourt: Court = {
    id: "1",
    name: "Downtown Futsal Arena",
    location: "123 Main St, Downtown",
    description: "Professional futsal court with high-quality turf and excellent facilities. Our indoor arena features climate control for year-round comfort, professional-grade synthetic turf, and full amenities including changing rooms, showers, and equipment rental. Perfect for casual games, team practice, or tournaments.",
    pricePerHour: 80,
    imageUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    features: ["Indoor", "Air Conditioned", "Equipment Rental", "Changing Rooms", "Cafe", "Free Parking", "Professional Lighting", "Spectator Area"],
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="bg-gray-100 p-6 rounded-xl space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : court ? (
          <CourtDetails court={court} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Court Not Found</h2>
            <p className="text-gray-500">
              The court you are looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtDetail;
