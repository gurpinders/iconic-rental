'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/customer/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 text-lg">Welcome back! Here's your account overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🚗</div>
            <div className="text-3xl font-bold">
              {loading ? '...' : stats.totalBookings}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Bookings</h3>
        </div>

        {/* Upcoming */}
        <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📅</div>
            <div className="text-3xl font-bold text-blue-400">
              {loading ? '...' : stats.upcomingBookings}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Upcoming</h3>
        </div>

        {/* Completed */}
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">✅</div>
            <div className="text-3xl font-bold text-green-400">
              {loading ? '...' : stats.completedBookings}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
        </div>

        {/* Pending Invoices */}
        <div className="bg-zinc-900 border border-orange-500/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💰</div>
            <div className="text-3xl font-bold text-orange-400">
              {loading ? '...' : stats.pendingInvoices}
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Pending Invoices</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/quote"
          className="bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/50 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📝</div>
          <h3 className="text-xl font-bold mb-2">Request New Quote</h3>
          <p className="text-gray-400 text-sm">Get a quote for your upcoming event</p>
        </Link>

        <Link
          href="/customer/bookings"
          className="bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/50 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚗</div>
          <h3 className="text-xl font-bold mb-2">View Bookings</h3>
          <p className="text-gray-400 text-sm">Manage your reservations</p>
        </Link>

        <Link
          href="/customer/promotions"
          className="bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/50 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎁</div>
          <h3 className="text-xl font-bold mb-2">Special Offers</h3>
          <p className="text-gray-400 text-sm">View available promotions</p>
        </Link>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg mb-2">No recent activity</p>
          <p className="text-sm">Your bookings and updates will appear here</p>
        </div>
      </div>
    </div>
  );
}