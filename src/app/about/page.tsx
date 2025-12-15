import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Iconic Limos & Rentals',
  description: 'Learn about Iconic Limos & Rentals - Greater Toronto Area\'s premier luxury transportation service. Experience, quality, and exceptional service.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <Image
          src="/hero-bg.jpg"
          alt="Luxury limousine"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
            About Iconic Limos
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Redefining Luxury Transportation in the Greater Toronto Area
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-wide mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Founded with a vision to transform luxury transportation in the Greater Toronto Area, 
                  Iconic Limos & Rentals has become synonymous with elegance, reliability, and exceptional service.
                </p>
                <p>
                  What started as a passion for providing unforgettable experiences has grown into a 
                  full-service luxury transportation company, serving clients across Toronto and the surrounding regions.
                </p>
                <p>
                  Today, we pride ourselves on maintaining a diverse fleet of meticulously maintained vehicles 
                  and a team dedicated to making every journey memorable.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden border border-white/20">
              <Image
                src="/limo_ad.jpeg"
                alt="Our fleet"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-wide mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              To provide exceptional luxury transportation experiences that exceed expectations, 
              creating lasting memories for every client we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Excellence */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-400">
                We maintain the highest standards in vehicle maintenance, driver professionalism, 
                and customer service.
              </p>
            </div>

            {/* Reliability */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Reliability</h3>
              <p className="text-gray-400">
                On-time service, every time. We understand that punctuality is crucial for 
                your special events and important occasions.
              </p>
            </div>

            {/* Luxury */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Luxury</h3>
              <p className="text-gray-400">
                From our premium vehicle selection to our attention to detail, we deliver 
                an unparalleled luxury experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-wide text-center mb-16">
            Why Choose Iconic Limos?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Premium Fleet</h3>
                  <p className="text-gray-400">
                    Our diverse selection includes luxury sedans, stretch limousines, party buses, 
                    and executive SUVs - all meticulously maintained to the highest standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">👔</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Professional Chauffeurs</h3>
                  <p className="text-gray-400">
                    Our experienced, licensed, and professionally trained chauffeurs ensure 
                    safe, smooth, and courteous service for every journey.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Personalized Service</h3>
                  <p className="text-gray-400">
                    We tailor each experience to your specific needs, from route planning 
                    to special amenities, ensuring your satisfaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
                  <p className="text-gray-400">
                    No hidden fees or surprises. We provide detailed quotes customized to 
                    your needs before you book.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">🕐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
                  <p className="text-gray-400">
                    Day or night, weekday or weekend - we're ready to serve you whenever 
                    you need luxury transportation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-white/30 rounded-lg">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
                  <p className="text-gray-400">
                    With extensive knowledge of the Greater Toronto Area, we navigate 
                    efficiently to get you to your destination on time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Preview Section */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-6">
            Explore Our Premium Fleet
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            From intimate celebrations to large group events, we have the perfect vehicle 
            for every occasion.
          </p>
          <Link
            href="/fleet"
            className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
          >
            VIEW OUR FLEET
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-6">
            Ready to Experience Iconic Luxury?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Request a personalized quote and let us make your next journey unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/quote"
              className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300 text-lg font-semibold tracking-wide"
            >
              REQUEST A QUOTE
            </Link>
            <a
              href="tel:+14165551234"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
            >
              CALL US NOW
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}