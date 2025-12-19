import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create sample vehicles
  const limo = await prisma.vehicle.create({
    data: {
      name: 'Lincoln Stretch Limousine',
      category: 'LIMOUSINE',
      description: 'Classic elegance meets modern luxury. Perfect for weddings, proms, and special occasions with premium amenities including leather seating, mood lighting, and champagne bar.',
      features: 'Leather interior, Privacy partition, Mood lighting, Premium sound system, Climate control, Tinted windows, Champagne bar, Crystal glassware, Bluetooth audio, USB charging ports',
      imageUrl: '/limo_ad.jpeg',
      basePrice: 150.00,
      hourlyRate: 150.00,
      isActive: true,
    }
  })

  const partyBus = await prisma.vehicle.create({
    data: {
      name: '30 Passenger Party Bus',
      category: 'BUS',
      description: 'The ultimate party experience on wheels. Dance floor, premium sound system, LED lighting, and full bar setup for an unforgettable night.',
      features: 'Dance floor, Pole dancing pole, LED light show, Premium sound system, Multiple TVs, Laser lights, Full bar setup, Ice coolers, Bluetooth/AUX, Charging stations, Bathroom, Climate control',
      imageUrl: '/party_bus.jpg',
      basePrice: 250.00,
      hourlyRate: 250.00,
      isActive: true,
    }
  })

  const sprinter = await prisma.vehicle.create({
    data: {
      name: 'Mercedes Sprinter Van',
      category: 'SPRINTER',
      description: 'Executive luxury transport with leather seating, climate control, and premium entertainment systems. Perfect for corporate events and airport transfers.',
      features: 'Leather captain chairs, Executive seating, Privacy curtains, Premium sound, Ambient lighting, Tinted windows, WiFi, USB/Power outlets, Bluetooth audio, Climate control, Luggage storage, Reading lights',
      imageUrl: '/merc_sprinter.jpg',
      basePrice: 180.00,
      hourlyRate: 180.00,
      isActive: true,
    }
  })

  const suv = await prisma.vehicle.create({
    data: {
      name: 'Cadillac Escalade SUV',
      category: 'SUV',
      description: 'Luxury SUV perfect for executive transport and small group travel. Premium leather interior with advanced climate control.',
      features: 'Leather seats, Privacy glass, Premium audio, WiFi, USB ports, Climate control, Luggage space',
      imageUrl: null,
      basePrice: 120.00,
      hourlyRate: 120.00,
      isActive: true,
    }
  })

  // Create sample testimonials
  const testimonial1 = await prisma.testimonial.create({
    data: {
      name: 'Sarah & Michael Thompson',
      service: 'Wedding Transportation',
      rating: 5,
      comment: 'Iconic Limos made our wedding day absolutely perfect! The limousine was pristine, the driver was professional and punctual, and the entire experience was seamless. Highly recommend for any special occasion!',
      isApproved: true,
      isFeatured: true,
    }
  })

  const testimonial2 = await prisma.testimonial.create({
    data: {
      name: 'David Chen',
      service: 'Corporate Event',
      rating: 5,
      comment: 'We use Iconic Limos for all our corporate events and client transportation. Their professionalism and attention to detail is unmatched. The fleet is always immaculate and the service is consistently excellent.',
      isApproved: true,
      isFeatured: true,
    }
  })

  const testimonial3 = await prisma.testimonial.create({
    data: {
      name: 'Emily Rodriguez',
      service: 'Prom Night',
      rating: 5,
      comment: 'Best prom ever! The party bus was amazing with all the lights and sound system. Our parents felt confident knowing we were in safe hands. Thank you for making our night so special!',
      isApproved: true,
      isFeatured: true,
    }
  })

  console.log('Seed completed successfully!')
  console.log({ limo, partyBus, sprinter, suv, testimonial1, testimonial2, testimonial3 })
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })