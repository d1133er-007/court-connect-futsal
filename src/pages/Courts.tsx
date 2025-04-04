
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CourtCard } from "@/components/CourtCard";
import { Court } from "@/types";
import { getCourts } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Courts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const allCourts = await getCourts();
        setCourts(allCourts);
        setFilteredCourts(allCourts);
      } catch (error) {
        console.error("Error fetching courts:", error);
        toast({
          title: "Error",
          description: "Failed to load courts data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourts(courts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = courts.filter(
      (court) =>
        court.name.toLowerCase().includes(query) ||
        court.location.toLowerCase().includes(query)
    );
    setFilteredCourts(filtered);
  }, [searchQuery, courts]);

  // Sample courts for initial display before loading
  const sampleCourts: Court[] = [
    {
      id: "1",
      name: "Downtown Futsal Arena",
      location: "123 Main St, Downtown",
      description: "Professional futsal court with high-quality turf and excellent facilities.",
      pricePerHour: 80,
      imageUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      features: ["Indoor", "Air Conditioned", "Equipment Rental", "Changing Rooms"],
      rating: 4.8,
    },
    {
      id: "2",
      name: "Riverside Futsal Park",
      location: "45 River Road, East Side",
      description: "Beautiful outdoor futsal courts with riverside views and night lighting.",
      pricePerHour: 60,
      imageUrl: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      features: ["Outdoor", "Night Lighting", "Parking", "Spectator Area"],
      rating: 4.6,
    },
    {
      id: "3",
      name: "Sports Center Futsal",
      location: "789 Stadium Blvd, West District",
      description: "Part of a large sports complex with multiple futsal courts available.",
      pricePerHour: 70,
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      features: ["Indoor/Outdoor", "Cafeteria", "Pro Shop", "Training Programs"],
      rating: 4.5,
    },
    {
      id: "4",
      name: "University Futsal Center",
      location: "321 College Ave, North Campus",
      description: "Modern futsal facilities open to the public on the university campus.",
      pricePerHour: 55,
      imageUrl: "https://images.unsplash.com/photo-1599138900450-3d06e89ad317?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      features: ["Indoor", "Student Discounts", "Equipment Rental", "Locker Rooms"],
      rating: 4.3,
    },
    {
      id: "5",
      name: "Community Futsal Field",
      location: "567 Park Lane, South Side",
      description: "Community-run futsal courts with affordable rates for locals.",
      pricePerHour: 45,
      imageUrl: "https://images.unsplash.com/photo-1564447414600-375ceb4b527a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      features: ["Outdoor", "Community Events", "Beginner Friendly", "Youth Programs"],
      rating: 4.1,
    },
    {
      id: "6",
      name: "Elite Futsal Academy",
      location: "890 Professional Dr, Business District",
      description: "High-end futsal facility with professional-grade courts and amenities.",
      pricePerHour: 90,
      imageUrl: "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      features: ["Indoor", "Professional Training", "Video Analysis", "VIP Lounge"],
      rating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Futsal Courts</h1>
        
        <div className="relative max-w-md mb-8">
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="court-container">
            {sampleCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Courts Found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any courts matching your search.
            </p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        ) : (
          <div className="court-container">
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courts;
