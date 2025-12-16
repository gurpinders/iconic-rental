'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  quotedPrice: any;
  notes: string | null;
}

export default function QuoteActions({ quote }: { quote: Quote }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [price, setPrice] = useState(quote.quotedPrice?.toString() || '');
  const [notes, setNotes] = useState(quote.notes || '');

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Update status to ${newStatus}?`)) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update');

      router.refresh();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotedPrice: parseFloat(price) }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setShowPriceForm(false);
      router.refresh();
    } catch (error) {
      alert('Failed to update price');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to update');

      setShowNotesForm(false);
      router.refresh();
    } catch (error) {
      alert('Failed to update notes');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
        Actions
      </h2>

      {/* Status Actions */}
      <div className="space-y-3 mb-8">
        <p className="text-sm font-medium text-gray-400 mb-3">Update Status</p>
        
        {quote.status === 'PENDING' && (
          <button
            onClick={() => updateStatus('REVIEWING')}
            disabled={isUpdating}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors disabled:opacity-50"
          >
            Start Reviewing
          </button>
        )}

        {quote.status === 'REVIEWING' && (
          <>
            <button
              onClick={() => updateStatus('QUOTED')}
              disabled={isUpdating}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded transition-colors disabled:opacity-50"
            >
              Mark as Quoted
            </button>
            <button
              onClick={() => updateStatus('DECLINED')}
              disabled={isUpdating}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors disabled:opacity-50"
            >
              Reject Quote
            </button>
          </>
        )}

        {quote.status === 'QUOTED' && (
          <>
            <button
              onClick={() => updateStatus('ACCEPTED')}
              disabled={isUpdating}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors disabled:opacity-50"
            >
              Mark as Accepted
            </button>
            <button
              onClick={() => updateStatus('DECLINED')}
              disabled={isUpdating}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors disabled:opacity-50"
            >
              Reject Quote
            </button>
          </>
        )}

        {quote.status === 'ACCEPTED' && (
          <button
            onClick={() => updateStatus('COMPLETED')}
            disabled={isUpdating}
            className="w-full px-4 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded transition-colors disabled:opacity-50"
          >
            Mark as Completed
          </button>
        )}
      </div>

      {/* Price Form */}
      <div className="mb-8">
        {!showPriceForm ? (
          <button
            onClick={() => setShowPriceForm(true)}
            className="w-full px-4 py-3 border border-white/20 hover:bg-white/5 text-white font-medium rounded transition-colors"
          >
            {quote.quotedPrice ? 'Update Price' : 'Add Price'}
          </button>
        ) : (
          <form onSubmit={updatePrice} className="space-y-3">
            <label className="block text-sm font-medium text-gray-400">Quote Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-white text-black hover:bg-gray-200 font-medium rounded transition-colors disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowPriceForm(false)}
                className="flex-1 px-4 py-2 border border-white/20 hover:bg-white/5 font-medium rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Notes Form */}
      <div>
        {!showNotesForm ? (
          <button
            onClick={() => setShowNotesForm(true)}
            className="w-full px-4 py-3 border border-white/20 hover:bg-white/5 text-white font-medium rounded transition-colors"
          >
            {quote.notes ? 'Update Notes' : 'Add Notes'}
          </button>
        ) : (
          <form onSubmit={updateNotes} className="space-y-3">
            <label className="block text-sm font-medium text-gray-400">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this quote..."
              rows={4}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-white text-black hover:bg-gray-200 font-medium rounded transition-colors disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowNotesForm(false)}
                className="flex-1 px-4 py-2 border border-white/20 hover:bg-white/5 font-medium rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}