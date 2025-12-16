import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch dashboard stats
  const [
    totalQuotes,
    pendingQuotes,
    reviewingQuotes,
    completedQuotes,
    recentQuotes,
  ] = await Promise.all([
    prisma.quote.count(),
    prisma.quote.count({ where: { status: 'PENDING' } }),
    prisma.quote.count({ where: { status: 'REVIEWING' } }),
    prisma.quote.count({ where: { status: 'COMPLETED' } }),
    prisma.quote.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        quoteNumber: true,
        firstName: true,
        lastName: true,
        email: true,
        eventType: true,
        eventDate: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
              <p className="text-gray-400 text-base mt-2">Welcome back, {user.email}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                target="_blank"
                className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-base"
              >
                View Site
              </Link>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Total Quotes */}
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
            <h3 className="text-gray-400 text-base font-medium mb-3">Total Quotes</h3>
            <p className="text-5xl font-bold mb-2">{totalQuotes}</p>
            <p className="text-gray-500 text-sm">All time</p>
          </div>

          {/* Pending */}
          <div className="bg-zinc-900 border border-orange-500/50 rounded-lg p-8">
            <h3 className="text-gray-400 text-base font-medium mb-3">Pending</h3>
            <p className="text-5xl font-bold text-orange-400 mb-2">{pendingQuotes}</p>
            <p className="text-gray-500 text-sm">Needs review</p>
          </div>

          {/* Reviewing */}
          <div className="bg-zinc-900 border border-blue-500/50 rounded-lg p-8">
            <h3 className="text-gray-400 text-base font-medium mb-3">Reviewing</h3>
            <p className="text-5xl font-bold text-blue-400 mb-2">{reviewingQuotes}</p>
            <p className="text-gray-500 text-sm">In progress</p>
          </div>

          {/* Completed */}
          <div className="bg-zinc-900 border border-green-500/50 rounded-lg p-8">
            <h3 className="text-gray-400 text-base font-medium mb-3">Completed</h3>
            <p className="text-5xl font-bold text-green-400 mb-2">{completedQuotes}</p>
            <p className="text-gray-500 text-sm">Finished</p>
          </div>

        </div>

        {/* Recent Quotes */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg">
          <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Quote Requests</h2>
            <Link
              href="/admin/quotes"
              className="text-base text-gray-400 hover:text-white transition-colors"
            >
              View All →
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
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
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-gray-500 text-base">
                      No quotes yet. They'll appear here when customers submit quote requests.
                    </td>
                  </tr>
                ) : (
                  recentQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap text-base font-mono">
                        {quote.quoteNumber}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-base">
                          <div className="font-medium">{quote.firstName} {quote.lastName}</div>
                          <div className="text-gray-500 text-sm">{quote.email}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        {quote.eventType}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        {new Date(quote.eventDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-sm font-semibold rounded ${
                          quote.status === 'PENDING' ? 'bg-orange-900/50 text-orange-300' :
                          quote.status === 'REVIEWING' ? 'bg-blue-900/50 text-blue-300' :
                          quote.status === 'QUOTED' ? 'bg-purple-900/50 text-purple-300' :
                          quote.status === 'ACCEPTED' ? 'bg-green-900/50 text-green-300' :
                          quote.status === 'DECLINED' ? 'bg-red-900/50 text-red-300' :
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