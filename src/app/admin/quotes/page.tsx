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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors text-sm mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-wide">All Quote Requests</h1>
              <p className="text-gray-400 text-base mt-2">
                {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} found
              </p>
            </div>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-semibold tracking-wide text-base"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        
        {/* Filters */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-6 mb-8">
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
                  DECLINED ({countMap.DECLINED || 0})
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

        {/* Quick Stats - NEW */}
        {quotes.length > 0 && (
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-6 mb-8">
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
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Quote Number
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-gray-500 text-base">
                      {searchQuery || statusFilter
                        ? 'No quotes match your search criteria.'
                        : "No quotes yet. They'll appear here when customers submit quote requests."}
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono">
                        {quote.quoteNumber}
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-base">
                          <div className="font-medium">{quote.firstName} {quote.lastName}</div>
                          <div className="text-gray-500 text-sm">{quote.email}</div>
                          <div className="text-gray-500 text-sm">{quote.phone}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        {quote.eventType}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        {new Date(quote.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-400">
                        {new Date(quote.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-sm font-semibold rounded ${
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
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="text-white hover:text-gray-300 transition-colors font-medium"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}