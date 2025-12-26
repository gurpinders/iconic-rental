'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo_no_bg.png"
            alt="Iconic Limos Logo"
            width={150}
            height={75}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold tracking-wide mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400">
            Access the Iconic Limos dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                placeholder="admin@iconiclimos.com"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-white text-black hover:bg-gray-200 transition-all duration-300 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
            >
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}