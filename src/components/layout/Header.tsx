'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const checkAuth = () => {
      const token = document.cookie.includes('customer-auth-token');
      setIsLoggedIn(token);
    };
    
    // Run once on mount
    handleScroll();
    checkAuth();
    
    // Subscribe to scroll events
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-white/20 shadow-lg' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        <Link href="/" onClick={closeMobileMenu}>
          <Image 
            src="/logo_no_bg_simple.png" 
            alt="Iconic Limos Logo" 
            width={120}
            height={60}
            className="object-contain cursor-pointer md:w-[140px] md:h-[80px]"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-8 xl:gap-12 items-center">
          <li>
            <Link href="/" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/fleet" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              Fleet
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              Services
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              About
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-base text-white hover:text-gray-300 transition-colors font-medium">
              Contact
            </Link>
          </li>
          
          {/* Account Icon Button - Desktop */}
          <li>
            <Link
              href={isLoggedIn ? '/customer/dashboard' : '/customer/login'}
              className="text-white hover:text-gray-300 transition-colors"
              title={isLoggedIn ? 'My Account' : 'Sign In'}
            >
              <svg 
                className="w-7 h-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </Link>
          </li>

          {/* Reserve Now Button - Smaller */}
          <li>
            <Link 
              href="/quote"
              className="btn-primary inline-block text-base px-5 py-2.5"
            >
              RESERVE NOW
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            // X icon
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-b border-white/20">
          <ul className="px-4 py-6 space-y-4">
            <li>
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/fleet" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                Fleet
              </Link>
            </li>
            <li>
              <Link 
                href="/services" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                Services
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/faq" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={closeMobileMenu}
                className="block text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                Contact
              </Link>
            </li>
            
            {/* Account Button - Mobile */}
            <li className="pt-2">
              <Link 
                href={isLoggedIn ? '/customer/dashboard' : '/customer/login'}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-lg text-white hover:text-gray-300 transition-colors font-medium py-2"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                {isLoggedIn ? 'My Account' : 'Sign In'}
              </Link>
            </li>

            {/* Reserve Now Button - Mobile */}
            <li className="pt-2">
              <Link 
                href="/quote"
                onClick={closeMobileMenu}
                className="btn-primary block text-center text-base py-3"
              >
                RESERVE NOW
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}