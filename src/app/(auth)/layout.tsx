import type { Metadata } from 'next';
import '../globals.css'; // Import styles

export const metadata: Metadata = {
  title: 'Login - Iconic Limos',
  description: 'Admin and customer login',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}