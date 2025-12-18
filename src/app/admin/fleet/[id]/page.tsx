'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string | null;
  features: string | null;
  basePrice: number | null;
  hourlyRate: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  bookings: any[];
  _count: {
    bookings: number;
  };
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'SEDAN',
    description: '',
    features: '',
    basePrice: '',
    hourlyRate: '',
    imageUrl: '',
    isActive: true,
  });

  const categories = [
    'SEDAN',
    'SUV',
    'LUXURY',
    'VAN',
    'BUS',
    'LIMOUSINE',
    'SPRINTER',
  ];

  useEffect(() => {
    params.then(p => setVehicleId(p.id));
  }, [params]);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/admin/fleet/vehicles/${vehicleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vehicle');
      }

      const vehicleData = data.vehicle;
      setVehicle(vehicleData);

      // Set form data
      setFormData({
        name: vehicleData.name,
        category: vehicleData.category,
        description: vehicleData.description || '',
        features: vehicleData.features || '',
        basePrice: vehicleData.basePrice?.toString() || '',
        hourlyRate: vehicleData.hourlyRate?.toString() || '',
        imageUrl: vehicleData.imageUrl || '',
        isActive: vehicleData.isActive,
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicle');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/fleet/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description || null,
          features: formData.features || null,
          basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          imageUrl: formData.imageUrl || null,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update vehicle');
      }

      setEditing(false);
      fetchVehicle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vehicle? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/fleet/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete vehicle');
      }

      router.push('/admin/fleet');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
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

  if (!vehicle) {
    return null;
  }

  // Calculate stats
  const upcomingBookings = vehicle.bookings.filter(b => {
    const eventDate = new Date(b.eventDate);
    return eventDate >= new Date() && b.status !== 'CANCELLED';
  });

  const completedBookings = vehicle.bookings.filter(b => b.status === 'COMPLETED');

  const totalRevenue = vehicle.bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/fleet"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to Fleet</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
            <p className="text-gray-400">{vehicle.category}</p>
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
                  disabled={vehicle._count.bookings > 0}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={vehicle._count.bookings > 0 ? 'Cannot delete vehicle with bookings' : 'Delete vehicle'}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold">{vehicle._count.bookings}</p>
          </div>
          <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-400">{upcomingBookings.length}</p>
          </div>
          <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-400">{completedBookings.length}</p>
          </div>
          <div className="bg-zinc-900 border border-purple-500/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vehicle Info */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-lg p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vehicle Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Features</label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-bold mb-4">Pricing</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price (CAD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate (CAD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
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
                  Vehicle is active
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
              {/* Vehicle Image */}
              {vehicle.imageUrl ? (
                <div className="bg-zinc-900 border border-white/20 rounded-lg overflow-hidden">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🚗</div>
                    <p className="text-gray-400">No image available</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {vehicle.description && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{vehicle.description}</p>
                </div>
              )}

              {/* Features */}
              {vehicle.features && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Features</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{vehicle.features}</p>
                </div>
              )}

              {/* Pricing */}
              {(vehicle.basePrice || vehicle.hourlyRate) && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Pricing</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {vehicle.basePrice && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Base Price</p>
                        <p className="text-2xl font-bold">{formatCurrency(vehicle.basePrice)}</p>
                      </div>
                    )}
                    {vehicle.hourlyRate && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Hourly Rate</p>
                        <p className="text-2xl font-bold">{formatCurrency(vehicle.hourlyRate)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              {vehicle.bookings.length > 0 && (
                <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                  <div className="space-y-3">
                    {vehicle.bookings.slice(0, 5).map((booking: any) => (
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
                          {booking.driver && (
                            <p className="text-xs text-gray-500">
                              Driver: {booking.driver.firstName} {booking.driver.lastName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatCurrency(Number(booking.totalPrice))}</p>
                          <p className="text-xs text-gray-400">{booking.status}</p>
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
                vehicle.isActive
                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                  : 'bg-red-500/20 text-red-300 border-red-500/50'
              }`}
            >
              {vehicle.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Category */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h3 className="font-bold mb-3">Category</h3>
            <p className="text-xl font-semibold">{vehicle.category}</p>
          </div>

          {/* Added Date */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
            <h3 className="font-bold mb-3">Added to Fleet</h3>
            <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}