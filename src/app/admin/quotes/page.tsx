import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface SearchParams {
  status?: string;
  search?: string;
}

export default async function AllQuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Await searchParams
  const params = await searchParams;
  const statusFilter = params.status;
  const searchQuery = params.search;

  // Build where clause for filtering
  const where: any = {};

  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter;
  }

  if (searchQuery) {
    where.OR = [
      { quoteNumber: { contains: searchQuery, mode: 'insensitive' } },
      { firstName: { contains: searchQuery, mode: 'insensitive' } },
      { lastName: { contains: searchQuery, mode: 'insensitive' } },
      { email: { contains: searchQuery, mode: 'insensitive' } },
      { phone: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  // Fetch quotes
  const quotes = await prisma.quote.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      quoteNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      eventType: true,
      eventDate: true,
      status: true,
      createdAt: true,
    },
  });

  // Count by status
  const statusCounts = await prisma.quote.groupBy({
    by: ['status'],
    _count: true,
  });

  const countMap: Record<string, number> = {};
  statusCounts.forEach(item => {
    countMap[item.status] = item._count;
  });

  const totalCount = await prisma.quote.count();

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">All Quote Requests</h2>
        <p className="text-gray-400">
          {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-3">Filter by Status</label>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/quotes"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  !statusFilter || statusFilter === 'ALL'
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                All ({totalCount})
              </Link>
              <Link
                href="/admin/quotes?status=PENDING"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Pending ({countMap.PENDING || 0})
              </Link>
              <Link
                href="/admin/quotes?status=REVIEWING"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'REVIEWING'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Reviewing ({countMap.REVIEWING || 0})
              </Link>
              <Link
                href="/admin/quotes?status=QUOTED"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'QUOTED'
                    ? 'bg-purple-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Quoted ({countMap.QUOTED || 0})
              </Link>
              <Link
                href="/admin/quotes?status=ACCEPTED"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Accepted ({countMap.ACCEPTED || 0})
              </Link>
              <Link
                href="/admin/quotes?status=COMPLETED"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-green-600 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Completed ({countMap.COMPLETED || 0})
              </Link>
              <Link
                href="/admin/quotes?status=DECLINED"
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  statusFilter === 'DECLINED'
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                Declined ({countMap.DECLINED || 0})
              </Link>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-3">Search</label>
            <form method="GET" action="/admin/quotes">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by name, email, phone, or quote #"
                className="w-full px-4 py-2 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors text-base"
              />
              {statusFilter && (
                <input type="hidden" name="status" value={statusFilter} />
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Quick Stats */}
      {quotes.length > 0 && (
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Showing Results</p>
              <p className="text-2xl font-bold">{quotes.length} {quotes.length === 1 ? 'Quote' : 'Quotes'}</p>
            </div>
            {statusFilter && (
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Filtered by</p>
                <span className={`inline-block px-4 py-2 text-sm font-semibold rounded ${
                  statusFilter === 'PENDING' ? 'bg-orange-900/50 text-orange-300' :
                  statusFilter === 'REVIEWING' ? 'bg-blue-900/50 text-blue-300' :
                  statusFilter === 'QUOTED' ? 'bg-purple-900/50 text-purple-300' :
                  statusFilter === 'ACCEPTED' ? 'bg-green-900/50 text-green-300' :
                  statusFilter === 'COMPLETED' ? 'bg-green-700/50 text-green-200' :
                  statusFilter === 'DECLINED' ? 'bg-red-900/50 text-red-300' :
                  'bg-gray-900/50 text-gray-300'
                }`}>
                  {statusFilter}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quotes Table */}
      <div className="bg-zinc-900 border border-white/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {searchQuery || statusFilter
                      ? 'No quotes match your search criteria.'
                      : "No quotes yet. They'll appear here when customers submit quote requests."}
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {quote.quoteNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{quote.firstName} {quote.lastName}</div>
                        <div className="text-gray-500 text-xs truncate max-w-[200px]">{quote.email}</div>
                        <div className="text-gray-500 text-xs">{quote.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {quote.eventType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(quote.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                      {new Date(quote.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded ${
                        quote.status === 'PENDING' ? 'bg-orange-900/50 text-orange-300' :
                        quote.status === 'REVIEWING' ? 'bg-blue-900/50 text-blue-300' :
                        quote.status === 'QUOTED' ? 'bg-purple-900/50 text-purple-300' :
                        quote.status === 'ACCEPTED' ? 'bg-green-900/50 text-green-300' :
                        quote.status === 'DECLINED' ? 'bg-red-900/50 text-red-300' :
                        quote.status === 'COMPLETED' ? 'bg-green-700/50 text-green-200' :
                        'bg-gray-900/50 text-gray-300'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}