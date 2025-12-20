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
        {/* Responsive Logo */}
        <Image
          src="/logo_no_bg.png"
          alt="Iconic Limos Logo"
          width={300}
          height={150}
          className="mx-auto mb-6 md:mb-8 w-[250px] md:w-[350px] lg:w-[400px] h-auto"
          priority
        />
        
        {/* Responsive Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wide mb-4 md:mb-6 px-2">
          From Iconic Vehicles to Infinite Experiences
        </h1>
        
        {/* Responsive Subheading */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto px-4">
          Experience elegance and comfort with our premium fleet across the Greater Toronto Area
        </p>
        
        {/* Responsive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
          <Link
            href="/quote"
            className="btn-primary inline-block text-base sm:text-lg"
          >
            REQUEST A QUOTE
          </Link>
          <Link
            href="/fleet"
            className="btn-secondary inline-block text-base sm:text-lg"
          >
            VIEW OUR FLEET
          </Link>
        </div>
      </div>
    </section>
  );
}