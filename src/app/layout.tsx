import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { headers } from "next/headers";
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: "Iconic Limos & Rentals",
  description: "Luxury transportation in the Greater Toronto Area",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className="antialiased">
        {/* Only show Header and Footer on non-admin pages */}
        {!isAdminPage && <Header />}
        {children}
        {!isAdminPage && <Footer />}
        <Analytics />
      </body>
    </html>
  );
}