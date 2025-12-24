import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

// Print Styles Component
function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        /* Hide everything except the invoice */
        body * {
          visibility: hidden;
        }
        
        .print-container,
        .print-container * {
          visibility: visible;
        }
        
        .print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white !important;
          color: black !important;
        }
        
        /* Hide non-printable elements */
        .no-print {
          display: none !important;
        }
        
        /* Remove backgrounds and borders */
        * {
          background: white !important;
          border-color: #000 !important;
          color: black !important;
        }
        
        /* Page setup */
        @page {
          margin: 0.75in;
          size: letter;
        }
        
        /* Typography */
        h1 { font-size: 24pt; margin-bottom: 8pt; }
        h2 { font-size: 18pt; margin-bottom: 6pt; }
        h3 { font-size: 14pt; margin-bottom: 4pt; }
        p, td, span { font-size: 11pt; line-height: 1.4; }
        
        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0;
        }
        
        th, td {
          padding: 8pt;
          border: 1pt solid #000;
          text-align: left;
        }
        
        th {
          background: #f0f0f0 !important;
          font-weight: bold;
        }
        
        /* Invoice header */
        .invoice-header {
          border-bottom: 2pt solid #000;
          padding-bottom: 12pt;
          margin-bottom: 12pt;
        }
        
        /* Invoice sections */
        .invoice-section {
          margin-bottom: 16pt;
          page-break-inside: avoid;
        }
        
        /* Total section */
        .invoice-total {
          background: #f0f0f0 !important;
          padding: 12pt;
          border: 2pt solid #000;
          margin-top: 12pt;
        }
        
        /* Avoid page breaks */
        .no-break {
          page-break-inside: avoid;
        }
        
        /* Links */
        a {
          color: black !important;
          text-decoration: none !important;
        }
      }
    `}</style>
  );
}

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
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
    <>
      <PrintStyles />
      <div className="max-w-5xl mx-auto print-container">
        {/* Back Button - Hide when printing */}
        <div className="mb-8 no-print">
          <Link
            href={`/admin/bookings/${invoice.bookingId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <span>←</span>
            <span>Back to Booking</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 invoice-header">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Company Logo */}
              <div className="mb-4">
                <Image
                  src="/logo_no_bg_simple.png"
                  alt="Iconic Limos Logo"
                  width={150}
                  height={75}
                  className="print:grayscale"
                />
              </div>
              <h1 className="text-4xl font-bold mb-2">Invoice #{invoice.invoiceNumber}</h1>
              <p className="text-gray-400 print:text-black">
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
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-8 mb-6 print:border-black">
          {/* Customer & Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10 invoice-section print:border-black">
            {/* Customer Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Bill To</h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-lg">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </p>
                <p className="text-gray-400 print:text-black">
                  {invoice.customer.email}
                </p>
                <p className="text-gray-400 print:text-black">
                  {invoice.customer.phone}
                </p>
                {invoice.customer.company && (
                  <p className="text-gray-400 print:text-black">{invoice.customer.company}</p>
                )}
              </div>
            </div>

            {/* Booking Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Service Details</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-400 print:text-black text-xs mb-1">Booking Number</p>
                  <p className="font-semibold">#{invoice.booking.bookingNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 print:text-black text-xs mb-1">Event Date</p>
                  <p className="font-semibold">{formatDate(invoice.booking.eventDate)}</p>
                </div>
                {invoice.booking.vehicle && (
                  <div>
                    <p className="text-gray-400 print:text-black text-xs mb-1">Vehicle</p>
                    <p className="font-semibold">{invoice.booking.vehicle.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8 invoice-section">
            <h2 className="text-xl font-bold mb-4">Invoice Summary</h2>
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center py-3 border-b border-white/10 print:border-black">
                <span className="text-gray-400 print:text-black">Subtotal</span>
                <span className="text-lg font-semibold">{formatCurrency(Number(invoice.subtotal))}</span>
              </div>

              {/* Promo Discount */}
              {Number(invoice.promoDiscount) > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-white/10 print:border-black">
                  <div>
                    <span className="text-gray-400 print:text-black">Promo Discount</span>
                    {invoice.promoCode && (
                      <p className="text-xs text-green-400 print:text-black mt-1">
                        Code: {invoice.promoCode.code}
                      </p>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-green-400 print:text-black">
                    -{formatCurrency(Number(invoice.promoDiscount))}
                  </span>
                </div>
              )}

              {/* Tax */}
              <div className="flex justify-between items-center py-3 border-b border-white/10 print:border-black">
                <span className="text-gray-400 print:text-black">Tax (HST 13%)</span>
                <span className="text-lg font-semibold">{formatCurrency(Number(invoice.tax))}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 bg-black/30 rounded-lg px-4 mt-4 invoice-total print:bg-gray-100">
                <span className="text-xl font-bold">Total Amount Due</span>
                <span className="text-3xl font-bold text-white print:text-black">{formatCurrency(Number(invoice.total))}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 invoice-section">
            {/* Payment Details */}
            <div>
              <h3 className="font-bold mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-400 print:text-black text-xs mb-1">Payment Status</p>
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
                    <p className="text-gray-400 print:text-black text-xs mb-1">Payment Method</p>
                    <p className="font-semibold">{invoice.paymentMethod}</p>
                  </div>
                )}
                {invoice.paidAt && (
                  <div>
                    <p className="text-gray-400 print:text-black text-xs mb-1">Paid On</p>
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
                  <p className="text-red-400 print:text-black text-sm mt-2">⚠️ Payment Overdue</p>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-8 border-t border-white/10 print:border-black invoice-section">
              <h3 className="font-bold mb-3">Notes</h3>
              <p className="text-sm text-gray-300 print:text-black whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Footer - Print Only */}
          <div className="mt-8 pt-8 border-t border-white/10 print:border-black text-center text-sm text-gray-400 print:text-black hidden print:block">
            <p className="font-semibold">Thank you for choosing Iconic Limos & Rentals</p>
            <p className="mt-2">Phone: +1 (416) 346-1400 | Email: psandhu0124@gmail.com</p>
            <p className="mt-1">Toronto, Ontario, Canada</p>
          </div>
        </div>

        {/* Action Buttons - Hide when printing */}
        <div className="flex gap-4 no-print">
          <Link
            href={`/admin/bookings/${invoice.bookingId}`}
            className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            View Booking
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            🖨️ Print Invoice
          </button>
        </div>
      </div>
    </>
  );
}