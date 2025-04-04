
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import Courts from "./pages/Courts";
import CourtDetail from "./pages/CourtDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Import contexts
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/courts/:id" element={<CourtDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
