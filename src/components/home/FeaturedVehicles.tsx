import { prisma } from '@/lib/prisma'
import Button from '@/components/ui/Button'
import Image from 'next/image'

async function getFeaturedVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    where: { 
      isFeatured: true,
      isActive: true 
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1
      }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })
  
  return vehicles
}

export default async function FeaturedVehicles() {
  const vehicles = await getFeaturedVehicles()

  if (vehicles.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 tracking-wide">Featured Vehicles</h2>
          <p className="text-gray-400 text-lg">Discover our premium fleet</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id}
              className="group relative bg-zinc-900 rounded-lg border border-white/20 overflow-hidden hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500"
            >
              {/* Vehicle Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={vehicle.thumbnail}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              {/* Vehicle Info */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide border border-white/30 rounded-full mb-3">
                    {vehicle.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {vehicle.shortDescription || vehicle.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{vehicle.capacity} Passengers</span>
                  </div>
                </div>

                {/* CTA */}
                <Button variant="outline">
                  Request Quote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}