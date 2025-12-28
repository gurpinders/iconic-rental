'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // TODO: Implement password reset API when you add email functionality
    // For now, show a message that this feature is coming soon
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-32 pb-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wide mb-3">Reset Password</h1>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-xl text-green-200">
              <p className="font-semibold mb-2">Password Reset Coming Soon!</p>
              <p className="text-sm">
                This feature is currently under development. Please contact us at{' '}
                <a href="mailto:info@iconiclimos.com" className="underline hover:text-green-300">
                  info@iconiclimos.com
                </a>{' '}
                for password reset assistance.
              </p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-gray-400 text-sm">
              Remember your password?{' '}
              <Link href="/customer/login" className="text-white hover:text-gray-300 font-semibold underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}