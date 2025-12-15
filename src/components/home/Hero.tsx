import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <Image
        src="/hero-bg.jpg"
        alt="Luxury Limousine"
        fill
        className="object-cover"
        priority
      />
      
      <div className="relative z-20 text-center px-4">
        <Image
          src="/logo_no_bg.png"
          alt="Iconic Limos Logo"
          width={400}
          height={200}
          className="mx-auto mb-8"
          priority
        />
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
          From Iconic Vehicles to Infinite Experiences
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Experience elegance and comfort with our premium fleet across the Greater Toronto Area
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/quote"
            className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300 text-lg font-semibold tracking-wide"
          >
            REQUEST A QUOTE
          </Link>
          <Link
            href="/fleet"
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
          >
            VIEW OUR FLEET
          </Link>
        </div>
      </div>
    </section>
  );
}