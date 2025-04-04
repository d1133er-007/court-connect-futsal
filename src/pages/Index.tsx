
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CourtCard } from "@/components/CourtCard";
import { Court } from "@/types";
import { getCourts } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CreditCard, MapPin, Users } from "lucide-react";

const Index = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const allCourts = await getCourts();
        // Get top rated courts for the homepage
        const topCourts = allCourts
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setCourts(topCourts);
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

  // Sample featured courts for initial display before loading
  const featuredCourts: Court[] = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-court-green text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">Book Your Perfect Futsal Court</h1>
              <p className="text-lg md:text-xl opacity-90">
                Find and book the best futsal courts near you. Play with friends, join matches, or organize tournaments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-court-green hover:bg-gray-100">
                  <Link to="/courts">Find Courts</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img
                src="https://images.unsplash.com/photo-1571139491588-6aa4736c85e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Futsal"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white text-court-dark p-4 rounded-lg shadow-lg">
                <div className="text-lg font-bold">Quick & Easy</div>
                <div className="text-sm">Book in under 2 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-court-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-court-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Court</h3>
              <p className="text-gray-600">Browse courts by location and availability</p>
            </div>
            <div className="text-center">
              <div className="bg-court-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-court-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pick a Time</h3>
              <p className="text-gray-600">Choose from available time slots</p>
            </div>
            <div className="text-center">
              <div className="bg-court-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-court-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">Secure online booking and payment</p>
            </div>
            <div className="text-center">
              <div className="bg-court-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-court-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Play & Enjoy</h3>
              <p className="text-gray-600">Have fun with friends and teammates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Rated Courts</h2>
            <Link to="/courts" className="text-court-green hover:underline font-medium">
              View All Courts →
            </Link>
          </div>
          
          <div className="court-container">
            {isLoading
              ? featuredCourts.map((court) => (
                  <CourtCard key={court.id} court={court} />
                ))
              : courts.map((court) => (
                  <CourtCard key={court.id} court={court} />
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-court-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join CourtConnect today and start booking the best futsal courts in your area
          </p>
          <Button asChild size="lg" className="bg-court-green hover:bg-court-lighterGreen">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-court-green rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">CC</span>
                </div>
                <span className="text-xl font-bold text-court-dark">CourtConnect</span>
              </Link>
              <p className="text-gray-600">
                The easiest way to find and book futsal courts near you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Discover</h3>
              <ul className="space-y-2">
                <li><Link to="/courts" className="text-gray-600 hover:text-court-green">Courts</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Tournaments</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Training</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-court-green">About Us</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Contact</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Help Center</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-court-green">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 CourtConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
