import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import BookingActions from '@/components/admin/BookingActions';

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch booking with related data
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      quote: {
        select: {
          quoteNumber: true,
        },
      },
      invoices: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-900/50 text-blue-300 border-blue-500/50';
      case 'IN_PROGRESS':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/50';
      case 'COMPLETED':
        return 'bg-green-900/50 text-green-300 border-green-500/50';
      case 'CANCELLED':
        return 'bg-red-900/50 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
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

  const remainingBalance = Number(booking.totalPrice) - Number(booking.paidAmount);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Booking #{booking.bookingNumber}</h1>
            <p className="text-gray-400">
              Confirmed on {formatDate(booking.confirmedAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium inline-block border ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Name</p>
                <p className="font-semibold">
                  {booking.customer.firstName} {booking.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="font-semibold">
                  <a
                    href={`mailto:${booking.customer.email}`}
                    className="text-blue-400 hover:underline"
                  >
                    {booking.customer.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Phone</p>
                <p className="font-semibold">
                  <a
                    href={`tel:${booking.customer.phone}`}
                    className="text-blue-400 hover:underline"
                  >
                    {booking.customer.phone}
                  </a>
                </p>
              </div>
              {booking.customer.company && (
                <div>
                  <p className="text-gray-400 mb-1">Company</p>
                  <p className="font-semibold">{booking.customer.company}</p>
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
                <p className="font-semibold">{booking.eventType}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Event Date</p>
                <p className="font-semibold">{formatDate(booking.eventDate)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Service Type</p>
                <p className="font-semibold">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Pickup Time</p>
                <p className="font-semibold">{booking.pickupTime}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Passengers</p>
                <p className="font-semibold">{booking.numberOfPassengers}</p>
              </div>
              {booking.numberOfHours && (
                <div>
                  <p className="text-gray-400 mb-1">Duration</p>
                  <p className="font-semibold">{booking.numberOfHours} hours</p>
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
                <p className="font-semibold">{booking.pickupLocation}</p>
              </div>
              {booking.dropoffLocation && (
                <div>
                  <p className="text-gray-400 mb-1">Dropoff Location</p>
                  <p className="font-semibold">{booking.dropoffLocation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          {booking.vehicle && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Vehicle</h2>
              <div className="space-y-2 text-sm">
                <p className="text-xl font-semibold">{booking.vehicle.name}</p>
                <p className="text-gray-400">{booking.vehicle.category}</p>
                {booking.vehicleDetails && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Details</p>
                    <p className="text-sm">{booking.vehicleDetails}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Driver Information */}
          {(booking.driverName || booking.driverPhone) && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Driver Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {booking.driverName && (
                  <div>
                    <p className="text-gray-400 mb-1">Driver Name</p>
                    <p className="font-semibold">{booking.driverName}</p>
                  </div>
                )}
                {booking.driverPhone && (
                  <div>
                    <p className="text-gray-400 mb-1">Driver Phone</p>
                    <a
                      href={`tel:${booking.driverPhone}`}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      {booking.driverPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Special Requests</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {booking.notes && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Invoices */}
          {booking.invoices.length > 0 && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Invoices</h2>
              <div className="space-y-3">
                {booking.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/admin/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors border border-white/10"
                  >
                    <div>
                      <p className="font-semibold">Invoice #{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {formatCurrency(Number(invoice.total))}
                      </p>
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

        {/* Right Column - Actions & Payment */}
        <div className="space-y-6">
          {/* Booking Actions */}
          <BookingActions
            booking={{
              id: booking.id,
              bookingNumber: booking.bookingNumber,
              status: booking.status,
              totalPrice: Number(booking.totalPrice),
              hasInvoice: booking.invoices.length > 0,
              eventDate: booking.eventDate.toISOString(),
              driverId: booking.driverId,
              vehicleId: booking.vehicleId,
            }}
          />

          {/* Payment Summary */}
          <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
            <h3 className="font-bold mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Price</span>
                <span className="font-bold">{formatCurrency(Number(booking.totalPrice))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Paid Amount</span>
                <span className="font-semibold text-green-400">
                  {formatCurrency(Number(booking.paidAmount))}
                </span>
              </div>
              {remainingBalance > 0 && (
                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="text-gray-400">Remaining</span>
                  <span className="font-bold text-orange-400">
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Related Quote */}
          {booking.quote && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h3 className="font-bold mb-3">Related Quote</h3>
              <Link
                href={`/admin/quotes/${booking.quoteId}`}
                className="text-blue-400 hover:underline"
              >
                Quote #{booking.quote.quoteNumber}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}