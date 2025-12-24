import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminInvoicesPage() {
  // Fetch all invoices with related data
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: true,
      booking: {
        select: {
          bookingNumber: true,
          eventDate: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
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

  // Calculate stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'PAID');
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'PENDING');
  const overdueInvoices = invoices.filter(inv => {
    return inv.paymentStatus !== 'PAID' && 
           inv.dueDate && 
           new Date(inv.dueDate) < new Date();
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Invoices</h1>
        <p className="text-gray-400">Manage all customer invoices and payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">{invoices.length} total invoices</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-400">{paidInvoices.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(paidInvoices.reduce((sum, inv) => sum + Number(inv.total), 0))}
          </p>
        </div>
        <div className="bg-zinc-900 border border-orange-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-400">{pendingInvoices.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(pendingInvoices.reduce((sum, inv) => sum + Number(inv.total), 0))}
          </p>
        </div>
        <div className="bg-zinc-900 border border-red-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-400">{overdueInvoices.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + Number(inv.total), 0))}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr className="text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Booking</th>
                <th className="px-6 py-4 font-medium">Event Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="font-mono text-sm text-blue-400 hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-sm">
                          {invoice.customer.firstName} {invoice.customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {invoice.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${invoice.bookingId}`}
                        className="text-sm text-blue-400 hover:underline"
                      >
                        {invoice.booking.bookingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(invoice.booking.eventDate)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-lg">{formatCurrency(Number(invoice.total))}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getPaymentStatusColor(
                          invoice.paymentStatus
                        )}`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}