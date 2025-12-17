'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  bookingNumber: string;
  eventDate: string;
  eventType: string;
  vehicle: {
    name: string;
  } | null;
}

interface PromoCode {
  code: string;
  discountType: string;
  discountValue: number;
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
  booking: Booking;
  promoCode: PromoCode | null;
}

interface Categorized {
  pending: Invoice[];
  paid: Invoice[];
  overdue: Invoice[];
  all: Invoice[];
}

interface Totals {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [categorized, setCategorized] = useState<Categorized>({
    pending: [],
    paid: [],
    overdue: [],
    all: [],
  });
  const [totals, setTotals] = useState<Totals>({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/customer/invoices');
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
        setCategorized(data.categorized);
        setTotals(data.totals);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
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
      month: 'short',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentInvoices = categorized[activeTab];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Invoices</h1>
        <p className="text-gray-400 text-xl">View and manage your payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border-2 border-white/10 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Invoiced</p>
          <p className="text-4xl font-bold">{formatCurrency(totals.totalAmount)}</p>
        </div>
        <div className="bg-zinc-900 border-2 border-green-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Paid</p>
          <p className="text-4xl font-bold text-green-400">{formatCurrency(totals.paidAmount)}</p>
        </div>
        <div className="bg-zinc-900 border-2 border-orange-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-4xl font-bold text-orange-400">{formatCurrency(totals.pendingAmount)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-10">
        <div className="inline-flex bg-zinc-900 border border-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'all'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
            <span className="ml-2 text-sm">({categorized.all.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending
            <span className="ml-2 text-sm">({categorized.pending.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'paid'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Paid
            <span className="ml-2 text-sm">({categorized.paid.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-8 py-4 font-semibold rounded-md transition-all ${
              activeTab === 'overdue'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overdue
            <span className="ml-2 text-sm">({categorized.overdue.length})</span>
          </button>
        </div>
      </div>

      {/* Invoices List */}
      {currentInvoices.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-2xl p-16 text-center">
          <div className="text-8xl mb-6">💰</div>
          <h3 className="text-3xl font-bold mb-4">No {activeTab === 'all' ? '' : activeTab} invoices</h3>
          <p className="text-gray-400 text-lg">
            You don't have any {activeTab === 'all' ? '' : activeTab} invoices yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentInvoices.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/customer/invoices/${invoice.id}`}
              className="block bg-zinc-900 border-2 border-white/10 rounded-xl p-6 hover:border-white/30 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-gray-200 transition-colors">
                        Invoice #{invoice.invoiceNumber}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Booking #{invoice.booking.bookingNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Event Date:</span>
                      <span className="ml-2 font-medium">{formatDate(invoice.booking.eventDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Event Type:</span>
                      <span className="ml-2 font-medium">{invoice.booking.eventType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Invoice Date:</span>
                      <span className="ml-2 font-medium">{formatDate(invoice.createdAt)}</span>
                    </div>
                    {invoice.paidAt && (
                      <div>
                        <span className="text-gray-500">Paid On:</span>
                        <span className="ml-2 font-medium text-green-400">{formatDate(invoice.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex lg:flex-col items-center lg:items-end gap-4">
                  <span className={`px-6 py-3 rounded-full text-sm font-bold border-2 uppercase tracking-wide ${getStatusColor(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </span>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{formatCurrency(Number(invoice.total))}</p>
                    <p className="text-xs text-gray-400 mt-1">View Details →</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}