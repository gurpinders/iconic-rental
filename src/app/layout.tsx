import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { headers } from 'next/headers'
import StructuredData from '@/components/StructuredData'
import GoogleTagManager from '@/components/analytics/GoogleTagManager'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://iconic-rental.vercel.app'),
  title: {
    default: 'Iconic Limos & Rentals | Luxury Transportation in GTA',
    template: '%s | Iconic Limos & Rentals'
  },
  description: 'Premium limousine and bus rental services in the Greater Toronto Area. Professional chauffeurs, luxury fleet, and exceptional service for all occasions.',
  keywords: ['limousine rental', 'bus rental', 'luxury transportation', 'GTA limo service', 'Toronto limo'],
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  
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
  
  console.log('🔍 PATHNAME:', pathname);
  
  // Hide header/footer on admin pages AND all customer pages
  const isAdminRoute = pathname.startsWith('/admin')
  const isCustomerRoute = pathname.startsWith('/customer')
  const isAuthRoute = pathname.startsWith('/admin-login')

  
  const hideHeaderFooter = isAdminRoute || isCustomerRoute || isAuthRoute

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased bg-black text-white`}>
        <GoogleTagManager />
        
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <StructuredData />
        {!hideHeaderFooter && <Header />}
        {children}
        {!hideHeaderFooter && <Footer />}
      </body>
    </html>
  )
}