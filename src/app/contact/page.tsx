import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Contact Us | Iconic Limos & Rentals',
  description: 'Get in touch with Iconic Limos & Rentals. Contact us for luxury transportation inquiries, quotes, or any questions about our services.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white page-transition">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <Image
          src="/hero-bg.jpg"
          alt="Contact Iconic Limos"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            We're Here to Help with Your Luxury Transportation Needs
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Phone */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Call Us</h3>
              <a 
                href="tel:+14161234567" 
                className="text-lg text-gray-400 hover:text-white transition-colors"
              >
                (416) 123-4567
              </a>
              <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Email Us</h3>
              <a 
                href="mailto:info@iconiclimos.com" 
                className="text-lg text-gray-400 hover:text-white transition-colors"
              >
                info@iconiclimos.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
            </div>

            {/* Location */}
            <div className="text-center p-8 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/30 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Visit Us</h3>
              <p className="text-lg text-gray-400">
                Greater Toronto Area<br />
                Ontario, Canada
              </p>
              <p className="text-sm text-gray-500 mt-2">Serving GTA & Beyond</p>
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-wide mb-8">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Ready to book your luxury transportation? Request a personalized quote or 
              give us a call to discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/quote"
                className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all duration-300 text-lg font-semibold tracking-wide"
              >
                REQUEST A QUOTE
              </Link>
              <a
                href="tel:+14161234567"
                className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
              >
                CALL NOW
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & Additional Info */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-wide text-center mb-16">
            Business Information
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Operating Hours */}
            <div className="p-8 border border-white/20 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Operating Hours
              </h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex justify-between">
                  <span>Phone Support:</span>
                  <span className="text-white font-semibold">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Office Hours:</span>
                  <span className="text-white font-semibold">Mon-Fri: 9am-6pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend Service:</span>
                  <span className="text-white font-semibold">Available</span>
                </div>
                <div className="flex justify-between">
                  <span>Holiday Service:</span>
                  <span className="text-white font-semibold">Available</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                * We operate 24/7 for your convenience. Office hours are for administrative 
                inquiries only.
              </p>
            </div>

            {/* Service Areas */}
            <div className="p-8 border border-white/20 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Service Areas
              </h3>
              <div className="space-y-3 text-gray-400">
                <div>
                  <p className="text-white font-semibold mb-2">Primary Service Area:</p>
                  <p>Greater Toronto Area (GTA) including Toronto, Mississauga, Brampton, 
                  Vaughan, Markham, Richmond Hill, and surrounding regions.</p>
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Airport Services:</p>
                  <p>Toronto Pearson (YYZ), Billy Bishop (YTZ), Hamilton (YHM), Buffalo (BUF)</p>
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Extended Service:</p>
                  <p>Niagara Falls, Ottawa, Montreal - Available upon request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-6">
            Have Questions?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Check out our frequently asked questions or reach out directly for personalized assistance.
          </p>
          <Link
            href="/faq"
            className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-semibold tracking-wide"
          >
            VIEW FAQ
          </Link>
        </div>
      </section>

      {/* Map Placeholder (Optional) */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-8">
            Serving the Greater Toronto Area
          </h2>
          <div className="bg-zinc-900 border border-white/20 rounded-lg p-12 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xl text-gray-400">
                Map integration coming soon
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Proudly serving clients throughout the GTA
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}