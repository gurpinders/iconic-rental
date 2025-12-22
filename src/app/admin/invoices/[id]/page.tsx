import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch invoice with related data
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      booking: {
        include: {
          vehicle: true,
        },
      },
      promoCode: true,
    },
  });

  if (!invoice) {
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

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(Number(amount));
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-900/50 text-green-300 border-green-500/50';
      case 'PENDING':
        return 'bg-orange-900/50 text-orange-300 border-orange-500/50';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/50';
      case 'OVERDUE':
        return 'bg-red-900/50 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/bookings/${invoice.bookingId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to Booking</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Invoice #{invoice.invoiceNumber}</h1>
            <p className="text-gray-400">
              Created on {formatDate(invoice.createdAt)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium inline-block border ${getPaymentStatusColor(
              invoice.paymentStatus
            )}`}
          >
            {invoice.paymentStatus}
          </span>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-8 mb-6">
        {/* Customer & Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Customer Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-lg">
                {invoice.customer.firstName} {invoice.customer.lastName}
              </p>
              <p className="text-gray-400">
                <a href={`mailto:${invoice.customer.email}`} className="text-blue-400 hover:underline">
                  {invoice.customer.email}
                </a>
              </p>
              <p className="text-gray-400">
                <a href={`tel:${invoice.customer.phone}`} className="text-blue-400 hover:underline">
                  {invoice.customer.phone}
                </a>
              </p>
              {invoice.customer.company && (
                <p className="text-gray-400">{invoice.customer.company}</p>
              )}
            </div>
          </div>

          {/* Booking Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Booking Number</p>
                <Link 
                  href={`/admin/bookings/${invoice.booking.id}`}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  #{invoice.booking.bookingNumber}
                </Link>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Event Date</p>
                <p className="font-semibold">{formatDate(invoice.booking.eventDate)}</p>
              </div>
              {invoice.booking.vehicle && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">Vehicle</p>
                  <p className="font-semibold">{invoice.booking.vehicle.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Invoice Summary</h2>
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-lg font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {/* Promo Discount */}
            {Number(invoice.promoDiscount) > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <div>
                  <span className="text-gray-400">Promo Discount</span>
                  {invoice.promoCode && (
                    <p className="text-xs text-green-400 mt-1">
                      Code: {invoice.promoCode.code}
                    </p>
                  )}
                </div>
                <span className="text-lg font-semibold text-green-400">
                  -{formatCurrency(invoice.promoDiscount)}
                </span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">Tax (HST 13%)</span>
              <span className="text-lg font-semibold">{formatCurrency(invoice.tax)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 bg-black/30 rounded-lg px-4 mt-4">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-bold text-white">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Details */}
          <div>
            <h3 className="font-bold mb-3">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Payment Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getPaymentStatusColor(
                    invoice.paymentStatus
                  )}`}
                >
                  {invoice.paymentStatus}
                </span>
              </div>
              {invoice.paymentMethod && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                  <p className="font-semibold">{invoice.paymentMethod}</p>
                </div>
              )}
              {invoice.paidAt && (
                <div>
                  <p className="text-gray-400 text-xs mb-1">Paid On</p>
                  <p className="font-semibold">{formatDate(invoice.paidAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Due Date */}
          {invoice.dueDate && (
            <div>
              <h3 className="font-bold mb-3">Due Date</h3>
              <p className="text-lg font-semibold">{formatDate(invoice.dueDate)}</p>
              {new Date(invoice.dueDate) < new Date() && invoice.paymentStatus !== 'PAID' && (
                <p className="text-red-400 text-sm mt-2">⚠️ Overdue</p>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="font-bold mb-3">Notes</h3>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href={`/admin/bookings/${invoice.bookingId}`}
          className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
        >
          View Booking
        </Link>
        {/* Future: Add "Send Invoice", "Mark as Paid", etc. */}
      </div>
    </div>
  );
}