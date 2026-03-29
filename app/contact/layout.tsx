import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch with EliteDrive4U',
  description:
    'Contact EliteDrive4U for luxury car rental enquiries, chauffeur bookings, and customer support. Based in Brighton, serving the UK & Ireland.',
  alternates: { canonical: 'https://elitedrive4u.co.uk/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
