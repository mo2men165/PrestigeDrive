import './globals.css';
import { Poppins, Playfair_Display } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PrivacyPolicyBar from '@/components/PrivacyPolicyBar';
import ChatButton from '@/components/ChatButton';
import { Suspense } from 'react';
import { RentalProvider } from './../contexts/RentalContext';
import GlobalLoader from '@/components/GlobalLoader';
import type { Metadata } from 'next';
import { BOOKING_EMAIL, INFO_EMAIL } from '@/constants/emails';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const SITE_URL = 'https://elitedrive4u.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EliteDrive4U — Premium Car Rentals & Chauffeur Services',
    template: '%s | EliteDrive4U',
  },
  description:
    'EliteDrive4U offers luxury car rentals and professional chauffeur services across the UK & Ireland. Premium fleet, competitive prices, 24/7 support. Book your dream car today.',
  keywords: [
    'luxury car rental',
    'car hire UK',
    'chauffeur service Brighton',
    'premium car rental',
    'SUV rental',
    'electric vehicle rental',
    'wedding car hire',
    'corporate car rental',
    'EliteDrive4U',
    'car rental Brighton',
    'long term car hire',
  ],
  authors: [{ name: 'EliteDrive4U' }],
  creator: 'EliteDrive4U',
  publisher: 'EliteDrive4U',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'EliteDrive4U',
    title: 'EliteDrive4U — Premium Car Rentals & Chauffeur Services',
    description:
      'Luxury car rentals and professional chauffeur services across the UK & Ireland. Premium fleet, competitive prices, 24/7 support.',
    images: [
      {
        url: '/assets/newlogonobg.png',
        width: 1200,
        height: 630,
        alt: 'EliteDrive4U — A Car For Everyone',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EliteDrive4U — Premium Car Rentals & Chauffeur Services',
    description:
      'Luxury car rentals and professional chauffeur services across the UK & Ireland.',
    images: ['/assets/newlogonobg.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CarRental',
  name: 'EliteDrive4U',
  description:
    'Premium car rentals and professional chauffeur services across the UK & Ireland.',
  url: SITE_URL,
  telephone: '03333391475',
  email: [INFO_EMAIL, BOOKING_EMAIL],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Citibase Brighton, 95 Ditchling Rd',
    addressLocality: 'Brighton and Hove',
    addressRegion: 'Brighton',
    postalCode: 'BN1 4ST',
    addressCountry: 'GB',
  },
  sameAs: [
    'https://www.facebook.com/share/18NmfMR7Ku/?mibextid=wwXIfr',
  ],
  priceRange: '££',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body id='root' className={`${poppins.variable} ${playfair.variable} font-sans flex flex-col min-h-screen`}>
      <RentalProvider>
        <Suspense fallback={<GlobalLoader />}>
          <Navbar />
          <main className="flex-grow" style={{ paddingTop: 'var(--navbar-height, 80px)' }}>{children}</main>
          <ChatButton />
          <PrivacyPolicyBar />
          <Footer />
        </Suspense>
        </RentalProvider>
      </body>
    </html>
  );
}
