import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import VehicleCategories from '@/components/home/VehicleCategories'
import FeaturedVehicles from '@/components/home/FeaturedVehicles'
import Services from '@/components/home/Services'
import WhyChooseUs from '@/components/home/WhyChooseUs'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <VehicleCategories />
      <FeaturedVehicles />
      <Services />
      <WhyChooseUs />
      <Footer />
    </>
  )
}