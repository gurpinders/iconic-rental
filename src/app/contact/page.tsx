import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact Iconic Limos & Rentals for luxury transportation in Toronto. Call (416) 123-4567 or email info@iconiclimos.com. Available 24/7 for your convenience.',
  openGraph: {
    title: 'Contact Us - Iconic Limos & Rentals',
    description: 'Get in touch for luxury transportation services in Toronto.',
    images: ['/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white page-transition">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <Image
          src="/hero-bg.jpg"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with our team for personalized luxury transportation
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400">
              We're here to help 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Phone */}
            <div className="bg-zinc-900 border-2 border-white/20 rounded-lg p-10 text-center hover:border-white/40 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Call Us</h3>
              <a 
                href="tel:+14161234567" 
                className="text-3xl font-bold text-white hover:text-gray-300 transition-colors block mb-2"
              >
                (416) 123-4567
              </a>
              <p className="text-gray-400 text-sm">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="bg-zinc-900 border-2 border-white/20 rounded-lg p-10 text-center hover:border-white/40 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Email Us</h3>
              <a 
                href="mailto:info@iconiclimos.com" 
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors block mb-2"
              >
                info@iconiclimos.com
              </a>
              <p className="text-gray-400 text-sm">Quick Response</p>
            </div>

            {/* Location */}
            <div className="bg-zinc-900 border-2 border-white/20 rounded-lg p-10 text-center hover:border-white/40 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
              <p className="text-xl font-bold text-white mb-2">
                Greater Toronto Area
              </p>
              <p className="text-gray-400 text-sm">Serving all of GTA</p>
            </div>

          </div>

          {/* Business Hours */}
          <div className="mt-16 text-center">
            <div className="bg-zinc-900 border-2 border-white/20 rounded-lg p-8 inline-block">
              <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
              <p className="text-xl text-gray-300">Available 24/7</p>
              <p className="text-gray-400 mt-2">Open every day of the year</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-400">
              Or fill out the form below and we'll get back to you shortly
            </p>
          </div>

          <form className="bg-zinc-900 border border-white/20 rounded-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="(416) 123-4567"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors"
                placeholder="How can we help you?"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded focus:outline-none focus:border-white/50 transition-colors resize-none"
                placeholder="Tell us about your transportation needs..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white transition-all duration-300 font-bold tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-6">
            Have Questions?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Check out our frequently asked questions for quick answers
          </p>
          <Link
            href="/faq"
            className="inline-block px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            VIEW FAQ
          </Link>
        </div>
      </section>

      {/* Quick Quote CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-6">
            Need a Quote?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Get a personalized quote for your luxury transportation needs
          </p>
          <Link
            href="/quote"
            className="inline-block px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white transition-all duration-300 font-bold tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
          >
            REQUEST A QUOTE
          </Link>
        </div>
      </section>
    </div>
  );
}