'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateDriverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseClass: '',
    employeeNumber: '',
    hireDate: '',
    notes: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create driver');
      }

      router.push('/admin/drivers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create driver');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/drivers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <span>←</span>
          <span>Back to Drivers</span>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Add Driver</h1>
        <p className="text-gray-400">Add a new driver to your team</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/20 rounded-lg p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-red-300">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* License Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">License Information</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Class</label>
              <input
                type="text"
                value={formData.licenseClass}
                onChange={(e) => setFormData({ ...formData, licenseClass: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
                placeholder="Class G, C, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License Expiry</label>
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">Employment Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Employee Number</label>
              <input
                type="text"
                value={formData.employeeNumber}
                onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none font-mono"
                placeholder="EMP001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hire Date</label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none resize-none"
            placeholder="Additional information about the driver..."
          />
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
            Driver is active and available for assignments
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/admin/drivers"
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-semibold text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Driver'}
          </button>
        </div>
      </form>
    </div>
  );
}