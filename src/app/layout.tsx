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

const SITE_URL = 'https://paramnesia-pitwall.vercel.app';

export const metadata: Metadata = {
  title: 'PARAMNESIA PITWALL',
  description:
    'Your motorsport command center — live events, countdowns, streams, standings, and results for F1, MotoGP, WEC, WRC, IMSA, DTM and more.',
  manifest: '/manifest.json',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/icon-192-v2.png',
    apple: '/icon-192-v2.png',
  },
  openGraph: {
    title: 'PARAMNESIA PITWALL',
    description: 'Motorsport command center — F1, MotoGP, WEC, WRC, IMSA, DTM. Live countdowns, standings, results & news.',
    type: 'website',
    url: SITE_URL,
    siteName: 'PARAMNESIA PITWALL',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PARAMNESIA PITWALL — Motorsport Command Center',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PARAMNESIA PITWALL',
    description: 'Motorsport command center — F1, MotoGP, WEC, WRC, IMSA, DTM. Live countdowns, standings, results & news.',
    images: ['/og-image.png'],
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
