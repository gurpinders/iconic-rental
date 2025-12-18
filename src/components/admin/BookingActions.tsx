'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateInvoiceModal from './CreateInvoiceModal';
import AssignDriverModal from './AssignDriverModal';

interface BookingActionsProps {
  booking: {
    id: string;
    bookingNumber: string;
    status: string;
    totalPrice: number;
    hasInvoice: boolean;
    eventDate: string;
    driverId?: string | null;
    vehicleId?: string | null;
  };
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Change booking status to ${newStatus}?`)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      router.refresh();
    } catch (err) {
      setError('Failed to update status');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
        <h3 className="font-bold mb-4">Actions</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Assign Driver/Vehicle Button */}
          <button
            onClick={() => setShowAssignModal(true)}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/50 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {booking.driverId || booking.vehicleId ? '✏️ Update Assignment' : '👤 Assign Driver/Vehicle'}
          </button>

          {/* Create Invoice Button */}
          {!booking.hasInvoice && (
            <button
              onClick={() => setShowInvoiceModal(true)}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-900/50 hover:bg-green-900/70 border border-green-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              💰 Create Invoice
            </button>
          )}

          {/* Status Updates */}
          {booking.status === 'CONFIRMED' && (
            <button
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
              disabled={loading}
              className="w-full px-4 py-3 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              🚗 Mark as In Progress
            </button>
          )}

          {booking.status === 'IN_PROGRESS' && (
            <button
              onClick={() => handleStatusUpdate('COMPLETED')}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-900/50 hover:bg-green-900/70 border border-green-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              ✅ Mark as Completed
            </button>
          )}

          {/* Cancel Booking */}
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <button
              onClick={() => handleStatusUpdate('CANCELLED')}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              ❌ Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <CreateInvoiceModal
          bookingId={booking.id}
          bookingTotal={booking.totalPrice}
          onSuccess={() => {
            setShowInvoiceModal(false);
            router.refresh();
          }}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {/* Assign Driver Modal */}
      {showAssignModal && (
        <AssignDriverModal
          bookingId={booking.id}
          eventDate={booking.eventDate}
          currentDriverId={booking.driverId}
          currentVehicleId={booking.vehicleId}
          onSuccess={() => {
            setShowAssignModal(false);
            router.refresh();
          }}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </>
  );
}