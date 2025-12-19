import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });
  
  return vehicle;
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // slug is actually the vehicle ID now
  const vehicle = await getVehicle(slug);

  if (!vehicle || !vehicle.isActive) {
    notFound();
  }

  // Parse features into an array
  const featuresArray = vehicle.features 
    ? vehicle.features.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        {vehicle.imageUrl ? (
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-4">🚗</div>
              <p className="text-gray-400">No image available</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/fleet"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <span>←</span>
              <span>Back to Fleet</span>
            </Link>
            
            <div className="flex items-end justify-between gap-8">
              <div>
                <p className="text-white/60 mb-2 uppercase tracking-wider text-sm">
                  {vehicle.category}
                </p>
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  {vehicle.name}
                </h1>
              </div>
              
              {(vehicle.basePrice || vehicle.hourlyRate) && (
                <div className="text-right hidden md:block">
                  {vehicle.hourlyRate && (
                    <div className="mb-2">
                      <span className="text-4xl font-bold">
                        ${vehicle.hourlyRate.toString()}
                      </span>
                      <span className="text-white/60 ml-2">/hour</span>
                    </div>
                  )}
                  {vehicle.basePrice && (
                    <p className="text-white/60 text-sm">
                      Base: ${vehicle.basePrice.toString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {vehicle.description && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {featuresArray.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuresArray.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <span className="text-2xl">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {vehicle.images && vehicle.images.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vehicle.images.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors group"
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white/5 border-2 border-white/20 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6">Book This Vehicle</h3>
                
                {/* Pricing (Mobile) */}
                {(vehicle.basePrice || vehicle.hourlyRate) && (
                  <div className="mb-6 pb-6 border-b border-white/10 md:hidden">
                    {vehicle.hourlyRate && (
                      <div className="mb-2">
                        <span className="text-4xl font-bold">
                          ${vehicle.hourlyRate.toString()}
                        </span>
                        <span className="text-white/60 ml-2">/hour</span>
                      </div>
                    )}
                    {vehicle.basePrice && (
                      <p className="text-white/60 text-sm">
                        Base: ${vehicle.basePrice.toString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-semibold">{vehicle.category}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/quote?vehicle=${vehicle.id}`}
                  className="block w-full btn-primary text-center py-4 text-lg font-bold"
                >
                  Request a Quote
                </Link>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Custom pricing available for extended bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book this vehicle for your next special occasion
          </p>
          <Link
            href={`/quote?vehicle=${vehicle.id}`}
            className="btn-primary inline-block px-12 py-4 text-lg font-bold"
          >
            Get Your Custom Quote
          </Link>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  return vehicles.map((vehicle) => ({
    slug: vehicle.id, // Use ID as the slug parameter
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    };
  }

  return {
    title: `${vehicle.name} - Iconic Limos`,
    description: vehicle.description || `Book the ${vehicle.name} for your next event`,
  };
}