// File: src/components/admin/CreateBookingModal.tsx

'use client';

import { useState } from 'react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
}

interface CreateBookingModalProps {
  quoteId: string;
  vehicles: Vehicle[];
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateBookingModal({
  quoteId,
  vehicles,
  onSuccess,
  onClose,
}: CreateBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vehicleId: '',
    totalPrice: '',
    pickupTime: '',
    driverName: '',
    driverPhone: '',
    vehicleDetails: '',
    notes: '',
    createCustomerAccount: true,
    customerPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}/create-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: formData.vehicleId,
          totalPrice: parseFloat(formData.totalPrice),
          pickupTime: formData.pickupTime,
          driverName: formData.driverName || null,
          driverPhone: formData.driverPhone || null,
          vehicleDetails: formData.vehicleDetails || null,
          notes: formData.notes || null,
          createCustomerAccount: formData.createCustomerAccount,
          customerPassword: formData.customerPassword || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border-2 border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Create Booking</h2>
          <p className="text-gray-400 text-sm mt-1">Convert this quote into a confirmed booking</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle *</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Pickup Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Price (CAD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pickup Time *</label>
              <input
                type="time"
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Driver Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Driver Name (Optional)</label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Driver Phone (Optional)</label>
              <input
                type="tel"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Details (Optional)</label>
            <textarea
              value={formData.vehicleDetails}
              onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
              placeholder="License plate, color, special features..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
              placeholder="Internal notes..."
            />
          </div>

          {/* Customer Account */}
          <div className="border-t border-white/10 pt-5">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="createAccount"
                checked={formData.createCustomerAccount}
                onChange={(e) =>
                  setFormData({ ...formData, createCustomerAccount: e.target.checked })
                }
                className="mt-1"
              />
              <label htmlFor="createAccount" className="text-sm">
                <span className="font-medium">Create customer account</span>
                <p className="text-gray-400 text-xs mt-1">
                  Allow customer to access their booking online
                </p>
              </label>
            </div>

            {formData.createCustomerAccount && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Password *
                </label>
                <input
                  type="password"
                  value={formData.customerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPassword: e.target.value })
                  }
                  required={formData.createCustomerAccount}
                  minLength={8}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                  placeholder="Set a password for the customer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Customer will use this to log in. Minimum 8 characters.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}