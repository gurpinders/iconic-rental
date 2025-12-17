'use client';

import { useEffect, useState } from 'react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await fetch('/api/customer/me');
      const data = await response.json();

      if (data.success) {
        setCustomer(data.customer);
        setProfileForm({
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          phone: data.customer.phone,
          company: data.customer.company || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setCustomer(data.customer);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      const response = await fetch('/api/customer/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangingPassword(false);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to change password',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-96 bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">My Profile</h1>
        <p className="text-gray-400 text-xl">Manage your account settings and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-green-500/20 border-green-500/50 text-green-300'
              : 'bg-red-500/20 border-red-500/50 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company (Optional)</label>
              <input
                type="text"
                value={profileForm.company}
                onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-primary py-3">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setProfileForm({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phone: customer.phone,
                    company: customer.company || '',
                  });
                }}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Name</p>
              <p className="text-lg font-semibold">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Email</p>
              <p className="text-lg font-semibold">{customer.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Phone</p>
              <p className="text-lg font-semibold">{customer.phone}</p>
            </div>
            {customer.company && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Company</p>
                <p className="text-lg font-semibold">{customer.company}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Change Password</h2>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {changingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
                minLength={8}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:border-white/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-primary py-3">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400">
            Keep your account secure by using a strong password and changing it regularly.
          </p>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-zinc-900 border-2 border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Member Since</p>
            <p className="text-lg font-semibold">{formatDate(customer.createdAt)}</p>
          </div>
          {customer.lastLogin && (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Last Login</p>
              <p className="text-lg font-semibold">{formatDate(customer.lastLogin)}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Email Status</p>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  customer.emailVerified
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-orange-500/20 text-orange-300'
                }`}
              >
                {customer.emailVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}