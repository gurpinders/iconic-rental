'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  eventDate: string;
  pickupTime: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  driverName: string | null;
  driver: {
    firstName: string;
    lastName: string;
  } | null;
  vehicle: {
    name: string;
  } | null;
  totalPrice: number;
}

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-900/50 border-blue-500/50 text-blue-300';
      case 'IN_PROGRESS':
        return 'bg-purple-900/50 border-purple-500/50 text-purple-300';
      case 'COMPLETED':
        return 'bg-green-900/50 border-green-500/50 text-green-300';
      case 'CANCELLED':
        return 'bg-red-900/50 border-red-500/50 text-red-300';
      default:
        return 'bg-gray-900/50 border-gray-500/50 text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'ALL') return true;
    return booking.status === statusFilter;
  });

  // Group bookings by date
  const bookingsByDate: { [key: string]: Booking[] } = {};
  filteredBookings.forEach(booking => {
    const eventDate = new Date(booking.eventDate);
    const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
    if (!bookingsByDate[dateKey]) {
      bookingsByDate[dateKey] = [];
    }
    bookingsByDate[dateKey].push(booking);
  });

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Stats
  const currentMonthBookings = filteredBookings.filter(booking => {
    const eventDate = new Date(booking.eventDate);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });

  const confirmedCount = currentMonthBookings.filter(b => b.status === 'CONFIRMED').length;
  const completedCount = currentMonthBookings.filter(b => b.status === 'COMPLETED').length;
  const totalRevenue = currentMonthBookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="min-h-32 bg-zinc-900/50"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`;
    const dayBookings = bookingsByDate[dateKey] || [];
    const isTodayDate = isToday(day);

    calendarDays.push(
      <div
        key={day}
        className={`min-h-32 bg-zinc-900 border border-white/10 p-2 ${
          isTodayDate ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <div className={`text-sm font-semibold mb-1 ${isTodayDate ? 'text-blue-400' : 'text-gray-400'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayBookings.map(booking => (
            <Link
              key={booking.id}
              href={`/admin/bookings/${booking.id}`}
              className={`block text-xs p-1.5 rounded border ${getStatusColor(
                booking.status
              )} hover:opacity-80 transition-opacity`}
            >
              <div className="font-semibold truncate">
                {booking.pickupTime}
              </div>
              <div className="truncate">
                {booking.customer.firstName} {booking.customer.lastName}
              </div>
              {booking.driver && (
                <div className="truncate text-[10px] opacity-75">
                  🚗 {booking.driver.firstName} {booking.driver.lastName}
                </div>
              )}
              {booking.vehicle && (
                <div className="truncate text-[10px] opacity-75">
                  {booking.vehicle.name}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-zinc-800 rounded w-1/3 mb-8"></div>
          <div className="h-96 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
        <p className="text-gray-400">View and manage all bookings on calendar</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="px-4 py-2 bg-zinc-900 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-zinc-900 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Month/Year */}
        <h2 className="text-2xl font-bold">
          {monthNames[month]} {year}
        </h2>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none"
          >
            <option value="ALL">All Bookings</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-4 mb-8">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">{currentMonthBookings.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total bookings</p>
        </div>
        <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-blue-400">{confirmedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Pending service</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">{completedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Successfully done</p>
        </div>
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>
      </div>
    </div>
  );
}