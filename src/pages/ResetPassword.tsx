
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verify that we have an access token from the reset email
  useEffect(() => {
    // Check if we have a hash fragment in the URL that indicates a recovery flow
    const hasAccessToken = window.location.hash.includes('access_token');
    const hasType = window.location.hash.includes('type=recovery');
    
    if (!hasAccessToken || !hasType) {
      setIsValidLink(false);
      toast({
        title: 'Invalid or Expired Link',
        description: 'This password reset link is invalid or has expired.',
        variant: 'destructive',
      });
    }
    
    // Set up auth state listener to detect when user completes recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Valid recovery token detected
        setIsValidLink(true);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(password);
      
      if (error) {
        toast({
          title: 'Reset Failed',
          description: error.message || 'Failed to reset password',
          variant: 'destructive',
        });
      } else {
        setIsSuccess(true);
        toast({
          title: 'Password Reset Successfully',
          description: 'Your password has been updated. You can now log in with your new password.',
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Invalid Reset Link</CardTitle>
                <CardDescription className="text-center">
                  This password reset link is invalid or has expired.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center py-6">
                <p className="text-gray-500 mb-6">
                  Please request a new password reset link.
                </p>
                
                <Button onClick={() => navigate('/forgot-password')}>
                  Request New Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create New Password</CardTitle>
              <CardDescription className="text-center">
                Enter a new password for your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <div className="text-green-600 font-medium text-lg">Password Reset Successfully!</div>
                  <p className="text-gray-500">
                    Your password has been updated. You'll be redirected to the login page shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
