'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 border-b z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-md border-white/20 shadow-lg' 
        : 'bg-black/50 backdrop-blur-sm border-white/10'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        <Link href="/">
          <Image 
            src="/logo_no_bg_simple.png" 
            alt="Iconic Limos Logo" 
            width={120}
            height={60}
            className="object-contain cursor-pointer md:w-[140px] md:h-[80px]"
          />
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile */}
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
          <li>
            <Link 
              href="/quote"
              className="btn-primary inline-block text-lg"
            >
              RESERVE NOW
            </Link>
          </li>
        </ul>

        {/* Mobile CTA Button - Only show Reserve Now on mobile */}
        <div className="lg:hidden">
          <Link 
            href="/quote"
            className="btn-primary inline-block text-lg"
          >
            RESERVE NOW!
          </Link>
        </div>
      </nav>
    </header>
  );
}