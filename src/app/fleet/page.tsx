'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import VehicleSkeleton from '@/components/ui/VehicleSkeleton';

type Vehicle = {
  id: string
  name: string
  category: string
  imageUrl: string | null
  description: string | null
  features: string | null
  basePrice: number | null
  hourlyRate: number | null
  isActive: boolean
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await fetch('/api/vehicles')
        const data = await res.json()
        const activeVehicles = data.vehicles.filter((v: Vehicle) => v.isActive)
        
        setVehicles(activeVehicles)
        setFilteredVehicles(activeVehicles)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch vehicles:', error)
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    let filtered = [...vehicles]

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(v => v.category === categoryFilter)
    }

    setFilteredVehicles(filtered)
  }, [categoryFilter, vehicles])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value)
  }

  // Get unique categories dynamically
  const uniqueCategories = Array.from(new Set(vehicles.map((v: Vehicle) => v.category)))

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold tracking-wide mb-4">Our Fleet</h1>
          <p className="text-xl text-gray-400 mb-12">Loading our luxury vehicles...</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <VehicleSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 tracking-wide">Our Fleet</h1>
          <p className="text-xl text-gray-400">Discover luxury vehicles for every occasion</p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-6 justify-center">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wide">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="px-6 py-3 bg-zinc-900 border-2 border-white/20 rounded-xl text-white focus:border-white/50 hover:border-white/30 transition-all cursor-pointer font-medium min-w-[200px]"
            >
              <option value="ALL">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {categoryFilter !== 'ALL' && (
            <div className="flex items-end">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className="px-6 py-3 text-sm font-semibold border-2 border-white/30 rounded-xl hover:border-white/50 hover:bg-white/5 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-center text-gray-400 mb-8 text-lg">
          Showing <span className="font-bold text-white">{filteredVehicles.length}</span> {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
          {categoryFilter !== 'ALL' && <span className="text-gray-500"> in {formatCategoryName(categoryFilter)}</span>}
        </p>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-4">No vehicles match your filters</p>
            <button
              onClick={() => setCategoryFilter('ALL')}
              className="text-white underline hover:text-gray-300 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/fleet/${vehicle.id}`}
                className="group bg-zinc-900 rounded-xl border border-white/20 overflow-hidden hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 cursor-pointer"
              >
                {/* Vehicle Image */}
                <div className="relative h-64 overflow-hidden">
                  {vehicle.imageUrl ? (
                    <Image
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-8xl">🚗</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide border border-white/30 rounded-full mb-3">
                      {formatCategoryName(vehicle.category)}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {vehicle.description || 'Luxury transportation at its finest'}
                    </p>
                  </div>

                  {/* Pricing */}
                  {vehicle.hourlyRate && (
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm">Starting from</p>
                      <p className="text-2xl font-bold">
                        ${vehicle.hourlyRate.toString()}
                        <span className="text-sm text-gray-400">/hour</span>
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}