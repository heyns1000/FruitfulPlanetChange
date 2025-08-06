import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAccessAuth } from '@/hooks/useAccessAuth';
import { LogIn, UserPlus, Mail, User, Building, Lock } from 'lucide-react';

interface FormData {
  email: string;
  fullName?: string;
  companyName?: string;
  password?: string;
}

export function SimplifiedAccessPortal() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    companyName: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { accessUser, isAccessAuthenticated, register, login } = useAccessAuth();

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        // Registration
        if (!formData.email || !formData.fullName) {
          toast({
            title: "Missing information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return;
        }

        const result = await register('loyalty', {
          email: formData.email,
          fullName: formData.fullName,
          companyName: formData.companyName || '',
        });

        if (result.success) {
          toast({
            title: "Registration successful",
            description: "You can now sign in with your email",
          });
          setIsRegistering(false);
        } else {
          toast({
            title: "Registration failed",
            description: result.error || "Please try again",
            variant: "destructive"
          });
        }
      } else {
        // Login
        if (!formData.email) {
          toast({
            title: "Email required",
            description: "Please enter your email address",
            variant: "destructive"
          });
          return;
        }

        const result = await login('loyalty', formData.email);

        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: result.error || "Please check your email or register first",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAccessAuthenticated && accessUser) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              Welcome Back!
            </CardTitle>
            <CardDescription>
              You're signed in as {(accessUser as any)?.email || 'User'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Access Type: {(accessUser as any)?.type || 'Standard'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Status: Active
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              variant="outline"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isRegistering ? (
              <>
                <UserPlus className="w-6 h-6 inline-block mr-2" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-6 h-6 inline-block mr-2" />
                Sign In
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isRegistering 
              ? "Join the Fruitful Global ecosystem"
              : "Access your personalized dashboard"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10"
                      autoComplete="name"
                      required={isRegistering}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Your company or organization"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="pl-10"
                      autoComplete="organization"
                    />
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : isRegistering ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm"
            >
              {isRegistering ? (
                <>
                  Already have an account? <span className="font-medium ml-1">Sign in</span>
                </>
              ) : (
                <>
                  New to Fruitful Global? <span className="font-medium ml-1">Create account</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}