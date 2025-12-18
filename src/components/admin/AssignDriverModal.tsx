'use client';

import { useState, useEffect } from 'react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  _count: {
    bookings: number;
  };
}

interface Vehicle {
  id: string;
  name: string;
  category: string;
}

interface AssignDriverModalProps {
  bookingId: string;
  eventDate: string;
  currentDriverId?: string | null;
  currentVehicleId?: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AssignDriverModal({
  bookingId,
  eventDate,
  currentDriverId,
  currentVehicleId,
  onSuccess,
  onClose,
}: AssignDriverModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [formData, setFormData] = useState({
    driverId: currentDriverId || '',
    vehicleId: currentVehicleId || '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch drivers
      const driversResponse = await fetch('/api/admin/drivers');
      const driversData = await driversResponse.json();
      
      // Fetch vehicles
      const vehiclesResponse = await fetch('/api/admin/fleet/vehicles');
      const vehiclesData = await vehiclesResponse.json();

      if (driversData.success) {
        // Only show active drivers
        setDrivers(driversData.drivers.filter((d: Driver) => d.isActive));
      }

      if (vehiclesData.success) {
        // Only show active vehicles
        setVehicles(vehiclesData.vehicles.filter((v: any) => v.isActive));
      }

      setLoadingData(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load drivers and vehicles');
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: formData.driverId || null,
          vehicleId: formData.vehicleId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign driver/vehicle');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign driver/vehicle');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border-2 border-white/20 rounded-xl max-w-2xl w-full">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Assign Driver & Vehicle</h2>
          <p className="text-gray-400 text-sm mt-1">
            Assign driver and vehicle to this booking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading drivers and vehicles...</p>
            </div>
          ) : (
            <>
              {/* Driver Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Driver {formData.driverId ? '*' : '(Optional)'}
                </label>
                <select
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                >
                  <option value="">No driver assigned</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName} - {driver.phone}
                    </option>
                  ))}
                </select>
                {drivers.length === 0 && (
                  <p className="text-xs text-orange-400 mt-2">
                    No active drivers available. Add drivers first.
                  </p>
                )}
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vehicle {formData.vehicleId ? '*' : '(Optional)'}
                </label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                >
                  <option value="">No vehicle assigned</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.category})
                    </option>
                  ))}
                </select>
                {vehicles.length === 0 && (
                  <p className="text-xs text-orange-400 mt-2">
                    No active vehicles available. Add vehicles in Fleet Management.
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> You can assign both driver and vehicle, or just one of them. 
                  Leave blank to remove assignments.
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || loadingData}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingData}
              className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}