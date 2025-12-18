import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function FleetDashboardPage() {
  // Fetch all vehicles with booking info
  const vehicles = await prisma.vehicle.findMany({
    include: {
      bookings: {
        where: {
          status: {
            in: ['CONFIRMED', 'IN_PROGRESS'],
          },
        },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          driver: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          eventDate: 'asc',
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Calculate stats
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.isActive).length;
  const inUseVehicles = vehicles.filter(v => {
    const now = new Date();
    return v.bookings.some(b => {
      const eventDate = new Date(b.eventDate);
      const isSameDay = eventDate.toDateString() === now.toDateString();
      return isSameDay && b.status === 'IN_PROGRESS';
    });
  }).length;
  
  const availableVehicles = activeVehicles - inUseVehicles;

  // Get upcoming bookings (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getVehicleStatus = (vehicle: any) => {
    const now = new Date();
    
    // Check if vehicle has a booking in progress today
    const inProgressToday = vehicle.bookings.some((b: any) => {
      const eventDate = new Date(b.eventDate);
      const isSameDay = eventDate.toDateString() === now.toDateString();
      return isSameDay && b.status === 'IN_PROGRESS';
    });

    if (inProgressToday) {
      return { status: 'In Use', color: 'bg-purple-500/20 text-purple-300 border-purple-500/50' };
    }

    if (!vehicle.isActive) {
      return { status: 'Inactive', color: 'bg-red-500/20 text-red-300 border-red-500/50' };
    }

    // Check if vehicle has upcoming bookings today
    const hasBookingToday = vehicle.bookings.some((b: any) => {
      const eventDate = new Date(b.eventDate);
      const isSameDay = eventDate.toDateString() === now.toDateString();
      return isSameDay && b.status === 'CONFIRMED';
    });

    if (hasBookingToday) {
      return { status: 'Scheduled', color: 'bg-blue-500/20 text-blue-300 border-blue-500/50' };
    }

    return { status: 'Available', color: 'bg-green-500/20 text-green-300 border-green-500/50' };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Fleet Management</h1>
          <p className="text-gray-400">Overview of your vehicle fleet</p>
        </div>
        <Link
          href="/admin/fleet/add"
          className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
        >
          + Add Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Vehicles</p>
          <p className="text-3xl font-bold">{totalVehicles}</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Available</p>
          <p className="text-3xl font-bold text-green-400">{availableVehicles}</p>
        </div>
        <div className="bg-zinc-900 border border-purple-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">In Use Today</p>
          <p className="text-3xl font-bold text-purple-400">{inUseVehicles}</p>
        </div>
        <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Active Fleet</p>
          <p className="text-3xl font-bold text-blue-400">{activeVehicles}</p>
        </div>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-400 mb-4">No vehicles in fleet</p>
          <p className="text-sm text-gray-500 mb-6">
            Add your first vehicle to start managing your fleet
          </p>
          <Link
            href="/admin/fleet/add"
            className="inline-block px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Add Your First Vehicle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const vehicleStatus = getVehicleStatus(vehicle);
            const upcomingBookings = vehicle.bookings.filter((b: any) => {
              const eventDate = new Date(b.eventDate);
              return eventDate >= new Date() && eventDate <= sevenDaysFromNow;
            });

            return (
              <Link
                key={vehicle.id}
                href={`/admin/fleet/${vehicle.id}`}
                className="block bg-zinc-900 border-2 border-white/10 rounded-xl p-6 hover:border-white/30 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Vehicle Image Placeholder */}
                <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-6xl">
                  🚗
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${vehicleStatus.color}`}
                  >
                    {vehicleStatus.status}
                  </span>
                  <span className="text-sm text-gray-400">{vehicle.category}</span>
                </div>

                {/* Vehicle Name */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-gray-200 transition-colors">
                  {vehicle.name}
                </h3>

                {/* Description */}
                {vehicle.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {vehicle.description}
                </p>
                )}

                {/* Total Bookings */}
                <div className="mb-4 p-3 bg-black/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold">{vehicle._count.bookings}</p>
                </div>

                {/* Upcoming Bookings */}
                {upcomingBookings.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">Next 7 Days: {upcomingBookings.length} bookings</p>
                    <div className="space-y-2">
                      {upcomingBookings.slice(0, 2).map((booking: any) => (
                        <div key={booking.id} className="text-xs bg-black/50 rounded p-2">
                          <p className="font-semibold text-gray-300">
                            {formatDate(booking.eventDate)}
                          </p>
                          <p className="text-gray-400">
                            {booking.customer.firstName} {booking.customer.lastName}
                          </p>
                          {booking.driver && (
                            <p className="text-gray-500">
                              👤 {booking.driver.firstName} {booking.driver.lastName}
                            </p>
                          )}
                        </div>
                      ))}
                      {upcomingBookings.length > 2 && (
                        <p className="text-xs text-gray-500">+{upcomingBookings.length - 2} more</p>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Arrow */}
                <div className="mt-4 text-right text-gray-400 group-hover:text-white transition-colors">
                  <span>View Details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/calendar"
          className="block bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/30 transition-colors"
        >
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-xl font-bold mb-2">View Calendar</h3>
          <p className="text-sm text-gray-400">See all bookings on the calendar</p>
        </Link>

        <Link
          href="/admin/drivers"
          className="block bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/30 transition-colors"
        >
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-xl font-bold mb-2">Manage Drivers</h3>
          <p className="text-sm text-gray-400">View and assign your driver team</p>
        </Link>

        <Link
          href="/admin/bookings"
          className="block bg-zinc-900 border border-white/20 rounded-lg p-6 hover:border-white/30 transition-colors"
        >
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-xl font-bold mb-2">All Bookings</h3>
          <p className="text-sm text-gray-400">View all confirmed bookings</p>
        </Link>
      </div>
    </div>
  );
}