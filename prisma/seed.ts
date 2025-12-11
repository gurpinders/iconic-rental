import { PrismaClient, VehicleCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create sample vehicles
  const limo = await prisma.vehicle.create({
    data: {
      slug: 'lincoln-stretch-limo',
      name: 'Lincoln Stretch Limousine',
      category: VehicleCategory.LIMO,
      description: 'Classic elegance meets modern luxury. Perfect for weddings, proms, and special occasions with premium amenities including leather seating, mood lighting, and champagne bar.',
      shortDescription: 'Elegant stretch limo for up to 10 passengers',
      capacity: 10,
      luggageCapacity: 3,
      priceStarting: 150,
      priceNote: 'Starting from per hour',
      features: [
        'Leather interior',
        'Privacy partition',
        'Mood lighting',
        'Premium sound system',
        'Climate control',
        'Tinted windows'
      ],
      amenities: [
        'Champagne bar',
        'Crystal glassware',
        'Bluetooth audio',
        'USB charging ports',
        'WiFi available'
      ],
      thumbnail: '/vehicles/limo1.jpg',
      make: 'Lincoln',
      model: 'Town Car Stretch',
      year: 2023,
      color: 'Black',
      isActive: true,
      isFeatured: true,
    }
  })

  const partyBus = await prisma.vehicle.create({
    data: {
      slug: 'party-bus-30-passenger',
      name: '30 Passenger Party Bus',
      category: VehicleCategory.PARTY_BUS,
      description: 'The ultimate party experience on wheels. Dance floor, premium sound system, LED lighting, and full bar setup for an unforgettable night.',
      shortDescription: 'Luxury party bus with dance floor',
      capacity: 30,
      luggageCapacity: 10,
      priceStarting: 250,
      priceNote: 'Starting from per hour',
      features: [
        'Dance floor',
        'Pole dancing pole',
        'LED light show',
        'Premium sound system',
        'Multiple TVs',
        'Laser lights'
      ],
      amenities: [
        'Full bar setup',
        'Ice coolers',
        'Bluetooth/AUX',
        'Charging stations',
        'Bathroom',
        'Climate control'
      ],
      thumbnail: '/vehicles/partybus1.jpg',
      make: 'Custom',
      model: 'Party Bus',
      year: 2022,
      color: 'Black with LED',
      isActive: true,
      isFeatured: true,
    }
  })

  const sprinter = await prisma.vehicle.create({
    data: {
      slug: 'mercedes-sprinter-van',
      name: 'Mercedes Sprinter Van',
      category: VehicleCategory.SPRINTER_VAN,
      description: 'Executive luxury transport with leather seating, climate control, and premium entertainment systems. Perfect for corporate events and airport transfers.',
      shortDescription: 'Luxury executive transport',
      capacity: 14,
      luggageCapacity: 8,
      priceStarting: 180,
      priceNote: 'Starting from per hour',
      features: [
        'Leather captain chairs',
        'Executive seating',
        'Privacy curtains',
        'Premium sound',
        'Ambient lighting',
        'Tinted windows'
      ],
      amenities: [
        'WiFi',
        'USB/Power outlets',
        'Bluetooth audio',
        'Climate control',
        'Luggage storage',
        'Reading lights'
      ],
      thumbnail: '/vehicles/sprinter1.jpg',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2024,
      color: 'Black',
      isActive: true,
      isFeatured: true,
    }
  })

  console.log('Seed completed successfully!')
  console.log({ limo, partyBus, sprinter })
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })