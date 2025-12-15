'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import VehicleSkeleton from '@/components/ui/VehicleSkeleton';

type Vehicle = {
  id: string
  name: string
  slug: string
  category: string
  capacity: number
  thumbnail: string
  shortDescription: string | null
  description: string
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [capacityFilter, setCapacityFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await fetch('/api/vehicles')
        const data = await res.json()
        setVehicles(data.vehicles)
        setFilteredVehicles(data.vehicles)
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

    if (capacityFilter !== 'ALL') {
      filtered = filtered.filter(v => {
        if (capacityFilter === '1-10') return v.capacity <= 10
        if (capacityFilter === '11-20') return v.capacity > 10 && v.capacity <= 20
        if (capacityFilter === '21+') return v.capacity > 20
        return true
      })
    }

    setFilteredVehicles(filtered)
  }, [categoryFilter, capacityFilter, vehicles])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold tracking-wide mb-4">Our Fleet</h1>
          <p className="text-xl text-gray-400 mb-12">Loading our luxury vehicles...</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Show 6 skeleton cards */}
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
            <label className="block text-sm font-semibold mb-2 text-gray-400">CATEGORY</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-6 py-3 bg-zinc-900 border border-white/20 rounded-lg text-white focus:border-white/50 transition-all"
            >
              <option value="ALL">All Categories</option>
              <option value="LIMO">Limousines</option>
              <option value="PARTY_BUS">Party Buses</option>
              <option value="LUXURY_BUS">Luxury Buses</option>
              <option value="SPRINTER_VAN">Sprinter Vans</option>
              <option value="SUV">SUVs</option>
            </select>
          </div>

          {/* Capacity Filter */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-400">CAPACITY</label>
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="px-6 py-3 bg-zinc-900 border border-white/20 rounded-lg text-white focus:border-white/50 transition-all"
            >
              <option value="ALL">All Capacities</option>
              <option value="1-10">1-10 Passengers</option>
              <option value="11-20">11-20 Passengers</option>
              <option value="21+">21+ Passengers</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(categoryFilter !== 'ALL' || capacityFilter !== 'ALL') && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter('ALL')
                  setCapacityFilter('ALL')
                }}
                className="px-6 py-3 text-sm border border-white/30 rounded-lg hover:border-white/50 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-center text-gray-400 mb-8">
          Showing {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
        </p>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-4">No vehicles match your filters</p>
            <button
              onClick={() => {
                setCategoryFilter('ALL')
                setCapacityFilter('ALL')
              }}
              className="text-white underline hover:text-gray-300"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group bg-zinc-900 rounded-lg border border-white/20 overflow-hidden hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500"
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
                  <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{vehicle.capacity} Passengers</span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <a href={`/fleet/${vehicle.slug}`} className="flex-1">
                      <Button variant="outline">View Details</Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}