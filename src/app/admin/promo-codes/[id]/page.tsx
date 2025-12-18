'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minBookingAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicableServices: string[];
  isActive: boolean;
  _count: {
    invoices: number;
  };
}

export default function EditPromoCodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [promoId, setPromoId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    discountValue: '',
    minBookingAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    applicableServices: [] as string[],
    isActive: true,
  });

  const serviceTypes = ['POINT_TO_POINT', 'HOURLY', 'AIRPORT_TRANSFER', 'WEDDING', 'CORPORATE', 'SPECIAL_EVENT'];

  useEffect(() => {
    params.then(p => setPromoId(p.id));
  }, [params]);

  useEffect(() => {
    if (promoId) {
      fetchPromoCode();
    }
  }, [promoId]);

  const fetchPromoCode = async () => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${promoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch promo code');
      }

      const promo = data.promoCode;
      setPromoCode(promo);

      // Set form data
      setFormData({
        description: promo.description || '',
        discountValue: promo.discountValue.toString(),
        minBookingAmount: promo.minBookingAmount?.toString() || '',
        maxDiscount: promo.maxDiscount?.toString() || '',
        usageLimit: promo.usageLimit?.toString() || '',
        validFrom: new Date(promo.validFrom).toISOString().split('T')[0],
        validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
        applicableServices: promo.applicableServices || [],
        isActive: promo.isActive,
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promo code');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/promo-codes/${promoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description || null,
          discountValue: parseFloat(formData.discountValue),
          minBookingAmount: formData.minBookingAmount ? parseFloat(formData.minBookingAmount) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          validFrom: new Date(formData.validFrom),
          validUntil: new Date(formData.validUntil),
          applicableServices: formData.applicableServices,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update promo code');
      }

      router.push('/admin/promo-codes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update promo code');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this promo code? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/promo-codes/${promoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete promo code');
      }

      router.push('/admin/promo-codes');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete promo code');
    }
  };

  const toggleService = (service: string) => {
    if (formData.applicableServices.includes(service)) {
      setFormData({
        ...formData,
        applicableServices: formData.applicableServices.filter(s => s !== service),
      });
    } else {
      setFormData({
        ...formData,
        applicableServices: [...formData.applicableServices, service],
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-96 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!promoCode) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/promo-codes"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to Promo Codes</span>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Edit Promo Code</h1>
            <p className="text-gray-400 font-mono text-xl">{promoCode.code}</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={promoCode._count.invoices > 0}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={promoCode._count.invoices > 0 ? 'Cannot delete used promo code' : 'Delete promo code'}
          >
            Delete
          </button>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Times Used</p>
            <p className="text-2xl font-bold">{promoCode._count.invoices}</p>
          </div>
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Usage Count</p>
            <p className="text-2xl font-bold">{promoCode.usageCount}</p>
          </div>
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Remaining Uses</p>
            <p className="text-2xl font-bold">
              {promoCode.usageLimit ? promoCode.usageLimit - promoCode.usageCount : '∞'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-lg p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300">
            {error}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
            placeholder="Summer promotion - 20% off all bookings"
          />
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Discount Value ({promoCode.discountType === 'PERCENTAGE' ? '%' : '$'}) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            required
            className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
          />
        </div>

        {/* Min Booking & Max Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Booking Amount (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.minBookingAmount}
              onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            />
          </div>
          {promoCode.discountType === 'PERCENTAGE' && (
            <div>
              <label className="block text-sm font-medium mb-2">Max Discount (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Usage Limit */}
        <div>
          <label className="block text-sm font-medium mb-2">Usage Limit (Optional)</label>
          <input
            type="number"
            min="1"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            placeholder="Leave empty for unlimited uses"
          />
        </div>

        {/* Valid Period */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Valid From *</label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valid Until *</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Applicable Services */}
        <div>
          <label className="block text-sm font-medium mb-3">Applicable Services (Optional)</label>
          <p className="text-xs text-gray-500 mb-3">Leave unselected for all services</p>
          <div className="grid grid-cols-2 gap-3">
            {serviceTypes.map((service) => (
              <label
                key={service}
                className="flex items-center gap-3 p-3 bg-black/50 border border-white/10 rounded cursor-pointer hover:bg-black/70 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.applicableServices.includes(service)}
                  onChange={() => toggleService(service)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{service.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
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
            Promo code is active
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/admin/promo-codes"
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}