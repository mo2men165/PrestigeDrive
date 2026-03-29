import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Fleet — Luxury Cars, SUVs & Electric Vehicles',
  description:
    'Browse the EliteDrive4U fleet of premium vehicles. Luxury sedans, powerful SUVs, and eco-friendly electric cars available for hire across the UK.',
  alternates: { canonical: 'https://elitedrive4u.co.uk/cars' },
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
