import Image from 'next/image'

export default function Footer(){
    return(
        <footer className="bg-black py-20 px-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-4 gap-12">
                    <div>
                        <Image 
                        src="/logo.jpg" 
                        alt="Iconic Limos Logo" 
                        width={180} 
                        height={72}
                        className="object-contain mb-4"
                        />
                        <p className="text-gray-400 text-base">Providing luxury transportation services across the Greater Toronto Area.</p>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold uppercase mb-4">Company</h3>
                        <ul className="space-y-2 text-base text-gray-400">
                            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#fleet" className="hover:text-white transition-colors">Our Fleet</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold uppercase mb-4">Services</h3>
                        <ul className="space-y-2 text-base text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Wedding Transportation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Corporate Events</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Airport Transfers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Party & Events</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold uppercase mb-4">Contact</h3>
                        <div className="space-y-2 text-base text-gray-400">
                            <p>📞 (416) 123-4567</p>
                            <p>✉ info@iconiclimos.com</p>
                            <p>📍 Toronto, ON</p>
                            <p>⏰ Available 24/7</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-12 pt-8 text-center text-base text-gray-500">
                    <p>&copy; 2024 Iconic Limos & Rentals. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}