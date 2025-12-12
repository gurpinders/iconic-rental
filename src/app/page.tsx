import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import VehicleCategories from '@/components/home/VehicleCategories'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <VehicleCategories />
      <Footer />
    </>
  )
}