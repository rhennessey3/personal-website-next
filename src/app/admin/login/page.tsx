'use client';

import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/api';
import Cookies from 'js-cookie';

// Define the inner component that uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fromPath = searchParams.get('from') || '/admin';

  // Check if already logged in
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use placeholder login logic if API is not ready
      // In a real scenario, this would call the actual login API
      // const response = await login({ email, password }); 
      
      // Placeholder success simulation:
      if (email === 'admin@example.com' && password === 'password') {
        const fakeToken = 'fake-jwt-token';
        const fakeUser = { id: '1', email: 'admin@example.com', name: 'Admin User' };

        console.log("Simulating successful login...");

        Cookies.set('auth_token', fakeToken, {
          expires: 7,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        localStorage.setItem('user', JSON.stringify(fakeUser));
        router.push(fromPath);
      } else {
         // Simulate API error if login function is not available or fails
         throw new Error('Login function not available or invalid credentials (use admin@example.com / password for placeholder)');
      }

    } catch (err) {
      console.error("Login error:", err); // Log the actual error
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// The main page component now wraps LoginForm in Suspense
export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Suspense fallback={<div>Loading page...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}