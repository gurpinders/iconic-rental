import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: '404 - Page Not Found | Iconic Limos & Rentals',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-24">
      <div className="max-w-4xl w-full text-center">
        
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo_no_bg.png"
            alt="Iconic Limos Logo"
            width={200}
            height={100}
            className="mx-auto"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold tracking-wider opacity-20">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It may have been moved, 
            deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          
          {/* Home */}
          <Link
            href="/"
            className="p-6 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🏠
            </div>
            <h3 className="text-xl font-bold mb-2">Home</h3>
            <p className="text-gray-400 text-sm">
              Return to our homepage
            </p>
          </Link>

          {/* Fleet */}
          <Link
            href="/fleet"
            className="p-6 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🚗
            </div>
            <h3 className="text-xl font-bold mb-2">Our Fleet</h3>
            <p className="text-gray-400 text-sm">
              Browse luxury vehicles
            </p>
          </Link>

          {/* Quote */}
          <Link
            href="/quote"
            className="p-6 border border-white/20 rounded-lg hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              📝
            </div>
            <h3 className="text-xl font-bold mb-2">Get a Quote</h3>
            <p className="text-gray-400 text-sm">
              Request a custom quote
            </p>
          </Link>

        </div>

        {/* Popular Links */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm"
            >
              FAQ
            </Link>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-zinc-900 border border-white/20 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-6">
            If you believe this is an error or need assistance, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+14161234567"
              className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition-all duration-300 font-semibold tracking-wide"
            >
              📞 Call (416) 123-4567
            </a>
            <a
              href="mailto:info@iconiclimos.com"
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold tracking-wide"
            >
              ✉️ Email Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}