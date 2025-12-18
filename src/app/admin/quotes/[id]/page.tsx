import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import QuoteActions from '@/components/admin/QuoteActions';
import Link from 'next/link';

export default async function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch quote with related data
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      vehicle: true,
      booking: true, // Check if booking already exists
    },
  });

  if (!quote) {
    notFound();
  }

  // Fetch all active vehicles for booking creation
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: { name: 'asc' },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-900/50 text-orange-300 border-orange-500/50';
      case 'REVIEWING':
        return 'bg-blue-900/50 text-blue-300 border-blue-500/50';
      case 'QUOTED':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/50';
      case 'ACCEPTED':
        return 'bg-green-900/50 text-green-300 border-green-500/50';
      case 'DECLINED':
        return 'bg-red-900/50 text-red-300 border-red-500/50';
      case 'COMPLETED':
        return 'bg-green-700/50 text-green-200 border-green-600/50';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to All Quotes</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quote #{quote.quoteNumber}</h1>
            <p className="text-gray-400">
              Submitted on {formatDate(quote.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium inline-block border ${getStatusColor(
              quote.status
            )}`}
          >
            {quote.status}
          </span>
        </div>
      </div>

      {/* Booking Status Alert */}
      {quote.booking && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-300">✅ Booking Created</p>
              <p className="text-sm text-gray-400 mt-1">
                This quote has been converted to booking #{quote.booking.bookingNumber}
              </p>
            </div>
            <Link
              href={`/admin/bookings/${quote.booking.id}`}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-300 font-semibold transition-colors text-sm"
            >
              View Booking →
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quote Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Name</p>
                <p className="font-semibold">
                  {quote.firstName} {quote.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="font-semibold">
                  <a
                    href={`mailto:${quote.email}`}
                    className="text-blue-400 hover:underline"
                  >
                    {quote.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Phone</p>
                <p className="font-semibold">
                  <a
                    href={`tel:${quote.phone}`}
                    className="text-blue-400 hover:underline"
                  >
                    {quote.phone}
                  </a>
                </p>
              </div>
              {quote.company && (
                <div>
                  <p className="text-gray-400 mb-1">Company</p>
                  <p className="font-semibold">{quote.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Event Type</p>
                <p className="font-semibold">{quote.eventType}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Event Date</p>
                <p className="font-semibold">{formatDate(quote.eventDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Service Type</p>
                <p className="font-semibold">{quote.serviceType}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Number of Passengers</p>
                <p className="font-semibold">{quote.numberOfPassengers}</p>
              </div>
              {quote.pickupTime && (
                <div>
                  <p className="text-gray-400 mb-1">Pickup Time</p>
                  <p className="font-semibold">{quote.pickupTime}</p>
                </div>
              )}
              {quote.numberOfHours && (
                <div>
                  <p className="text-gray-400 mb-1">Duration</p>
                  <p className="font-semibold">{quote.numberOfHours} hours</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Location Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Pickup Location</p>
                <p className="font-semibold">{quote.pickupLocation}</p>
              </div>
              {quote.dropoffLocation && (
                <div>
                  <p className="text-gray-400 mb-1">Dropoff Location</p>
                  <p className="font-semibold">{quote.dropoffLocation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {quote.specialRequests && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Special Requests</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {quote.specialRequests}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {quote.notes && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {quote.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Quote Actions */}
          <QuoteActions 
            quote={{
              id: quote.id,
              quoteNumber: quote.quoteNumber,
              status: quote.status,
              quotedPrice: quote.quotedPrice ? Number(quote.quotedPrice) : null,
              notes: quote.notes,
              hasBooking: !!quote.booking,
            }}
            vehicles={vehicles}
          />

          {/* Quick Contact */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h3 className="font-bold mb-4">Quick Contact</h3>
            <div className="space-y-3">
              <a
                href={`tel:${quote.phone}`}
                className="block w-full px-4 py-3 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/50 rounded text-center font-semibold transition-colors"
              >
                📞 Call Customer
              </a>
              
              <a
                href={`mailto:${quote.email}`}
                className="block w-full px-4 py-3 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/50 rounded text-center font-semibold transition-colors"
              >
                ✉️ Email Customer
              </a>
            </div>
          </div>

          {/* Vehicle Info */}
          {quote.vehicle && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h3 className="font-bold mb-3">Requested Vehicle</h3>
              <p className="text-sm font-semibold">{quote.vehicle.name}</p>
              <p className="text-xs text-gray-400">{quote.vehicle.category}</p>
            </div>
          )}

          {/* Pricing */}
          {quote.quotedPrice && (
            <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
              <h3 className="font-bold mb-2">Quoted Price</h3>
              <p className="text-3xl font-bold text-green-400">
                ${Number(quote.quotedPrice).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}