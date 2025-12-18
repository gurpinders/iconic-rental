'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePromoCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          description: formData.description || null,
          discountType: formData.discountType,
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
        throw new Error(data.error || 'Failed to create promo code');
      }

      router.push('/admin/promo-codes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create promo code');
      setLoading(false);
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
        <h1 className="text-4xl font-bold mb-2">Create Promo Code</h1>
        <p className="text-gray-400">Set up a new promotional discount code</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-lg p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300">
            {error}
          </div>
        )}

        {/* Code */}
        <div>
          <label className="block text-sm font-medium mb-2">Promo Code *</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
            maxLength={20}
            className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none font-mono text-lg uppercase"
            placeholder="SUMMER2025"
          />
          <p className="text-xs text-gray-500 mt-1">Letters and numbers only, will be converted to uppercase</p>
        </div>

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

        {/* Discount Type and Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Discount Type *</label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount Value *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '50.00'}
            />
          </div>
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
              placeholder="100.00"
            />
          </div>
          {formData.discountType === 'PERCENTAGE' && (
            <div>
              <label className="block text-sm font-medium mb-2">Max Discount (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                placeholder="50.00"
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
            Activate this promo code immediately
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Promo Code'}
          </button>
        </div>
      </form>
    </div>
  );
}