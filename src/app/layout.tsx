import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { headers } from 'next/headers'
import StructuredData from '@/components/StructuredData'
import GoogleTagManager from '@/components/analytics/GoogleTagManager' // NEW

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://your-site.vercel.app'),
    title: {
      default: 'Iconic Limos & Rentals | Luxury Transportation in GTA',
      template: '%s | Iconic Limos & Rentals'
    },
    description: 'Premium limousine and bus rental services...',
    keywords: ['limousine rental', 'bus rental'],
    
    verification: {
      google: 'hCOgbVYc_swzIgALMLQZX36bvX9BD2pbU6PL39ZY9fI', 
    },
    
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased bg-black text-white`}>
        {/* Google Tag Manager */}
        <GoogleTagManager />
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <StructuredData />
        {!isAdminRoute && <Header />}
        {children}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  )
}