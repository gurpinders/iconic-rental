import Header from '@/components/layout/Header'
import Hero from '@/components/home/Hero'
import VehicleCategories from '@/components/home/VehicleCategories'
import FeaturedVehicles from '@/components/home/FeaturedVehicles'
import Services from '@/components/home/Services'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iconic Limos & Rentals | Luxury Transportation in Greater Toronto Area',
  description: 'Premium limousine and luxury bus rentals in the Greater Toronto Area. Weddings, corporate events, proms, airport transfers, and special occasions. Request your custom quote today.',
  keywords: 'luxury limos Toronto, limousine rental GTA, party bus rental Toronto, wedding transportation, corporate limo service, airport transfers Toronto',
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <VehicleCategories />
      <FeaturedVehicles />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  )
}