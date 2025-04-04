
import { Navbar } from "@/components/Navbar";
import { LoginForm } from "@/components/AuthForms";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
