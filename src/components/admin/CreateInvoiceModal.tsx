'use client';

import { useState, useEffect } from 'react';

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
}

interface CreateInvoiceModalProps {
  bookingId: string;
  bookingTotal: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateInvoiceModal({
  bookingId,
  bookingTotal,
  onSuccess,
  onClose,
}: CreateInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);

  const [formData, setFormData] = useState({
    subtotal: bookingTotal.toString(),
    tax: '0',
    promoCodeId: '',
    promoDiscount: '0',
    paymentStatus: 'PENDING',
    paymentMethod: '',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch('/api/customer/promotions');
      const data = await response.json();
      if (data.success) {
        setPromoCodes(data.promoCodes);
      }
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    }
  };

  const handlePromoChange = (promoId: string) => {
    const promo = promoCodes.find(p => p.id === promoId);
    
    if (promo) {
      const subtotal = parseFloat(formData.subtotal);
      let discount = 0;

      if (promo.discountType === 'PERCENTAGE') {
        discount = (subtotal * parseFloat(promo.discountValue.toString())) / 100;
      } else {
        discount = parseFloat(promo.discountValue.toString());
      }

      setSelectedPromo(promo);
      setFormData({
        ...formData,
        promoCodeId: promoId,
        promoDiscount: discount.toFixed(2),
      });
    } else {
      setSelectedPromo(null);
      setFormData({
        ...formData,
        promoCodeId: '',
        promoDiscount: '0',
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const discount = parseFloat(formData.promoDiscount) || 0;
    return (subtotal - discount + tax).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/create-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtotal: parseFloat(formData.subtotal),
          tax: parseFloat(formData.tax),
          promoCodeId: formData.promoCodeId || null,
          promoDiscount: parseFloat(formData.promoDiscount),
          paymentStatus: formData.paymentStatus,
          paymentMethod: formData.paymentMethod || null,
          dueDate: formData.dueDate || null,
          notes: formData.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border-2 border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Create Invoice</h2>
          <p className="text-gray-400 text-sm mt-1">Generate an invoice for this booking</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Subtotal and Tax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subtotal (CAD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax (CAD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Apply Promo Code (Optional)</label>
            <select
              value={formData.promoCodeId}
              onChange={(e) => handlePromoChange(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            >
              <option value="">No promo code</option>
              {promoCodes.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.code} - {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `$${promo.discountValue}`} OFF
                </option>
              ))}
            </select>
            {selectedPromo && (
              <p className="text-sm text-green-400 mt-2">
                Discount: -${formData.promoDiscount}
              </p>
            )}
          </div>

          {/* Total Display */}
          <div className="bg-black/50 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-3xl font-bold">${calculateTotal()}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Status *</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              >
                <option value="">Not specified</option>
                <option value="E-Transfer">E-Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
              placeholder="Internal notes..."
            />
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
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}