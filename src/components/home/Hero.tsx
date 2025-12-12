import Button from '@/components/ui/Button'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-10" />
      
      <div className="relative z-20 text-center px-8 max-w-5xl mx-auto">
        <Image 
        src="/logo_no_bg.png" 
        alt="Iconic Limos Logo" 
        width={300}
        height={120}
        className="mx-auto mb-8 drop-shadow-2xl"
        />
        <h1 className="text-6xl md:text-7xl font-bold mb-6">
          Luxury Transportation in the GTA
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Experience elegance and comfort with Iconic Limos & Rentals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary">Request a Quote</Button>
          <Button variant="outline">View Our Fleet</Button>
        </div>
        
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
    </div>
    </section>
  )
}