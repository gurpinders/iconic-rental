'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  capacity: number;
  features: string[] | string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  eventDate: string;
  eventType: string;
  serviceType: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string | null;
  numberOfPassengers: number;
  numberOfHours: number | null;
  specialRequests: string | null;
  totalPrice: number;
  paidAmount: number;
  driverName: string | null;
  driverPhone: string | null;
  vehicleDetails: string | null;
  notes: string | null;
  vehicle: Vehicle | null;
  driver: Driver | null;
  invoices: Invoice[];
  confirmedAt: string;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setBookingId(p.id));
  }, [params]);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/customer/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        router.push('/customer/bookings');
        return;
      }

      setBooking(data.booking);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      router.push('/customer/bookings');
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-400';
      case 'PENDING':
        return 'text-orange-400';
      case 'PARTIALLY_PAID':
        return 'text-yellow-400';
      case 'OVERDUE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
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
          <div className="h-96 bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const remainingBalance = Number(booking.totalPrice) - Number(booking.paidAmount);

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-16">
      {/* Back Button */}
      <Link
        href="/customer/bookings"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <span>←</span>
        <span>Back to Bookings</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-5xl font-bold">Booking Details</h1>
          <span className={`px-6 py-3 rounded-full text-sm font-bold border-2 uppercase tracking-wide ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        <p className="text-gray-400 text-lg">Booking #{booking.bookingNumber}</p>
      </div>

      {/* Main Info Card */}
      <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8 mb-6">
        {/* Event Details */}
        <div className="mb-8 pb-8 border-b border-white/10">
          <h2 className="text-2xl font-bold mb-6">Event Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Event Date</p>
              <p className="text-white text-lg font-semibold">{formatDate(booking.eventDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Event Type</p>
              <p className="text-white text-lg font-semibold">{booking.eventType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Service Type</p>
              <p className="text-white text-lg font-semibold">{booking.serviceType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Pickup Time</p>
              <p className="text-white text-lg font-semibold">{booking.pickupTime}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Passengers</p>
              <p className="text-white text-lg font-semibold">{booking.numberOfPassengers} guests</p>
            </div>
            {booking.numberOfHours && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Duration</p>
                <p className="text-white text-lg font-semibold">{booking.numberOfHours} hours</p>
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="mb-8 pb-8 border-b border-white/10">
          <h2 className="text-2xl font-bold mb-6">Locations</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">📍 Pickup Location</p>
              <p className="text-white text-lg font-medium">{booking.pickupLocation}</p>
            </div>
            {booking.dropoffLocation && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">📍 Dropoff Location</p>
                <p className="text-white text-lg font-medium">{booking.dropoffLocation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Details */}
        {booking.vehicle && (
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-6">Vehicle</h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
                {booking.vehicle.imageUrl ? (
                  <Image
                    src={booking.vehicle.imageUrl}
                    alt={booking.vehicle.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-6xl">🚗</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{booking.vehicle.name}</h3>
                <p className="text-gray-400 mb-3">{booking.vehicle.category}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {booking.vehicle.capacity} passengers
                  </span>
                  {(() => {
                    // Parse features - handle both JSON array and comma-separated string
                    let featuresArray: string[] = [];
                    const features = booking.vehicle.features;
                    
                    if (Array.isArray(features)) {
                      // Already an array
                      featuresArray = features;
                    } else if (typeof features === 'string') {
                      try {
                        // Try parsing as JSON first
                        const parsed = JSON.parse(features);
                        if (Array.isArray(parsed)) {
                          featuresArray = parsed;
                        } else {
                          // Single string, split by comma
                          featuresArray = features
                            .split(',')
                            .map(f => f.trim())
                            .filter(f => f.length > 0);
                        }
                      } catch {
                        // If not JSON, split by comma
                        featuresArray = features
                          .split(',')
                          .map(f => f.trim())
                          .filter(f => f.length > 0);
                      }
                    }
                    
                    return featuresArray.slice(0, 3).map((feature, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {feature}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver Information */}
        {(booking.driver || booking.driverName || booking.driverPhone) && (
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-6">Driver Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(booking.driver?.name || booking.driverName) && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Driver Name</p>
                  <p className="text-white text-lg font-semibold">
                    {booking.driver?.name || booking.driverName}
                  </p>
                </div>
              )}
              {(booking.driver?.phone || booking.driverPhone) && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Driver Phone</p>
                  <a
                    href={`tel:${booking.driver?.phone || booking.driverPhone}`}
                    className="text-blue-400 text-lg font-semibold hover:underline"
                  >
                    {booking.driver?.phone || booking.driverPhone}
                  </a>
                </div>
              )}
              {booking.driver?.email && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Driver Email</p>
                  <a
                    href={`mailto:${booking.driver.email}`}
                    className="text-blue-400 text-lg font-semibold hover:underline"
                  >
                    {booking.driver.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mb-8 pb-8 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-4">Special Requests</h2>
            <p className="text-gray-300 text-base leading-relaxed">{booking.specialRequests}</p>
          </div>
        )}

        {/* Payment Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>
          <div className="bg-black/50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-400">Total Price</span>
              <span className="font-bold text-2xl">{formatCurrency(Number(booking.totalPrice))}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-400">Paid Amount</span>
              <span className="font-semibold text-green-400">{formatCurrency(Number(booking.paidAmount))}</span>
            </div>
            {remainingBalance > 0 && (
              <div className="flex justify-between items-center text-lg pt-4 border-t border-white/10">
                <span className="text-gray-400">Remaining Balance</span>
                <span className="font-bold text-orange-400 text-2xl">{formatCurrency(remainingBalance)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoices */}
      {booking.invoices && booking.invoices.length > 0 && (
        <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Invoices</h2>
          <div className="space-y-4">
            {booking.invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/customer/invoices/${invoice.id}`}
                className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors border border-white/10 hover:border-white/30"
              >
                <div>
                  <p className="font-semibold text-lg">Invoice #{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(Number(invoice.total))}</p>
                  <p className={`text-sm font-semibold ${getPaymentStatusColor(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}