'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Vehicle {
  id: string;
  name: string;
  category: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface CreateBookingModalProps {
  quoteId: string;
  vehicles: Vehicle[];
  drivers: Driver[];
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateBookingModal({
  quoteId,
  vehicles,
  drivers,
  onSuccess,
  onClose,
}: CreateBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    totalPrice: '',
    pickupTime: '',
    driverId: '',
    driverName: '',
    driverPhone: '',
    vehicleDetails: '',
    notes: '',
  });

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setFormData({
        ...formData,
        pickupTime: `${hours}:${minutes}`
      });
    }
  };

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = e.target.value;
    
    if (driverId) {
      const selectedDriver = drivers.find(d => d.id === driverId);
      if (selectedDriver) {
        setFormData({
          ...formData,
          driverId,
          driverName: `${selectedDriver.firstName} ${selectedDriver.lastName}`,
          driverPhone: selectedDriver.phone,
        });
      }
    } else {
      setFormData({
        ...formData,
        driverId: '',
        driverName: '',
        driverPhone: '',
      });
    }
  };

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
          createCustomerAccount: false, // Always false now
          customerPassword: null,
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
      <style jsx global>{`
        /* Custom DatePicker Styles for Modal */
        .react-datepicker {
          background-color: #18181b !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 12px !important;
          font-family: inherit !important;
        }
        
        .react-datepicker__header {
          background-color: #000000 !important;
          border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 12px 12px 0 0 !important;
          padding-top: 12px !important;
        }
        
        .react-datepicker__time-container {
          border-left: 1px solid rgba(255,255,255,0.2) !important;
        }
        
        .react-datepicker__time {
          background-color: #18181b !important;
        }
        
        .react-datepicker__time-list {
          background-color: #18181b !important;
        }
        
        .react-datepicker__time-list-item {
          color: #a1a1aa !important;
          transition: all 0.2s !important;
        }
        
        .react-datepicker__time-list-item:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
        
        .react-datepicker__time-list-item--selected {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: bold !important;
        }
        
        .react-datepicker-popper {
          z-index: 9999 !important;
        }
      `}</style>

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
            <div className="select-wrapper">
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
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
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Click to select time"
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Driver Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Driver (Optional)</label>
              <div className="select-wrapper">
                <select
                  value={formData.driverId}
                  onChange={handleDriverChange}
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Driver Phone</label>
              <input
                type="tel"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                readOnly
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded focus:border-white/50 focus:outline-none text-gray-400"
                placeholder="Auto-filled from driver"
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

          {/* Customer Account Info */}
          <div className="border-t border-white/10 pt-5">
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-blue-300 mb-1">Customer Account</p>
                  <p className="text-blue-200">
                    Customer can create their own account at any time to track their booking online. 
                    They'll use their booking email to register and set their own password.
                  </p>
                </div>
              </div>
            </div>
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