import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Driving Tips, Car Rental Guides & Travel Advice',
  description:
    'Read the latest articles from EliteDrive4U covering UK driving laws, car rental insurance, travel tips, scenic drives near Brighton, and more.',
  alternates: { canonical: 'https://elitedrive4u.co.uk/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
