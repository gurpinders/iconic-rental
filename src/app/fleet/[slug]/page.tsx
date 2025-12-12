import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'

async function getVehicle(slug: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  return vehicle
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle || !vehicle.isActive) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-400">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="mx-3">/</span>
          <a href="/fleet" className="hover:text-white transition-colors">Fleet</a>
          <span className="mx-3">/</span>
          <span className="text-white">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Image */}
          <div>
            <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden border border-white/20">
              <Image
                src={vehicle.thumbnail}
                alt={vehicle.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column - Info */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wide border border-white/30 rounded-full mb-4">
                {vehicle.category.replace('_', ' ')}
              </span>
              <h1 className="text-5xl font-bold mb-4 tracking-wide">{vehicle.name}</h1>
              <p className="text-xl text-gray-400 leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-zinc-900 rounded-lg border border-white/10">
              <div>
                <p className="text-sm text-gray-400 mb-1">CAPACITY</p>
                <p className="text-2xl font-bold">{vehicle.capacity} Passengers</p>
              </div>
              {vehicle.luggageCapacity && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">LUGGAGE</p>
                  <p className="text-2xl font-bold">{vehicle.luggageCapacity} Bags</p>
                </div>
              )}
              {vehicle.make && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">MAKE</p>
                  <p className="text-2xl font-bold">{vehicle.make}</p>
                </div>
              )}
              {vehicle.year && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">YEAR</p>
                  <p className="text-2xl font-bold">{vehicle.year}</p>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <a href="/quote">
                <Button variant="primary">Request a Quote</Button>
              </a>
              <p className="text-sm text-gray-400 mt-3">Get a personalized quote for your event</p>
            </div>

            {/* Contact Info */}
            <div className="p-6 bg-zinc-900 rounded-lg border border-white/10">
              <p className="text-gray-400 mb-2">Need help deciding?</p>
              <a href="tel:+14161234567" className="text-2xl font-bold hover:text-gray-300 transition-colors">
                (416) 123-4567
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        {vehicle.features.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 tracking-wide">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicle.features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-4 bg-zinc-900 rounded-lg border border-white/10 text-center"
                >
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Section */}
        {vehicle.amenities.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 tracking-wide">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.amenities.map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-white/10"
                >
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center p-12 bg-zinc-900 rounded-lg border border-white/20">
          <h2 className="text-4xl font-bold mb-4">Ready to Book This Vehicle?</h2>
          <p className="text-xl text-gray-400 mb-8">Request a personalized quote for your event</p>
          <a href="/quote">
            <Button variant="primary">Request a Quote</Button>
          </a>
        </div>
      </div>
    </main>
  )
}