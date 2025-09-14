import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);

  // Load token and user from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Verify token with server
  const { data: verifyData, error: verifyError } = useQuery({
    queryKey: ['verify-admin-token'],
    queryFn: async () => {
      if (!token) return null;
      
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
      
      return response.json();
    },
    enabled: !!token,
    retry: false,
  });

  // Handle login
  const handleLogin = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(newUser));
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  // If token verification failed, clear local storage and show login
  useEffect(() => {
    if (verifyError && token) {
      console.error('Token verification failed:', verifyError);
      handleLogout();
    }
  }, [verifyError, token]);

  // Show login page if no token or user
  if (!token || !user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show dashboard if authenticated
  return <AdminDashboard user={user} onLogout={handleLogout} />;
}