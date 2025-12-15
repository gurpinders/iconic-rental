import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Iconic Limos & Rentals',
  description: 'Privacy policy for Iconic Limos & Rentals. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white page-transition pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
            Privacy Policy
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
              Iconic Limos & Rentals ("we", "our", "us") is committed to protecting your privacy and 
              ensuring the security of your personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our services or visit 
              our website.
            </p>
            <p className="text-gray-400 leading-relaxed">
              By using our services, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold mb-3 text-white">2.1 Personal Information</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              When you request a quote or book our services, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Event details (date, time, location, type of service)</li>
              <li>Payment information (processed securely through payment processors)</li>
              <li>Special requests or accessibility requirements</li>
              <li>Company or organization name (for corporate bookings)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-white">2.2 Automatically Collected Information</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website or source</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Processing and fulfilling your reservation requests</li>
              <li>Communicating with you about your bookings and services</li>
              <li>Sending confirmation emails and service updates</li>
              <li>Processing payments and preventing fraud</li>
              <li>Improving our services and customer experience</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Complying with legal obligations</li>
              <li>Sending promotional communications (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              4. Information Sharing & Disclosure
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li><strong className="text-white">Service Providers:</strong> With trusted third-party service providers who assist in operating our business (payment processors, email services, etc.)</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              All third-party service providers are contractually obligated to maintain the confidentiality 
              and security of your information.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              5. Data Security
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure server infrastructure</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              6. Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. 
              Cookies are small files stored on your device that help us:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li>Remember your preferences</li>
              <li>Understand how you use our website</li>
              <li>Improve site performance and functionality</li>
              <li>Provide personalized content</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may 
              affect your ability to use certain features of our website.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              7. Your Privacy Rights
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mb-4">
              <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong className="text-white">Data Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw your consent for data processing where applicable</li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              8. Data Retention
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and 
              enforce our agreements. When information is no longer needed, we securely delete or 
              anonymize it.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              9. Children's Privacy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately so we can delete it.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              10. Third-Party Links
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices or content of these external sites. We encourage you to review the 
              privacy policies of any third-party sites you visit.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or legal requirements. We will notify you of significant changes by posting the updated 
              policy on our website with a new "Last Updated" date. Your continued use of our services 
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-white/20">
              12. Contact Us
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our 
              data practices, please contact us:
            </p>
            <div className="bg-zinc-900 p-6 rounded-lg border border-white/20">
              <p className="text-gray-400 mb-2">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:privacy@iconiclimos.com" className="text-white hover:text-gray-300">
                  privacy@iconiclimos.com
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