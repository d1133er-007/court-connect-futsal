
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
