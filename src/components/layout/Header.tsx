import Button from '@/components/ui/Button'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/95 border-b border-white/10 z-50">
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <Image 
        src="/logo.jpg" 
        alt="Iconic Limos Logo" 
        width={180} 
        height={60}
        className="object-contain"
        />
        
        <ul className="flex gap-10 items-center">
          <li><a href="#home" className="text-base text-gray-300 hover:text-white transition-colors">Home</a></li>
          <li><a href="#fleet" className="text-base text-gray-300 hover:text-white transition-colors">Fleet</a></li>
          <li><a href="#services" className="text-base text-gray-300 hover:text-white transition-colors">Services</a></li>
          <li><a href="#about" className="text-base text-gray-300 hover:text-white transition-colors">About</a></li>
          <li><a href="#contact" className="text-base text-gray-300 hover:text-white transition-colors">Contact</a></li>
          <li><Button variant="primary">Reserve Now</Button></li>
        </ul>
      </nav>
    </header>
  )
}