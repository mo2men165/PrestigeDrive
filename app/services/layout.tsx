import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — Car Rentals, Chauffeurs, Events & Corporate',
  description:
    'Explore EliteDrive4U services: self-drive car rentals, professional chauffeur hire, wedding and event vehicles, and corporate transportation solutions.',
  alternates: { canonical: 'https://elitedrive4u.co.uk/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
