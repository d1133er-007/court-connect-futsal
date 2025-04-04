
import { Navbar } from "@/components/Navbar";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;
