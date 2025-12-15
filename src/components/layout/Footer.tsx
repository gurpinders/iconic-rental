import Image from 'next/image'
import Link from 'next/link'

export default function Footer(){
    return(
        <footer className="bg-black py-20 px-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div>
                        <Link href="/">
                            <Image 
                                src="/logo.jpg" 
                                alt="Iconic Limos Logo" 
                                width={180} 
                                height={72}
                                className="object-contain mb-4 cursor-pointer"
                            />
                        </Link>
                        <p className="text-gray-400 text-base">
                            From Iconic Vehicles to Infinite Experiences
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                    <h3 className="text-base font-semibold uppercase mb-4">Company</h3>
                    <ul className="space-y-2 text-base text-gray-400">
                        <li>
                        <Link href="/about" className="hover:text-white transition-colors">
                            About Us
                        </Link>
                        </li>
                        <li>
                        <Link href="/fleet" className="hover:text-white transition-colors">
                            Our Fleet
                        </Link>
                        </li>
                        <li>
                        <Link href="/services" className="hover:text-white transition-colors">
                            Services
                        </Link>
                        </li>
                        <li>
                        <Link href="/faq" className="hover:text-white transition-colors">
                            FAQ
                        </Link>
                        </li>
                        <li>
                        <Link href="/contact" className="hover:text-white transition-colors">
                            Contact
                        </Link>
                        </li>
                        <li>
                        <Link href="/quote" className="hover:text-white transition-colors">
                            Request Quote
                        </Link>
                        </li>
                    </ul>
                    </div>
                    {/* Services Links */}
                    <div>
                        <h3 className="text-base font-semibold uppercase mb-4">Services</h3>
                        <ul className="space-y-2 text-base text-gray-400">
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Wedding Transportation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Corporate Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Airport Transfers
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Party & Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Prom & Graduation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-semibold uppercase mb-4">Contact</h3>
                        <div className="space-y-2 text-base text-gray-400">
                            <p>
                                <a href="tel:+14161234567" className="hover:text-white transition-colors">
                                    📞 (416) 123-4567
                                </a>
                            </p>
                            <p>
                                <a href="mailto:info@iconiclimos.com" className="hover:text-white transition-colors">
                                    ✉️ info@iconiclimos.com
                                </a>
                            </p>
                            <p>📍 Toronto, ON</p>
                            <p>⏰ Available 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-12 pt-8 text-center">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link 
                        href="/terms" 
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                        >
                        Terms & Conditions
                        </Link>
                        <span className="text-gray-700">|</span>
                        <Link 
                        href="/privacy" 
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                        >
                        Privacy Policy
                        </Link>
                    </div>
                    <p className="text-base text-gray-500">
                        &copy; 2024 Iconic Limos & Rentals. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}