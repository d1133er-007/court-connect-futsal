
import { Navbar } from "@/components/Navbar";
import { BookingsList } from "@/components/BookingsList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Bookings = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <BookingsList userId={user.id} />
      </div>
    </div>
  );
};

export default Bookings;
