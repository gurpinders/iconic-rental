'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface VehicleImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

interface Vehicle {
  id: string;
  name: string;
  description: string | null;
  features: string | null;
  imageUrl: string | null;
  basePrice: number | null;
  hourlyRate: number | null;
  isActive: boolean;
  images: VehicleImage[];
}

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    params.then(p => {
      fetchVehicle(p.slug);
    });
  }, [params]);

  const fetchVehicle = async (id: string) => {
    try {
      const res = await fetch(`/api/vehicles/${id}`);
      if (!res.ok) {
        notFound();
      }
      const data = await res.json();
      if (!data.vehicle || !data.vehicle.isActive) {
        notFound();
      }
      setVehicle(data.vehicle);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
      notFound();
    }
  };

  const nextImage = () => {
    if (!vehicle) return;
    const totalImages = vehicle.images.length || 1;
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    if (!vehicle) return;
    const totalImages = vehicle.images.length || 1;
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  // Get all images
  const allImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.sort((a, b) => a.order - b.order)
    : vehicle.imageUrl
    ? [{ id: 'main', url: vehicle.imageUrl, alt: vehicle.name, order: 0 }]
    : [];

  const hasMultipleImages = allImages.length > 1;

  // Parse features - handle different formats
  let featuresArray: string[] = [];
  
  if (vehicle.features) {
    try {
      // Try to parse as JSON first (in case it's a JSON array)
      const parsed = JSON.parse(vehicle.features);
      if (Array.isArray(parsed)) {
        featuresArray = parsed;
      } else {
        // If not an array, treat as comma-separated
        featuresArray = vehicle.features.split(',').map(f => f.trim()).filter(Boolean);
      }
    } catch {
      // Not JSON, treat as comma-separated string
      featuresArray = vehicle.features
        .split(',')
        .map(f => f.trim())
        .filter(Boolean)
        .map(f => {
          // Clean up any remaining quotes or brackets
          return f.replace(/^["'\[\{]+|["'\]\}]+$/g, '').trim();
        });
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Image Carousel */}
      <section className="relative h-[70vh] min-h-[600px] max-h-[800px] bg-zinc-900">
        {allImages.length > 0 ? (
          <>
            <div className="relative w-full h-full">
              <Image
                src={allImages[currentImageIndex].url}
                alt={allImages[currentImageIndex].alt}
                fill
                className="object-contain bg-black"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            </div>

            {/* Carousel Controls */}
            {hasMultipleImages && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-4 rounded-full transition-all z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-4 rounded-full transition-all z-10"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-8 h-2'
                          : 'bg-white/50 hover:bg-white/75 w-2 h-2'
                      } rounded-full`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Back Button - Positioned on Image */}
            <div className="absolute top-6 left-6 z-20">
              <Link 
                href="/fleet"
                className="inline-flex items-center gap-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm px-6 py-3 rounded-full transition-all group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Back to Fleet</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className="text-center">
              <div className="text-9xl mb-4">🚗</div>
              <p className="text-gray-400">No image available</p>
            </div>
          </div>
        )}

        {/* Vehicle Name & Pricing - Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              {vehicle.name}
            </h1>
            {(vehicle.basePrice || vehicle.hourlyRate) && (
              <div className="flex items-baseline gap-4 flex-wrap">
                {vehicle.hourlyRate && (
                  <div>
                    <span className="text-2xl md:text-3xl font-bold">
                      ${vehicle.hourlyRate.toString()}
                    </span>
                    <span className="text-gray-400 ml-2">/hour</span>
                  </div>
                )}
                {vehicle.basePrice && (
                  <p className="text-gray-400">
                    Base: ${vehicle.basePrice.toString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {vehicle.description && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                    Overview
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {featuresArray.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuresArray.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                      >
                        <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-white shadow-lg'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-zinc-900 border-2 border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Book This Vehicle</h3>
                
                {/* Pricing Display */}
                {(vehicle.basePrice || vehicle.hourlyRate) && (
                  <div className="mb-6 pb-6 border-b border-white/10">
                    {vehicle.hourlyRate && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-1">Hourly Rate</p>
                        <p className="text-4xl font-bold">
                          ${vehicle.hourlyRate.toString()}
                          <span className="text-lg text-gray-400">/hr</span>
                        </p>
                      </div>
                    )}
                    {vehicle.basePrice && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Base Price</p>
                        <p className="text-2xl font-semibold">
                          ${vehicle.basePrice.toString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Features Highlights */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Professional driver included</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Fully insured & licensed</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Premium service guaranteed</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/quote?vehicle=${vehicle.id}`}
                  className="block w-full bg-white text-black text-center py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors mb-4"
                >
                  Request a Quote
                </Link>

                <p className="text-center text-sm text-gray-400">
                  Custom pricing available for extended bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book this vehicle for your next special occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/quote?vehicle=${vehicle.id}`}
              className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Get Your Custom Quote
            </Link>
            <Link
              href="/fleet"
              className="border-2 border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors inline-block"
            >
              View More Vehicles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}