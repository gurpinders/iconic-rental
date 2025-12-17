'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
}

interface Vehicle {
  name: string;
  category: string;
}

interface Booking {
  bookingNumber: string;
  eventDate: string;
  eventType: string;
  serviceType: string;
  pickupLocation: string;
  dropoffLocation: string | null;
  numberOfPassengers: number;
  numberOfHours: number | null;
  vehicle: Vehicle | null;
}

interface PromoCode {
  code: string;
  discountType: string;
  discountValue: number;
  description: string | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  promoDiscount: number;
  tax: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
  dueDate: string | null;
  notes: string | null;
  customer: Customer;
  booking: Booking;
  promoCode: PromoCode | null;
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setInvoiceId(p.id));
  }, [params]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/customer/invoices/${invoiceId}`);
      const data = await response.json();

      if (!response.ok) {
        router.push('/customer/invoices');
        return;
      }

      setInvoice(data.invoice);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      router.push('/customer/invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'PENDING':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'OVERDUE':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
      <div className="max-w-4xl mx-auto pt-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-96 bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-16">
      {/* Back Button */}
      <Link
        href="/customer/invoices"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <span>←</span>
        <span>Back to Invoices</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-5xl font-bold mb-2">Invoice</h1>
            <p className="text-gray-400 text-xl">#{invoice.invoiceNumber}</p>
          </div>
          <span className={`px-6 py-3 rounded-full text-sm font-bold border-2 uppercase tracking-wide ${getStatusColor(invoice.paymentStatus)}`}>
            {invoice.paymentStatus}
          </span>
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8 md:p-10 mb-6">
        
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
          {/* Company Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">From</h2>
            <p className="text-2xl font-bold mb-2">Iconic Limos & Rentals</p>
            <p className="text-gray-400">Toronto, ON</p>
            <p className="text-gray-400">info@iconiclimos.com</p>
            <p className="text-gray-400">(416) 123-4567</p>
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Bill To</h2>
            <p className="text-xl font-bold mb-2">
              {invoice.customer.firstName} {invoice.customer.lastName}
            </p>
            {invoice.customer.company && (
              <p className="text-gray-400 mb-1">{invoice.customer.company}</p>
            )}
            <p className="text-gray-400">{invoice.customer.email}</p>
            <p className="text-gray-400">{invoice.customer.phone}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-white/10">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Invoice Date</p>
            <p className="font-semibold">{formatDate(invoice.createdAt)}</p>
          </div>
          {invoice.dueDate && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Due Date</p>
              <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
            </div>
          )}
          {invoice.paidAt && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Paid On</p>
              <p className="font-semibold text-green-400">{formatDate(invoice.paidAt)}</p>
            </div>
          )}
          {invoice.paymentMethod && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Payment Method</p>
              <p className="font-semibold">{invoice.paymentMethod}</p>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="mb-10 pb-10 border-b border-white/10">
          <h2 className="text-2xl font-bold mb-6">Service Details</h2>
          <div className="bg-black/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Booking Number:</span>
                <span className="ml-2 font-semibold">#{invoice.booking.bookingNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Event Date:</span>
                <span className="ml-2 font-semibold">{formatDate(invoice.booking.eventDate)}</span>
              </div>
              <div>
                <span className="text-gray-500">Event Type:</span>
                <span className="ml-2 font-semibold">{invoice.booking.eventType}</span>
              </div>
              <div>
                <span className="text-gray-500">Service Type:</span>
                <span className="ml-2 font-semibold">{invoice.booking.serviceType}</span>
              </div>
              <div>
                <span className="text-gray-500">Passengers:</span>
                <span className="ml-2 font-semibold">{invoice.booking.numberOfPassengers}</span>
              </div>
              {invoice.booking.numberOfHours && (
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-semibold">{invoice.booking.numberOfHours} hours</span>
                </div>
              )}
              {invoice.booking.vehicle && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Vehicle:</span>
                  <span className="ml-2 font-semibold">{invoice.booking.vehicle.name}</span>
                </div>
              )}
              <div className="md:col-span-2">
                <span className="text-gray-500">Pickup:</span>
                <span className="ml-2 font-medium">{invoice.booking.pickupLocation}</span>
              </div>
              {invoice.booking.dropoffLocation && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Dropoff:</span>
                  <span className="ml-2 font-medium">{invoice.booking.dropoffLocation}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-10 pb-10 border-b border-white/10">
          <h2 className="text-2xl font-bold mb-6">Charges</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-400">Service Subtotal</span>
              <span className="font-semibold">{formatCurrency(Number(invoice.subtotal))}</span>
            </div>
            
            {invoice.promoCode && Number(invoice.promoDiscount) > 0 && (
              <div className="flex justify-between items-center text-lg">
                <div>
                  <span className="text-green-400">Promo Code Applied</span>
                  <span className="ml-2 text-sm text-gray-500">({invoice.promoCode.code})</span>
                </div>
                <span className="font-semibold text-green-400">
                  -{formatCurrency(Number(invoice.promoDiscount))}
                </span>
              </div>
            )}

            {Number(invoice.tax) > 0 && (
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-400">Tax</span>
                <span className="font-semibold">{formatCurrency(Number(invoice.tax))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-black/50 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">Total Amount</span>
            <span className="text-4xl font-bold">{formatCurrency(Number(invoice.total))}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-10 pt-10 border-t border-white/10">
            <h3 className="text-lg font-bold mb-3">Notes</h3>
            <p className="text-gray-400 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/customer/bookings/${invoice.booking.bookingNumber}`}
          className="flex-1 btn-secondary text-center py-4 text-lg"
        >
          View Booking Details
        </Link>
        <button
          onClick={() => window.print()}
          className="flex-1 btn-primary text-center py-4 text-lg"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}