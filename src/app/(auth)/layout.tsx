import type { Metadata } from 'next';

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
    <div className="min-h-screen">
      {children}
    </div>
  );
}