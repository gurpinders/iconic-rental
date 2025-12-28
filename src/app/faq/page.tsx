import Link from 'next/link';
import Image from 'next/image';
import Accordion from '@/components/ui/Accordion';

export const metadata = {
  title: 'Frequently Asked Questions | Iconic Limos & Rentals',
  description: 'Find answers to common questions about our luxury transportation services, booking process, pricing, vehicles, and policies.',
};

export default function FAQPage() {
  // FAQ Categories and Questions
  const bookingFAQs = [
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking at least 2-4 weeks in advance for weddings and major events to ensure vehicle availability. However, we often accommodate last-minute requests based on our schedule. Contact us directly for urgent bookings.',
    },
    {
      question: 'How do I request a quote?',
      answer: 'Simply fill out our online quote request form with your event details, or call us directly at (416) 123-4567. We\'ll review your requirements and send you a personalized quote within 24 hours.',
    },
    {
      question: 'What information do I need to provide when booking?',
      answer: 'We need your event date, time, pickup/dropoff locations, number of passengers, type of event, and duration of service. Any special requests or specific vehicle preferences should also be mentioned.',
    },
    {
      question: 'Can I modify or cancel my reservation?',
      answer: 'Yes, modifications can be made based on availability. Cancellation policies vary by service type and are outlined in your booking agreement. We recommend reviewing these terms when you receive your quote.',
    },
  ];

  const pricingFAQs = [
    {
      question: 'How is pricing calculated?',
      answer: 'Pricing is customized based on several factors including vehicle type, duration of service, distance, date/time of event, and any special requests. We provide transparent, all-inclusive quotes with no hidden fees.',
    },
    {
      question: 'Do you display prices on the website?',
      answer: 'No, we don\'t display standard pricing because every event is unique. We provide personalized quotes that reflect your specific needs and ensure you get the best value for your requirements.',
    },
    {
      question: 'What forms of payment do you accept?',
      answer: 'We accept major credit cards, debit cards, bank transfers, and certified checks. A deposit is required to secure your booking, with the balance due before or on the day of service.',
    },
    {
      question: 'Are gratuities included in the price?',
      answer: 'Gratuity is not included in quoted prices. Standard gratuity is 15-20% of the total service cost, though this is at your discretion based on the quality of service provided.',
    },
  ];

  const vehicleFAQs = [
    {
      question: 'What types of vehicles do you offer?',
      answer: 'Our fleet includes luxury sedans, stretch limousines, party buses, luxury buses, sprinter vans, and executive SUVs. Each vehicle is meticulously maintained and equipped with premium amenities.',
    },
    {
      question: 'Can I see the vehicle before booking?',
      answer: 'Yes! We encourage clients to view our vehicles. Contact us to schedule an appointment to inspect our fleet at our facility. Photos are also available on our website.',
    },
    {
      question: 'How many passengers can your vehicles accommodate?',
      answer: 'Our vehicles range from intimate 2-passenger luxury sedans to spacious 45-passenger buses. Browse our fleet page to see specific capacity for each vehicle type.',
    },
    {
      question: 'Are your vehicles wheelchair accessible?',
      answer: 'Some of our vehicles can accommodate wheelchairs. Please mention accessibility requirements in your quote request so we can recommend the most suitable vehicle.',
    },
  ];

  const serviceFAQs = [
    {
      question: 'Do you provide service outside the Greater Toronto Area?',
      answer: 'Yes! While we primarily serve the GTA, we offer extended services to Niagara Falls, Ottawa, Montreal, and other destinations. Long-distance rates apply for trips beyond our standard service area.',
    },
    {
      question: 'What amenities are included in your vehicles?',
      answer: 'Standard amenities vary by vehicle but typically include leather seating, climate control, premium sound systems, mood lighting, and complimentary refreshments. Luxury vehicles may include additional features like bars, TVs, and more.',
    },
    {
      question: 'Can I bring alcohol in the vehicle?',
      answer: 'Yes, passengers 19+ may bring alcohol (BYOB) in most vehicles. We provide ice and glassware. The chauffeur does not serve alcohol, and we require responsible consumption. No alcohol is permitted in certain vehicles - please ask when booking.',
    },
    {
      question: 'Do you offer hourly rentals?',
      answer: 'Yes! We offer flexible hourly rentals with minimum hour requirements that vary by vehicle type and day of the week. Point-to-point and full-day packages are also available.',
    },
  ];

  const eventFAQs = [
    {
      question: 'What types of events do you service?',
      answer: 'We service all types of events including weddings, corporate functions, proms, graduations, airport transfers, wine tours, concerts, sporting events, bachelor/bachelorette parties, and special celebrations.',
    },
    {
      question: 'Do you provide red carpet service?',
      answer: 'Yes! Red carpet service is available for weddings and special events. Just mention this in your quote request and we\'ll include it in your package.',
    },
    {
      question: 'Can you accommodate multiple stops?',
      answer: 'Absolutely! Multiple pickup and dropoff locations can be arranged. Just provide all addresses when requesting your quote, and we\'ll plan the most efficient route.',
    },
    {
      question: 'What happens if my event runs longer than expected?',
      answer: 'If you need additional time, inform your chauffeur and we\'ll do our best to accommodate. Overtime is charged in 30-minute or hourly increments at the rate specified in your contract.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white page-transition">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <Image
          src="/hero-bg.jpg"
          alt="Frequently Asked Questions"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our luxury transportation services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Booking Questions */}
          <div className="mb-16 group">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-white/20">
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-wide">
                Booking & Reservations
              </h2>
            </div>
            <Accordion items={bookingFAQs} />
          </div>

          {/* Pricing Questions */}
          <div className="mb-16 group">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-white/20">
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-wide">
                Pricing & Payment
              </h2>
            </div>
            <Accordion items={pricingFAQs} />
          </div>

          {/* Vehicle Questions */}
          <div className="mb-16 group">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-white/20">
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-wide">
                Vehicles & Fleet
              </h2>
            </div>
            <Accordion items={vehicleFAQs} />
          </div>

          {/* Service Questions */}
          <div className="mb-16 group">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-white/20">
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-wide">
                Services & Amenities
              </h2>
            </div>
            <Accordion items={serviceFAQs} />
          </div>

          {/* Event Questions */}
          <div className="mb-16 group">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-white/20">
              <div className="text-white group-hover:scale-110 transition-transform duration-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-wide">
                Events & Special Occasions
              </h2>
            </div>
            <Accordion items={eventFAQs} />
          </div>

        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Our team is here to help! Contact us directly and we'll be happy to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300 text-lg font-semibold tracking-wide rounded-xl"
            >
              CONTACT US
            </Link>
            <a
              href="tel:+14161234567"
              className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide rounded-xl"
            >
              CALL (416) 123-4567
            </a>
          </div>
          <div className="mt-12">
            <Link
              href="/quote"
              className="text-white hover:text-gray-300 transition-colors underline"
            >
              Or request a quote for your event →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}