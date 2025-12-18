import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminBookingsPage() {
  // Fetch all bookings
  const bookings = await prisma.booking.findMany({
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      vehicle: {
        select: {
          name: true,
        },
      },
      invoices: {
        select: {
          id: true,
          invoiceNumber: true,
          paymentStatus: true,
        },
      },
    },
    orderBy: {
      eventDate: 'desc',
    },
  });

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

  // Categorize bookings
  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.eventDate) > now && b.status !== 'CANCELLED' && b.status !== 'COMPLETED');
  const past = bookings.filter(b => new Date(b.eventDate) <= now || b.status === 'COMPLETED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bookings</h1>
        <p className="text-gray-400">Manage all confirmed bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
          <p className="text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-blue-400">{upcoming.length}</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">{past.length}</p>
        </div>
        <div className="bg-zinc-900 border border-red-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-red-400">{cancelled.length}</p>
        </div>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-400 mb-4">No bookings yet</p>
          <p className="text-sm text-gray-500">
            Bookings will appear here when you convert accepted quotes
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Booking #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-blue-400 hover:underline font-medium"
                      >
                        {booking.bookingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-400">{booking.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(booking.eventDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.eventType}
                    </td>
                    <td className="px-6 py-4">
                      {booking.vehicle?.name || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatCurrency(Number(booking.totalPrice))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.invoices.length > 0 ? (
                        <Link
                          href={`/admin/invoices/${booking.invoices[0].id}`}
                          className="text-green-400 hover:underline text-sm"
                        >
                          {booking.invoices[0].invoiceNumber}
                        </Link>
                      ) : (
                        <span className="text-gray-500 text-sm">No invoice</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}