
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await requestPasswordReset(email);
      
      if (error) {
        toast({
          title: 'Reset Failed',
          description: error.message || 'Failed to send password reset email',
          variant: 'destructive',
        });
      } else {
        setIsSuccess(true);
        toast({
          title: 'Reset Email Sent',
          description: 'Check your email for a link to reset your password',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="text-green-600 font-medium">Reset link sent!</div>
                  <p className="text-gray-500">
                    We've sent an email to <span className="font-medium">{email}</span> with instructions to reset your password.
                  </p>
                  <p className="text-gray-500 text-sm">
                    If you don't see it, check your spam folder.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center border-t pt-6">
              <div className="text-sm text-gray-500">
                <Link to="/login" className="text-primary hover:underline">
                  Return to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
