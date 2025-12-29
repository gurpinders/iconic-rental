'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AutoLogout from '@/components/customer/AutoLogout';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company?: string;
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch customer data if we're on an authenticated page
    const isAuthPage = pathname?.startsWith('/customer/login') || 
                       pathname?.startsWith('/customer/register') ||
                       pathname?.startsWith('/customer/forgot-password') ||
                       pathname?.startsWith('/customer/verify-email') ||
                       pathname?.startsWith('/customer/reset-password');
    
    if (!isAuthPage) {
      fetchCustomer();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch('/api/customer/me');
      
      if (!response.ok) {
        router.push('/customer/login');
        return;
      }

      const data = await response.json();
      console.log('Customer data loaded:', data.customer); // Debug log
      setCustomer(data.customer);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      router.push('/customer/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/customer/logout', { method: 'POST' });
      router.push('/customer/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Skip layout for login/register pages
  if (pathname?.startsWith('/customer/login') || 
      pathname?.startsWith('/customer/register') ||
      pathname?.startsWith('/customer/forgot-password') ||
      pathname?.startsWith('/customer/verify-email') ||
      pathname?.startsWith('/customer/reset-password')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/customer/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/customer/bookings', label: 'My Bookings', icon: '🚗' },
    { href: '/customer/invoices', label: 'Invoices', icon: '💰' },
    { href: '/customer/promotions', label: 'Promotions', icon: '🎁' },
    { href: '/customer/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Auto-Logout Component - Only active when logged in */}
      <AutoLogout />

      {/* Top Navigation Bar */}
      <header className="bg-zinc-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/">
              <Image 
                src="/logo_no_bg_simple.png" 
                alt="Iconic Limos Logo" 
                width={120}
                height={60}
                className="cursor-pointer"
              />
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              {customer && (
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{customer.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-zinc-900 border-r border-white/10 min-h-[calc(100vh-73px)] hidden lg:block">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 mt-8 border-t border-white/10">
            <Link
              href="/quote"
              className="block w-full btn-primary text-center py-3"
            >
              Request New Quote
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 z-50">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}