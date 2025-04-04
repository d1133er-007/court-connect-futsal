
import { Navbar } from "@/components/Navbar";
import { SignupForm } from "@/components/AuthForms";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sign Up | FutsalConnect</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
