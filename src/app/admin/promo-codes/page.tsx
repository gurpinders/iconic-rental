import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminPromoCodesPage() {
  // Fetch all promo codes
  const promoCodes = await prisma.promoCode.findMany({
    include: {
      _count: {
        select: {
          invoices: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const now = new Date();
  const activePromos = promoCodes.filter(p => p.isActive && p.validFrom <= now && p.validUntil >= now);
  const expiredPromos = promoCodes.filter(p => p.validUntil < now);
  const inactivePromos = promoCodes.filter(p => !p.isActive);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Promo Codes</h1>
          <p className="text-gray-400">Create and manage promotional discount codes</p>
        </div>
        <Link
          href="/admin/promo-codes/create"
          className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
        >
          + Create Promo Code
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Codes</p>
          <p className="text-3xl font-bold">{promoCodes.length}</p>
        </div>
        <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-green-400">{activePromos.length}</p>
        </div>
        <div className="bg-zinc-900 border border-orange-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Expired</p>
          <p className="text-3xl font-bold text-orange-400">{expiredPromos.length}</p>
        </div>
        <div className="bg-zinc-900 border border-red-500/50 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Inactive</p>
          <p className="text-3xl font-bold text-red-400">{inactivePromos.length}</p>
        </div>
      </div>

      {/* Promo Codes Table */}
      {promoCodes.length === 0 ? (
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-400 mb-4">No promo codes yet</p>
          <Link
            href="/admin/promo-codes/create"
            className="inline-block px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            Create Your First Promo Code
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Times Used
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {promoCodes.map((promo) => {
                  const isExpired = promo.validUntil < now;
                  const isNotStarted = promo.validFrom > now;
                  const isLimitReached = promo.usageLimit && promo.usageCount >= promo.usageLimit;
                  
                  let statusText = 'Active';
                  let statusColor = 'bg-green-500/20 text-green-300 border-green-500/50';
                  
                  if (!promo.isActive) {
                    statusText = 'Inactive';
                    statusColor = 'bg-red-500/20 text-red-300 border-red-500/50';
                  } else if (isExpired) {
                    statusText = 'Expired';
                    statusColor = 'bg-orange-500/20 text-orange-300 border-orange-500/50';
                  } else if (isNotStarted) {
                    statusText = 'Scheduled';
                    statusColor = 'bg-blue-500/20 text-blue-300 border-blue-500/50';
                  } else if (isLimitReached) {
                    statusText = 'Limit Reached';
                    statusColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
                  }

                  return (
                    <tr
                      key={promo.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-mono font-bold text-lg">{promo.code}</p>
                          {promo.description && (
                            <p className="text-sm text-gray-400 mt-1">{promo.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold">
                          {promo.discountType === 'PERCENTAGE'
                            ? `${Number(promo.discountValue)}%`
                            : `$${Number(promo.discountValue)}`}{' '}
                          OFF
                        </p>
                        {promo.maxDiscount && promo.discountType === 'PERCENTAGE' && (
                          <p className="text-xs text-gray-400">Max: ${Number(promo.maxDiscount)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p>{formatDate(promo.validFrom)}</p>
                          <p className="text-gray-400">to {formatDate(promo.validUntil)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm">
                          {promo.usageLimit ? `${promo.usageCount} / ${promo.usageLimit}` : 'Unlimited'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold">{promo._count.invoices}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/promo-codes/${promo.id}`}
                          className="text-blue-400 hover:underline text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}