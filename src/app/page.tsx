"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password, role);
      
      if (success) {
        toast.success('Login successful!');
        
        // Redirect based on role
        switch (role) {
          case 'super-admin':
            router.push('/dashboard/super-admin');
            break;
          case 'doctor':
            router.push('/dashboard/doctor');
            break;
          case 'receptionist':
            router.push('/dashboard/receptionist');
            break;
          case 'patient':
            router.push('/dashboard/patient');
            break;
        }
      } else {
        toast.error('Invalid credentials. Please check your username, password, and role.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <div className="text-white text-2xl font-bold">MJ</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Muscular Junction</h1>
          <p className="text-gray-600">Clinic Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Login to Clinic System
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link 
                href="/signup" 
                className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium"
              >
                Sign up as Patient
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Super Admin:</strong> admin / admin123</div>
            <div><strong>Doctor:</strong> dr.smith / doctor123</div>
            <div><strong>Receptionist:</strong> reception1 / reception123</div>
            <div><strong>Patient:</strong> john.doe / patient123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
