import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AmbientBackground from '@/components/AmbientBackground';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PARAMNESIA PITWALL',
  description:
    'Your motorsport command center — live events, countdowns, streams, and standings.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'PARAMNESIA PITWALL',
    description: 'Motorsport command center',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    title: 'PITWALL',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#06060B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <AmbientBackground />
        <div className="relative flex-1" style={{ zIndex: 'var(--pw-z-cards)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
