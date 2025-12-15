import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Iconic Limos & Rentals',
  description: 'Terms and conditions for using Iconic Limos & Rentals luxury transportation services in the Greater Toronto Area.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white page-transition pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400">
            Last Updated: December 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              1. Introduction
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Welcome to Iconic Limos & Rentals ("Company", "we", "our", "us"). These Terms and Conditions 
              ("Terms") govern your use of our luxury transportation services and website. By booking our 
              services or using our website, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Please read these Terms carefully before using our services. If you do not agree with any 
              part of these Terms, please do not use our services.
            </p>
          </section>

          {/* Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              2. Services
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Iconic Limos & Rentals provides luxury ground transportation services including but not 
              limited to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Limousine rentals for special events</li>
              <li>Party bus and luxury bus rentals</li>
              <li>Executive SUV and sprinter van services</li>
              <li>Airport transfers and corporate transportation</li>
              <li>Wedding and special occasion transportation</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              All services are subject to availability and must be booked in advance through our quote 
              request system or by contacting us directly.
            </p>
          </section>

          {/* Booking & Reservations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              3. Booking & Reservations
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-white">3.1 Quote Requests</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              All bookings begin with a quote request. Quotes are customized based on your specific 
              requirements and are valid for 7 days from the date of issuance unless otherwise stated.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-white">3.2 Confirmation</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              A reservation is confirmed only upon receipt of the required deposit and written confirmation 
              from Iconic Limos & Rentals. We reserve the right to decline any reservation request.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-white">3.3 Deposit Requirements</h3>
            <p className="text-gray-400 leading-relaxed">
              A non-refundable deposit is required to secure your reservation. The deposit amount varies 
              by service type and will be specified in your quote. The remaining balance is due before or 
              on the day of service.
            </p>
          </section>

          {/* Payment */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              4. Payment Terms
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We accept major credit cards, debit cards, bank transfers, and certified checks. All prices 
              are quoted in Canadian Dollars (CAD) and are subject to applicable taxes.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              <strong className="text-white">Gratuity:</strong> Driver gratuity is not included in quoted 
              prices. Standard gratuity is 15-20% of the total service cost, though this is at your discretion.
            </p>
            <p className="text-gray-400 leading-relaxed">
              <strong className="text-white">Additional Charges:</strong> Additional charges may apply for 
              overtime, excessive cleaning, damage to vehicle, or additional stops not specified in the 
              original booking.
            </p>
          </section>

          {/* Cancellation & Modifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              5. Cancellation & Modification Policy
            </h2>
            <h3 className="text-xl font-semibold mb-3 text-white">5.1 Cancellations by Customer</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>More than 14 days before service: 50% refund of deposit</li>
              <li>7-14 days before service: 25% refund of deposit</li>
              <li>Less than 7 days before service: No refund</li>
              <li>No-show or same-day cancellation: Full charge applies</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-white">5.2 Modifications</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Changes to reservations are subject to availability and may result in price adjustments. 
              We will do our best to accommodate changes but cannot guarantee availability for modified dates.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-white">5.3 Cancellations by Company</h3>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to cancel any reservation due to circumstances beyond our control 
              (weather, mechanical issues, etc.). In such cases, a full refund will be provided, and we 
              will assist in finding alternative arrangements when possible.
            </p>
          </section>

          {/* Customer Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              6. Customer Responsibilities
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Customers are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Providing accurate booking information including addresses, times, and passenger count</li>
              <li>Being ready for pickup at the scheduled time</li>
              <li>Ensuring all passengers comply with Ontario laws and regulations</li>
              <li>Maintaining appropriate conduct and respecting the vehicle and chauffeur</li>
              <li>Supervising minors at all times</li>
              <li>Informing us of any special requirements or accessibility needs</li>
            </ul>
          </section>

          {/* Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              7. Liability & Insurance
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              All vehicles are fully insured and maintained to the highest safety standards. However, 
              Iconic Limos & Rentals is not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>Delays caused by traffic, weather, or circumstances beyond our control</li>
              <li>Personal belongings left in vehicles</li>
              <li>Missed flights, events, or appointments due to customer-provided incorrect information</li>
              <li>Indirect or consequential damages</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              Customers are liable for any damage to the vehicle caused by their party, including but not 
              limited to excessive cleaning fees, property damage, or violations of smoking/alcohol policies.
            </p>
          </section>

          {/* Conduct Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              8. Conduct & Safety Policy
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We maintain a zero-tolerance policy for:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>Illegal activities of any kind</li>
              <li>Harassment or abuse of chauffeurs or staff</li>
              <li>Smoking or vaping in vehicles (where prohibited)</li>
              <li>Excessive intoxication or endangering behavior</li>
              <li>Damage to vehicle property</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              The chauffeur has the right to terminate service immediately if safety or conduct policies 
              are violated, with no refund provided.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              9. Intellectual Property
            </h2>
            <p className="text-gray-400 leading-relaxed">
              All content on the Iconic Limos & Rentals website, including text, graphics, logos, images, 
              and software, is the property of Iconic Limos & Rentals and protected by copyright laws. 
              Unauthorized use is prohibited.
            </p>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              10. Privacy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-white hover:text-gray-300 underline">
                Privacy Policy
              </Link>{' '}
              to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              11. Changes to Terms
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Iconic Limos & Rentals reserves the right to modify these Terms at any time. Changes will 
              be effective immediately upon posting on our website. Continued use of our services after 
              changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              12. Governing Law
            </h2>
            <p className="text-gray-400 leading-relaxed">
              These Terms are governed by the laws of Ontario, Canada. Any disputes arising from these 
              Terms or our services shall be resolved in the courts of Ontario.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              13. Contact Information
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg border border-white/20">
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:info@iconiclimos.com" className="text-white hover:text-gray-300">
                  info@iconiclimos.com
                </a>
              </p>
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Phone:</strong>{' '}
                <a href="tel:+14161234567" className="text-white hover:text-gray-300">
                  (416) 123-4567
                </a>
              </p>
              <p className="text-gray-400">
                <strong className="text-white">Address:</strong> Greater Toronto Area, Ontario, Canada
              </p>
            </div>
          </section>

        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}