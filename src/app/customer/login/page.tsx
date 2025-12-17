'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Check if redirected from registration
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please log in.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success - redirect to dashboard
      router.push('/customer/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image 
              src="/logo_no_bg.png" 
              alt="Iconic Limos Logo" 
              width={200}
              height={100}
              className="mx-auto mb-6 cursor-pointer"
            />
          </Link>
          <h1 className="text-5xl font-bold mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-lg">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-10">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded text-green-300">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-base font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-base bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-base font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-base bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/customer/forgot-password"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center text-base text-gray-400">
            Don't have an account?{' '}
            <Link href="/customer/register" className="text-white hover:underline font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}