'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface VehicleImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

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
  images: VehicleImage[];
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
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addingImage, setAddingImage] = useState(false);

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
    'LIMO',
    'PARTY_BUS',
    'SPRINTER_VAN',
  ];

  useEffect(() => {
    params.then(p => setVehicleId(p.id));
  }, [params]);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;

    setAddingImage(true);
    try {
      const response = await fetch(`/api/admin/fleet/vehicles/${vehicleId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newImageUrl,
          alt: vehicle?.name || 'Vehicle image',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add image');
      }

      setNewImageUrl('');
      fetchVehicle();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/fleet/vehicles/${vehicleId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      fetchVehicle();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete image');
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
          <div className="h-12 bg-zinc-800 rounded-xl w-1/3"></div>
          <div className="h-96 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return null;
  }

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
      <div className="mb-8">
        <Link
          href="/admin/fleet"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to Fleet</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
            <p className="text-gray-400">{vehicle.category.replace(/_/g, ' ')}</p>
          </div>
          <div className="flex gap-3">
            {!editing && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={vehicle._count.bookings > 0}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title={vehicle._count.bookings > 0 ? 'Cannot delete vehicle with bookings' : 'Delete vehicle'}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold">{vehicle._count.bookings}</p>
          </div>
          <div className="bg-zinc-900 border border-blue-500/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-400">{upcomingBookings.length}</p>
          </div>
          <div className="bg-zinc-900 border border-green-500/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-400">{completedBookings.length}</p>
          </div>
          <div className="bg-zinc-900 border border-purple-500/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-xl p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

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
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace(/_/g, ' ')}
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
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none resize-none cursor-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none resize-none cursor-text"
                    />
                  </div>
                </div>
              </div>

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
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-text"
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
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-text"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Main Image URL (fallback)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-text"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/50 border border-white/10 rounded-xl">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="isActive" className="font-medium cursor-pointer">
                  Vehicle is active
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Photo Gallery ({vehicle.images?.length || 0} photos)
                </h2>

                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {vehicle.images.sort((a, b) => a.order - b.order).map((image, index) => (
                      <div key={image.id} className="relative group rounded-xl overflow-hidden border-2 border-white/20">
                        <div className="relative aspect-video">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                          #{index + 1}
                        </div>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 mb-6 border border-white/10 rounded-xl bg-black/20">
                    <p className="text-gray-400">No images yet</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-6">
                  <label className="block text-sm font-semibold mb-3">Add New Image</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 bg-black border border-white/20 rounded-xl focus:border-white/50 focus:outline-none cursor-text"
                    />
                    <button
                      onClick={handleAddImage}
                      disabled={!newImageUrl.trim() || addingImage}
                      className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {addingImage ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {vehicle.description && (
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features && (
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Features</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{vehicle.features}</p>
                </div>
              )}

              {(vehicle.basePrice || vehicle.hourlyRate) && (
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
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

              {vehicle.bookings.length > 0 && (
                <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                  <div className="space-y-3">
                    {vehicle.bookings.slice(0, 5).map((booking: any) => (
                      <Link
                        key={booking.id}
                        href={`/admin/bookings/${booking.id}`}
                        className="flex items-center justify-between p-4 bg-black/50 rounded-xl hover:bg-black/70 transition-colors border border-white/10 cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold">Booking #{booking.bookingNumber}</p>
                          <p className="text-sm text-gray-400">
                            {booking.customer.firstName} {booking.customer.lastName} • {formatDate(booking.eventDate)}
                          </p>
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

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
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

          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
            <h3 className="font-bold mb-3">Category</h3>
            <p className="text-xl font-semibold">{vehicle.category.replace(/_/g, ' ')}</p>
          </div>

          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
            <h3 className="font-bold mb-3">Added to Fleet</h3>
            <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
          </div>

          <div className="bg-zinc-900 border border-white/20 rounded-xl p-6">
            <h3 className="font-bold mb-3">Gallery Images</h3>
            <p className="text-3xl font-bold">{vehicle.images?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}