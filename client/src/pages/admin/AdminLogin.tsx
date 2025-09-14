import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

interface AdminLoginProps {
  onLogin: (token: string, user: LoginResponse['user']) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      onLogin(data.token, data.user);
    },
  });

  // Register first admin mutation
  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      const response = await fetch('/api/auth/register-first-admin', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      onLogin(data.token, data.user);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFirstAdmin) {
      // For first admin registration, use username as email if no @ symbol
      const email = formData.username.includes('@') ? formData.username : `${formData.username}@admin.local`;
      registerMutation.mutate({
        username: formData.username,
        email,
        password: formData.password
      });
    } else {
      loginMutation.mutate(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const error = loginMutation.error || registerMutation.error;
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isFirstAdmin ? 'Setup Admin Account' : 'Admin Login'}
          </CardTitle>
          <CardDescription className="text-center">
            {isFirstAdmin 
              ? 'Create the first admin account to get started' 
              : 'Sign in to access the admin dashboard'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                {isFirstAdmin ? 'Username/Email' : 'Username or Email'}
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                data-testid="input-username"
                placeholder={isFirstAdmin ? 'Enter username or email' : 'Enter your username or email'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  data-testid="input-password"
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription data-testid="text-error">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? 'Processing...' : (isFirstAdmin ? 'Create Admin Account' : 'Sign In')}
            </Button>

            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setIsFirstAdmin(!isFirstAdmin)}
                data-testid="button-toggle-mode"
              >
                {isFirstAdmin ? 'Already have an account? Sign in' : 'First time setup? Create admin account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}