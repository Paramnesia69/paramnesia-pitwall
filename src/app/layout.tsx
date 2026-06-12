import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Orbitron } from 'next/font/google';
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

// Display font for the hero event title only — racy/motorsport feel
const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['700', '800'],
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
  // Required for env(safe-area-inset-*) to be non-zero in standalone PWA mode
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        {/* Status-bar scrim — covers the notch zone in standalone PWA; zero-height on desktop */}
        <div
          aria-hidden
          className="fixed top-0 inset-x-0 pointer-events-none"
          style={{
            height: 'env(safe-area-inset-top)',
            zIndex: 'var(--pw-z-toast)',
            background: 'color-mix(in srgb, var(--pw-bg-primary) 88%, transparent)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        />
        <AmbientBackground />
        <div className="relative flex-1" style={{ zIndex: 'var(--pw-z-cards)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
