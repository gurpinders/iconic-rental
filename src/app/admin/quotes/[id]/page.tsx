import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import QuoteActions from '@/components/admin/QuoteActions';

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // Await params
  const { id } = await params;

  // Fetch quote
  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/admin/quotes"
                className="text-gray-400 hover:text-white transition-colors text-sm mb-2 inline-block"
              >
                ← Back to All Quotes
              </Link>
              <h1 className="text-3xl font-bold tracking-wide">Quote Details</h1>
              <p className="text-gray-400 text-base mt-2 font-mono">
                {quote.quoteNumber}
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
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quote Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Customer Information */}
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                Customer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <p className="text-lg">{quote.firstName} {quote.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <a href={`mailto:${quote.email}`} className="text-lg text-blue-400 hover:text-blue-300">
                    {quote.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <a href={`tel:${quote.phone}`} className="text-lg text-blue-400 hover:text-blue-300">
                    {quote.phone}
                  </a>
                </div>
                {quote.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                    <p className="text-lg">{quote.company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                Event Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Service Type</label>
                  <p className="text-lg">{quote.serviceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Event Type</label>
                  <p className="text-lg">{quote.eventType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Event Date</label>
                  <p className="text-lg">
                    {new Date(quote.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {quote.pickupTime && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pickup Time</label>
                    <p className="text-lg">{quote.pickupTime}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Number of Passengers</label>
                  <p className="text-lg">{quote.numberOfPassengers}</p>
                </div>
                {quote.numberOfHours && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                    <p className="text-lg">{quote.numberOfHours} hours</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                Location Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Pickup Location</label>
                  <p className="text-lg">{quote.pickupLocation}</p>
                </div>
                {quote.dropoffLocation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dropoff Location</label>
                    <p className="text-lg">{quote.dropoffLocation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Requests */}
            {quote.specialRequests && (
              <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                  Special Requests
                </h2>
                <p className="text-lg text-gray-300 whitespace-pre-wrap">
                  {quote.specialRequests}
                </p>
              </div>
            )}

            {/* Admin Notes */}
            {quote.notes && (
              <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                  Admin Notes
                </h2>
                <p className="text-lg text-gray-300 whitespace-pre-wrap">
                  {quote.notes}
                </p>
              </div>
            )}

          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            
            {/* Status Card */}
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                Quote Status
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Current Status</label>
                <span className={`inline-block px-4 py-2 text-base font-semibold rounded ${
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
              </div>

              {quote.quotedPrice && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Quoted Price</label>
                  <p className="text-3xl font-bold">${quote.quotedPrice.toString()}</p>
                </div>
              )}

              <div className="text-sm text-gray-500 space-y-2">
                <p>Submitted: {new Date(quote.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(quote.updatedAt).toLocaleDateString()}</p>
                {quote.respondedAt && (
                  <p>Responded: {new Date(quote.respondedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Quick Contact - NEW */}
            <div className="bg-zinc-900 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                Quick Contact
              </h2>
              <div className="space-y-3">
                <a
                  href={`tel:${quote.phone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
                >
                  <span>📞</span>
                  <span>Call Customer</span>
                </a>
                <a
                  href={`mailto:${quote.email}?subject=Quote ${quote.quoteNumber} - Iconic Limos`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                >
                  <span>✉️</span>
                  <span>Email Customer</span>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <QuoteActions quote={quote} />

          </div>

        </div>

      </main>
    </div>
  );
}