'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 border-b z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 border-white/10' 
        : 'bg-transparent border-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <Image 
          src="/logo_no_bg_simple.png" 
          alt="Iconic Limos Logo" 
          width={140}
          height={80}
          className="object-contain"
        />
        
        <ul className="flex gap-12 items-center">
          <li><a href="/home" className="text-base text-gray-300 hover:text-white transition-colors">Home</a></li>
          <li><a href="/fleet" className="text-base text-gray-300 hover:text-white transition-colors">Fleet</a></li>
          <li><a href="/services" className="text-base text-gray-300 hover:text-white transition-colors">Services</a></li>
          <li><a href="/about" className="text-base text-gray-300 hover:text-white transition-colors">About</a></li>
          <li><a href="/contact" className="text-base text-gray-300 hover:text-white transition-colors">Contact</a></li>
          <li><Button variant="primary">Reserve Now</Button></li>
        </ul>
      </nav>
    </header>
  )
}