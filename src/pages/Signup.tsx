
import { Navbar } from "@/components/Navbar";
import { SignupForm } from "@/components/AuthForms";

const Signup = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
