import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Our Services | Iconic Limos & Rentals',
  description: 'Luxury transportation services for weddings, corporate events, proms, airport transfers, parties, and special occasions in the Greater Toronto Area.',
};

export default function ServicesPage() {
  const services = [
    {
      title: 'Wedding Transportation',
      emoji: '💍',
      description: 'Make your special day even more memorable with our luxury wedding transportation services.',
      features: [
        'Elegant vehicles for bride and groom',
        'Group transportation for wedding party',
        'Coordination with wedding schedule',
        'Champagne service available',
        'Red carpet treatment',
        'Professional, discrete chauffeurs',
      ],
      image: '/limo_ad.jpeg',
    },
    {
      title: 'Corporate Events',
      emoji: '💼',
      description: 'Professional transportation solutions for business meetings, conferences, and corporate events.',
      features: [
        'Executive sedans and SUVs',
        'Airport pick-up and drop-off',
        'Multi-destination itineraries',
        'Wi-Fi equipped vehicles',
        'Punctual, reliable service',
        'Corporate billing available',
      ],
      image: '/suv.jpg',
    },
    {
      title: 'Prom & Graduation',
      emoji: '🎓',
      description: 'Safe, stylish transportation for your once-in-a-lifetime celebration.',
      features: [
        'Stretch limos and party buses',
        'Parent-approved safety measures',
        'Group packages available',
        'Photo opportunities',
        'Experienced chauffeurs',
        'Affordable group rates',
      ],
      image: '/party_bus.jpg',
    },
    {
      title: 'Airport Transfers',
      emoji: '✈️',
      description: 'Stress-free airport transportation to and from Pearson, Billy Bishop, and Hamilton airports.',
      features: [
        'Flight tracking and monitoring',
        'Meet and greet service',
        'Luggage assistance',
        'All major airports covered',
        'Early morning and late night available',
        'Fixed rates, no surge pricing',
      ],
      image: '/merc_sprinter.jpg',
    },
    {
      title: 'Party & Celebrations',
      emoji: '🎉',
      description: 'Turn any celebration into an unforgettable experience with our party transportation.',
      features: [
        'Party buses with premium sound systems',
        'LED lighting and entertainment',
        'Bar areas (BYOB)',
        'Bachelor/bachelorette parties',
        'Birthday celebrations',
        'Night out transportation',
      ],
      image: '/party.jpg',
    },
    {
      title: 'Special Occasions',
      emoji: '⭐',
      description: 'Luxury transportation for concerts, sporting events, anniversaries, and more.',
      features: [
        'Concert and event transportation',
        'Sporting event packages',
        'Anniversary celebrations',
        'Wine tours',
        'Casino trips',
        'Custom itineraries',
      ],
      image: '/luxury_bus.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white page-transition">
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <Image
            src="/hero-bg.jpg"
            alt="Luxury transportation services"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Premium Luxury Transportation for Every Occasion
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-400 leading-relaxed">
              At Iconic Limos & Rentals, we provide comprehensive luxury transportation services 
              throughout the Greater Toronto Area. Whether you're planning a wedding, corporate event, 
              or special celebration, our professional team ensures a seamless, elegant experience 
              from start to finish.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto space-y-20">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative h-[400px] rounded-lg overflow-hidden border border-white/20 hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 ${
                    index % 2 === 1 ? 'md:col-start-2' : ''
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{service.emoji}</span>
                    <h2 className="text-4xl font-bold tracking-wide">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-white flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/quote"
                    className="inline-block px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold tracking-wide"
                  >
                    REQUEST QUOTE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold tracking-wide text-center mb-16">
              How It Works
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Request Quote</h3>
                <p className="text-gray-400">
                  Fill out our simple quote request form with your event details and requirements.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">Get Custom Quote</h3>
                <p className="text-gray-400">
                  Receive a personalized quote tailored to your specific needs within 24 hours.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
                <p className="text-gray-400">
                  Review your quote, confirm details, and secure your reservation with a deposit.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-white rounded-full text-3xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold mb-4">Enjoy Your Ride</h3>
                <p className="text-gray-400">
                  Sit back and enjoy luxury transportation with our professional chauffeurs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold tracking-wide text-center mb-12">
              Service Areas
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">Greater Toronto Area</h3>
                <p className="text-gray-400">
                  Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, and surrounding areas.
                </p>
              </div>
              <div className="p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">Airport Services</h3>
                <p className="text-gray-400">
                  Toronto Pearson (YYZ), Billy Bishop (YTZ), Hamilton (YHM), and Buffalo (BUF).
                </p>
              </div>
              <div className="p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">Long Distance</h3>
                <p className="text-gray-400">
                  Extended trips to Niagara Falls, Ottawa, Montreal, and other destinations available upon request.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-zinc-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold tracking-wide text-center mb-16">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="border-b border-white/20 pb-6">
                <h3 className="text-xl font-bold mb-3">How far in advance should I book?</h3>
                <p className="text-gray-400">
                  We recommend booking at least 2-4 weeks in advance for weddings and major events. 
                  However, we often accommodate last-minute requests based on availability.
                </p>
              </div>

              <div className="border-b border-white/20 pb-6">
                <h3 className="text-xl font-bold mb-3">What's included in the service?</h3>
                <p className="text-gray-400">
                  All services include professional chauffeur, fuel, insurance, and standard amenities. 
                  Additional features like champagne service, decorations, or special requests can be added to your quote.
                </p>
              </div>

              <div className="border-b border-white/20 pb-6">
                <h3 className="text-xl font-bold mb-3">Do you offer hourly rentals?</h3>
                <p className="text-gray-400">
                  Yes! We offer flexible hourly rentals with various minimum hour requirements depending 
                  on the vehicle and service type. Point-to-point and full-day packages are also available.
                </p>
              </div>

              <div className="border-b border-white/20 pb-6">
                <h3 className="text-xl font-bold mb-3">What is your cancellation policy?</h3>
                <p className="text-gray-400">
                  Cancellation policies vary by service type and are outlined in your booking agreement. 
                  We strive to be flexible and work with clients when unforeseen circumstances arise.
                </p>
              </div>

              <div className="border-b border-white/20 pb-6">
                <h3 className="text-xl font-bold mb-3">Are gratuities included?</h3>
                <p className="text-gray-400">
                  Gratuity is not included in quoted prices. Standard gratuity is 15-20% of the total service cost, 
                  though this is at your discretion based on service quality.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-xl font-bold mb-3">Can I customize my service package?</h3>
                <p className="text-gray-400">
                  Absolutely! Every client has unique needs. Let us know your requirements in the quote 
                  request form, and we'll create a customized package just for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-6">
              Ready to Book Your Luxury Experience?
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Get a personalized quote for your upcoming event or special occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/quote"
                className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300 text-lg font-semibold tracking-wide"
              >
                REQUEST A QUOTE
              </Link>
              <Link
                href="/fleet"
                className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
              >
                VIEW OUR FLEET
              </Link>
            </div>
            <div className="mt-8">
              <p className="text-gray-400 mb-2">Or call us directly:</p>
              <a
                href="tel:+14165551234"
                className="text-2xl font-bold hover:text-gray-300 transition-colors"
              >
                (416) 555-1234
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
    
  );
}