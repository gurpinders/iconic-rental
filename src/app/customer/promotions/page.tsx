'use client';

import { useEffect, useState } from 'react';

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
}

interface Categorized {
  percentage: PromoCode[];
  fixedAmount: PromoCode[];
}

export default function CustomerPromotionsPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [categorized, setCategorized] = useState<Categorized>({
    percentage: [],
    fixedAmount: [],
  });
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/customer/promotions');
      const data = await response.json();

      if (data.success) {
        setPromoCodes(data.promoCodes);
        setCategorized(data.categorized);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDiscount = (promo: PromoCode) => {
    if (promo.discountType === 'PERCENTAGE') {
      return `${Number(promo.discountValue)}% OFF`;
    } else {
      return `$${Number(promo.discountValue)} OFF`;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pt-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-zinc-800 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Special Offers</h1>
        <p className="text-gray-400 text-xl">Save on your next luxury ride with our exclusive promotions</p>
      </div>

      {/* Promotions Grid */}
      {promoCodes.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-2xl p-16 text-center">
          <div className="text-8xl mb-6">🎁</div>
          <h3 className="text-3xl font-bold mb-4">No Active Promotions</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Check back soon for exclusive offers and discounts on your next booking!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((promo) => {
            const usagePercentage = promo.usageLimit 
              ? (promo.usageCount / promo.usageLimit) * 100 
              : 0;
            const isLimited = promo.usageLimit !== null;
            const remainingUses = isLimited 
              ? promo.usageLimit! - promo.usageCount 
              : null;

            return (
              <div
                key={promo.id}
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-white/20 rounded-2xl p-6 hover:border-white/40 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                {/* Discount Badge */}
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="text-5xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {formatDiscount(promo)}
                    </div>
                    {promo.discountType === 'PERCENTAGE' && promo.maxDiscount && (
                      <p className="text-xs text-gray-500">
                        Up to ${Number(promo.maxDiscount)} max discount
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {promo.description && (
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {promo.description}
                  </p>
                )}

                {/* Promo Code */}
                <div className="mb-6">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Promo Code</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black/50 rounded-lg px-4 py-3 font-mono text-xl font-bold border border-white/10">
                      {promo.code}
                    </div>
                    <button
                      onClick={() => copyCode(promo.code)}
                      className="px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                    >
                      {copiedCode === promo.code ? '✓' : '📋'}
                    </button>
                  </div>
                  {copiedCode === promo.code && (
                    <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm mb-6">
                  {promo.minBookingAmount && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>💵</span>
                      <span>Minimum booking: ${Number(promo.minBookingAmount)}</span>
                    </div>
                  )}
                  
                  {promo.applicableServices.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>🚗</span>
                      <span>Valid for: {promo.applicableServices.join(', ')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-400">
                    <span>📅</span>
                    <span>Valid until: {formatDate(promo.validUntil)}</span>
                  </div>

                  {isLimited && remainingUses !== null && (
                    <div>
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span>🎫 {remainingUses} uses remaining</span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => window.location.href = '/quote'}
                  className="w-full btn-primary text-center py-3"
                >
                  Use This Code
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* How to Use */}
      <div className="mt-16 bg-zinc-900 border border-white/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">How to Use Promo Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="text-xl font-bold mb-2">Copy the Code</h3>
            <p className="text-gray-400 text-sm">
              Click the copy button next to your preferred promo code
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="text-xl font-bold mb-2">Request a Quote</h3>
            <p className="text-gray-400 text-sm">
              Fill out the quote form with your event details
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="text-xl font-bold mb-2">Apply & Save</h3>
            <p className="text-gray-400 text-sm">
              Enter the promo code and enjoy your discount!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}