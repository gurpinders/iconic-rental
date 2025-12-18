import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDriversPage() {
  // Fetch all drivers
  const drivers = await prisma.driver.findMany({
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      firstName: 'asc',
    },
  });

  const activeDrivers = drivers.filter(d => d.isActive);
  const inactiveDrivers = drivers.filter(d => !d.isActive);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Drivers</h1>
          <p className="text-gray-400">Manage your driver team</p>
        </div>
        <Link
          href="/admin/drivers/create"
          className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
        >
          + Add Driver
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Drivers</p>
          <p className="text-3xl font-bold">{drivers.length}</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-green-400">{activeDrivers.length}</p>
        </div>
        <div className="bg-zinc-900 border border-red-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Inactive</p>
          <p className="text-3xl font-bold text-red-400">{inactiveDrivers.length}</p>
        </div>
      </div>

      {/* Drivers Grid */}
      {drivers.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-400 mb-4">No drivers yet</p>
          <Link
            href="/admin/drivers/create"
            className="inline-block px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Add Your First Driver
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <Link
              key={driver.id}
              href={`/admin/drivers/${driver.id}`}
              className="block bg-zinc-900 border-2 border-white/10 rounded-xl p-6 hover:border-white/30 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    driver.isActive
                      ? 'bg-green-500/20 text-green-300 border-green-500/50'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}
                >
                  {driver.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Driver Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1 group-hover:text-gray-200 transition-colors">
                  {driver.firstName} {driver.lastName}
                </h3>
                {driver.employeeNumber && (
                  <p className="text-sm text-gray-500">ID: {driver.employeeNumber}</p>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📧</span>
                  <span className="truncate">{driver.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📱</span>
                  <span>{driver.phone}</span>
                </div>
              </div>

              {/* License Info */}
              {driver.licenseNumber && (
                <div className="mb-4 p-3 bg-black/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">License</p>
                  <p className="font-mono text-sm">{driver.licenseNumber}</p>
                  {driver.licenseExpiry && (
                    <p className="text-xs text-gray-400 mt-1">
                      Exp: {formatDate(driver.licenseExpiry)}
                    </p>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold">{driver._count.bookings}</p>
                </div>
                {driver.hireDate && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Hired</p>
                    <p className="text-sm font-medium">{formatDate(driver.hireDate)}</p>
                  </div>
                )}
              </div>

              {/* Edit Arrow */}
              <div className="mt-4 text-right text-gray-400 group-hover:text-white transition-colors">
                <span>Edit →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}