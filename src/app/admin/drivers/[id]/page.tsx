'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string | null;
  licenseExpiry: string | null;
  licenseClass: string | null;
  employeeNumber: string | null;
  hireDate: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  bookings: any[];
  _count: {
    bookings: number;
  };
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseClass: '',
    employeeNumber: '',
    hireDate: '',
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    params.then(p => setDriverId(p.id));
  }, [params]);

  useEffect(() => {
    if (driverId) {
      fetchDriver();
    }
  }, [driverId]);

  const fetchDriver = async () => {
    try {
      const response = await fetch(`/api/admin/drivers/${driverId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch driver');
      }

      const driverData = data.driver;
      setDriver(driverData);

      // Set form data
      setFormData({
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        email: driverData.email,
        phone: driverData.phone,
        licenseNumber: driverData.licenseNumber || '',
        licenseExpiry: driverData.licenseExpiry ? new Date(driverData.licenseExpiry).toISOString().split('T')[0] : '',
        licenseClass: driverData.licenseClass || '',
        employeeNumber: driverData.employeeNumber || '',
        hireDate: driverData.hireDate ? new Date(driverData.hireDate).toISOString().split('T')[0] : '',
        notes: driverData.notes || '',
        isActive: driverData.isActive,
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch driver');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update driver');
      }

      setEditing(false);
      fetchDriver();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update driver');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this driver? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete driver');
      }

      router.push('/admin/drivers');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete driver');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
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
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-96 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return null;
  }

  // Calculate upcoming bookings
  const now = new Date();
  const upcomingBookings = driver.bookings.filter(b => new Date(b.eventDate) > now && b.status !== 'CANCELLED');
  const completedBookings = driver.bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/drivers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to Drivers</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {driver.firstName} {driver.lastName}
            </h1>
            {driver.employeeNumber && (
              <p className="text-gray-400">Employee #{driver.employeeNumber}</p>
            )}
          </div>
          <div className="flex gap-3">
            {!editing && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={driver._count.bookings > 0}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={driver._count.bookings > 0 ? 'Cannot delete driver with bookings' : 'Delete driver'}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold">{driver._count.bookings}</p>
          </div>
          <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-400">{upcomingBookings.length}</p>
          </div>
          <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-400">{completedBookings.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Driver Info */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-lg p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* License */}
              <div>
                <h2 className="text-xl font-bold mb-4">License Information</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">License Number</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">License Class</label>
                    <input
                      type="text"
                      value={formData.licenseClass}
                      onChange={(e) => setFormData({ ...formData, licenseClass: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">License Expiry</label>
                    <input
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Employment */}
              <div>
                <h2 className="text-xl font-bold mb-4">Employment Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee Number</label>
                    <input
                      type="text"
                      value={formData.employeeNumber}
                      onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hire Date</label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-black/50 border border-white/10 rounded">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="isActive" className="font-medium">
                  Driver is active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Personal Info */}
              <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Email</p>
                    <a href={`mailto:${driver.email}`} className="font-semibold text-blue-400 hover:underline">
                      {driver.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Phone</p>
                    <a href={`tel:${driver.phone}`} className="font-semibold text-blue-400 hover:underline">
                      {driver.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* License Info */}
              {driver.licenseNumber && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">License Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">License Number</p>
                      <p className="font-mono font-semibold">{driver.licenseNumber}</p>
                    </div>
                    {driver.licenseClass && (
                      <div>
                        <p className="text-gray-400 mb-1">Class</p>
                        <p className="font-semibold">{driver.licenseClass}</p>
                      </div>
                    )}
                    {driver.licenseExpiry && (
                      <div>
                        <p className="text-gray-400 mb-1">Expiry Date</p>
                        <p className="font-semibold">{formatDate(driver.licenseExpiry)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {driver.notes && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Notes</h2>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{driver.notes}</p>
                </div>
              )}

              {/* Recent Bookings */}
              {driver.bookings.length > 0 && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                  <div className="space-y-3">
                    {driver.bookings.slice(0, 5).map((booking: any) => (
                      <Link
                        key={booking.id}
                        href={`/admin/bookings/${booking.id}`}
                        className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors border border-white/10"
                      >
                        <div>
                          <p className="font-semibold">Booking #{booking.bookingNumber}</p>
                          <p className="text-sm text-gray-400">
                            {booking.customer.firstName} {booking.customer.lastName} • {formatDate(booking.eventDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatCurrency(Number(booking.totalPrice))}</p>
                          <p className="text-xs text-gray-400">{booking.vehicle?.name || 'No vehicle'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h3 className="font-bold mb-4">Status</h3>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold border block text-center ${
                driver.isActive
                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                  : 'bg-red-500/20 text-red-300 border-red-500/50'
              }`}
            >
              {driver.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Employment Info */}
          {driver.hireDate && (
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
              <h3 className="font-bold mb-3">Employment</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-400">Hire Date</p>
                  <p className="font-semibold">{formatDate(driver.hireDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href={`tel:${driver.phone}`}
                className="block w-full px-4 py-3 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/50 rounded text-center font-semibold transition-colors"
              >
                📞 Call Driver
              </a>
              <a
                href={`mailto:${driver.email}`}
                className="block w-full px-4 py-3 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/50 rounded text-center font-semibold transition-colors"
              >
                ✉️ Email Driver
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}