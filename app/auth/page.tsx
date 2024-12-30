'use client';

import { signInWithGoogle } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push('/'); // Redirect to home page after successful sign-in
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Sign in to ParkScout.io
          </h1>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-forest-600 rounded-md hover:bg-forest-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaGoogle className="text-xl" />
            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
} 