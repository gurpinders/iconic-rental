'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Vehicle {
  name: string;
  category: string;
  thumbnail: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  eventDate: string;
  eventType: string;
  pickupLocation: string;
  dropoffLocation: string | null;
  numberOfPassengers: number;
  totalPrice: number;
  vehicle: Vehicle | null;
}

interface CategorizedBookings {
  upcoming: Booking[];
  past: Booking[];
  cancelled: Booking[];
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categorized, setCategorized] = useState<CategorizedBookings>({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/customer/bookings');
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
        setCategorized(data.categorized);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'IN_PROGRESS':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pt-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-16 bg-zinc-800 rounded w-full"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentBookings = categorized[activeTab];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-16">
      {/* Header - More Spacious */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">My Bookings</h1>
        <p className="text-gray-400 text-xl">View and manage all your reservations</p>
      </div>

      {/* Tabs - Cleaner Design */}
      <div className="mb-10">
        <div className="inline-flex bg-zinc-900 border border-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
            <span className="ml-2 text-sm">({categorized.upcoming.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'past'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past
            <span className="ml-2 text-sm">({categorized.past.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'cancelled'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cancelled
            <span className="ml-2 text-sm">({categorized.cancelled.length})</span>
          </button>
        </div>
      </div>

      {/* Bookings List - Much Better Cards */}
      {currentBookings.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-2xl p-16 text-center">
          <div className="text-8xl mb-6">🚗</div>
          <h3 className="text-3xl font-bold mb-4">No {activeTab} bookings</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming reservations yet. Ready to book your next luxury ride?" 
              : `No ${activeTab} bookings found.`}
          </p>
          {activeTab === 'upcoming' && (
            <Link href="/quote" className="btn-primary inline-block text-lg px-8 py-4">
              Request a Quote
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {currentBookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/customer/bookings/${booking.id}`}
              className="block bg-zinc-900 border-2 border-white/10 rounded-2xl p-8 hover:border-white/30 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Top Row - Date & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Event Date</p>
                  <h3 className="text-3xl font-bold group-hover:text-gray-200 transition-colors">
                    {formatDate(booking.eventDate)}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-6 py-3 rounded-full text-sm font-bold border-2 uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Event Type</p>
                    <p className="text-white text-lg font-semibold">{booking.eventType}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Pickup Location</p>
                    <p className="text-white text-lg font-medium">{booking.pickupLocation}</p>
                  </div>

                  {booking.dropoffLocation && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Dropoff Location</p>
                      <p className="text-white text-lg font-medium">{booking.dropoffLocation}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Passengers</p>
                    <p className="text-white text-lg font-semibold">{booking.numberOfPassengers} guests</p>
                  </div>

                  {booking.vehicle && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Vehicle</p>
                      <p className="text-white text-lg font-semibold">{booking.vehicle.name}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Booking Number</p>
                    <p className="text-gray-400 text-sm font-mono">#{booking.bookingNumber}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Price & Action */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Price</p>
                  <p className="text-4xl font-bold">{formatCurrency(Number(booking.totalPrice))}</p>
                </div>
                <div className="text-white group-hover:translate-x-2 transition-transform">
                  <span className="text-lg">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}