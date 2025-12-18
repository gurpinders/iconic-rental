'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateBookingModal from './CreateBookingModal';

interface Vehicle {
  id: string;
  name: string;
  category: string;
}

interface QuoteActionsProps {
  quote: {
    id: string;
    quoteNumber: string;
    status: string;
    quotedPrice: number | null;
    notes: string | null;
    hasBooking: boolean;
  };
  vehicles: Vehicle[];
}

export default function QuoteActions({ quote, vehicles }: QuoteActionsProps) {
  const router = useRouter();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [priceForm, setPriceForm] = useState({
    price: quote.quotedPrice?.toString() || '',
  });

  const [notesForm, setNotesForm] = useState({
    notes: quote.notes || '',
  });

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
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

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotedPrice: parseFloat(priceForm.price),
          status: 'QUOTED',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set price');
      }

      setShowPriceModal(false);
      router.refresh();
    } catch (err) {
      setError('Failed to set price');
      setLoading(false);
    }
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesForm.notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notes');
      }

      setShowNotesModal(false);
      router.refresh();
    } catch (err) {
      setError('Failed to update notes');
      setLoading(false);
    }
  };

  const getNextStatus = () => {
    switch (quote.status) {
      case 'PENDING':
        return 'REVIEWING';
      case 'REVIEWING':
        return 'QUOTED';
      case 'QUOTED':
        return 'ACCEPTED';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

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
          {/* Create Booking Button */}
          {quote.status === 'ACCEPTED' && !quote.hasBooking && (
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-900/50 hover:bg-green-900/70 border border-green-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              ✅ Create Booking
            </button>
          )}

          {/* Status Progression */}
          {nextStatus && quote.status !== 'ACCEPTED' && (
            <button
              onClick={() => handleStatusUpdate(nextStatus)}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              Move to {nextStatus}
            </button>
          )}

          {/* Set/Update Price */}
          <button
            onClick={() => setShowPriceModal(true)}
            disabled={loading}
            className="w-full px-4 py-3 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/50 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {quote.quotedPrice ? '📝 Update Price' : '💰 Set Price'}
          </button>

          {/* Add/Update Notes */}
          <button
            onClick={() => setShowNotesModal(true)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-500/50 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {quote.notes ? '✏️ Edit Notes' : '📋 Add Notes'}
          </button>

          {/* Decline */}
          {quote.status !== 'DECLINED' && quote.status !== 'ACCEPTED' && (
            <button
              onClick={() => handleStatusUpdate('DECLINED')}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50"
            >
              ❌ Decline Quote
            </button>
          )}
        </div>
      </div>

      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-white/20 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Set Quote Price</h3>
            <form onSubmit={handlePriceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (CAD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceForm.price}
                  onChange={(e) => setPriceForm({ price: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPriceModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border-2 border-white/20 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Admin Notes</h3>
            <form onSubmit={handleNotesSubmit} className="space-y-4">
              <div>
                <textarea
                  value={notesForm.notes}
                  onChange={(e) => setNotesForm({ notes: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
                  placeholder="Add internal notes..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showBookingModal && (
        <CreateBookingModal
          quoteId={quote.id}
          vehicles={vehicles}
          onSuccess={() => {
            setShowBookingModal(false);
            router.refresh();
          }}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
}