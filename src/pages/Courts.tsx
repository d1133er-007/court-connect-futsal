
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CourtCard } from "@/components/CourtCard";
import { Court } from "@/types";
import { getCourts } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";

const Courts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
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

  // All possible features from courts
  const allFeatures = Array.from(
    new Set(courts.flatMap((court) => court.features))
  ).sort();

  // When filters change, apply all filters
  useEffect(() => {
    if (courts.length === 0) return;

    let filtered = [...courts];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(query) ||
          court.location.toLowerCase().includes(query) ||
          court.description.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (court) =>
        court.pricePerHour >= priceRange[0] && court.pricePerHour <= priceRange[1]
    );

    // Apply feature filters
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter((court) =>
        selectedFeatures.every((feature) => court.features.includes(feature))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-high":
        filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        // Sort by a combination of rating and price
        filtered.sort(
          (a, b) => b.rating * 10 - a.pricePerHour - (a.rating * 10 - b.pricePerHour)
        );
        break;
    }

    setFilteredCourts(filtered);
  }, [searchQuery, courts, priceRange, sortBy, selectedFeatures]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100]);
    setSortBy("recommended");
    setSelectedFeatures([]);
  };

  // Find min and max price in courts
  const minPrice = Math.min(...courts.map((court) => court.pricePerHour));
  const maxPrice = Math.max(...courts.map((court) => court.pricePerHour));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Court</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 text-muted-foreground"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="h-12">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  {(priceRange[0] > minPrice || 
                    priceRange[1] < maxPrice || 
                    selectedFeatures.length > 0) && (
                    <span className="ml-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {(priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0) + 
                       (selectedFeatures.length > 0 ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-lg">
                  <DrawerHeader>
                    <DrawerTitle>Filter Courts</DrawerTitle>
                    <DrawerDescription>
                      Apply filters to find the perfect court for your needs
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-6">
                    <div className="space-y-4">
                      <div className="font-medium">Price Range (per hour)</div>
                      <div className="px-2">
                        <Slider
                          defaultValue={[0, 100]}
                          min={0}
                          max={100}
                          step={5}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="my-6"
                        />
                        <div className="flex justify-between text-sm">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="font-medium">Facilities & Features</div>
                      <div className="grid grid-cols-2 gap-2">
                        {allFeatures.map((feature) => (
                          <Button
                            key={feature}
                            variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFeature(feature)}
                            className="justify-start"
                          >
                            {feature}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button onClick={clearFilters} variant="outline">
                      Reset Filters
                    </Button>
                    <DrawerClose asChild>
                      <Button>Apply Filters</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading courts...</span>
          </div>
        ) : filteredCourts.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Courts Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any courts matching your search criteria. 
              Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
