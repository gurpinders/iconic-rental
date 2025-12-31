'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreatePromoCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minimumPurchase: '',
    maxUses: '',
    validFrom: null as Date | null,
    validUntil: null as Date | null,
    applicableServices: [] as string[],
    isActive: true,
  });

  const serviceTypes = ['POINT_TO_POINT', 'HOURLY', 'AIRPORT_TRANSFER', 'WEDDING', 'CORPORATE', 'SPECIAL_EVENT'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate dates
    if (!formData.validFrom || !formData.validUntil) {
      setError('Valid from and valid until dates are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          description: formData.description || null,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minimumPurchase: formData.minimumPurchase ? parseFloat(formData.minimumPurchase) : null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          validFrom: formData.validFrom,
          validUntil: formData.validUntil,
          applicableServices: formData.applicableServices,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create promo code');
      }

      router.push('/admin/promotions');
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
      <style jsx global>{`
        /* DatePicker Styles */
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
        
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #ffffff !important;
        }
        
        .react-datepicker__day {
          color: #a1a1aa !important;
        }
        
        .react-datepicker__day:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
        
        .react-datepicker__day--selected {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-weight: bold !important;
        }
        
        .react-datepicker__day--keyboard-selected {
          background-color: rgba(255,255,255,0.2) !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: #ffffff !important;
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/promotions"
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
            <div className="select-wrapper">
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                required
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
              </select>
            </div>
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

        {/* Min Purchase & Max Uses */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Purchase Amount (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.minimumPurchase}
              onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              placeholder="100.00"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum booking amount required</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Uses (Optional)</label>
            <input
              type="number"
              min="1"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              placeholder="Leave empty for unlimited"
            />
            <p className="text-xs text-gray-500 mt-1">Total number of times code can be used</p>
          </div>
        </div>

        {/* Valid Period */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Valid From *</label>
            <DatePicker
              selected={formData.validFrom}
              onChange={(date: Date | null) => setFormData({ ...formData, validFrom: date })}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              placeholderText="Select start date"
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valid Until *</label>
            <DatePicker
              selected={formData.validUntil}
              onChange={(date: Date | null) => setFormData({ ...formData, validUntil: date })}
              dateFormat="MMMM d, yyyy"
              minDate={formData.validFrom || new Date()}
              placeholderText="Select end date"
              required
              className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none cursor-pointer"
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
            href="/admin/promotions"
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