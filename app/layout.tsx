// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { RentalProvider } from './contexts/RentalContext';
import PrivacyPolicyBar from '@/components/PrivacyPolicyBar';
import ChatButton from '@/components/ChatButton';

export const metadata = {
  title: 'Prestige Drive',
  description: 'Your one stop shop for luxury car rentals and chauffeur services.',
  icons: {
    icon: "/favicon.png", // Default favicon
    shortcut: "/favicon.png", // Shortcut icon
    apple: "/favicon.png", // Apple touch icon (optional)
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;600&family=Raleway:wght@400;500&family=Montserrat:wght@400;500&family=Lato:wght@400;700&family=Cormorant:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Bodoni+Moda:wght@400;700&family=Abril+Fatface&family=Cinzel:wght@400;700&family=Oswald:wght@400;500&family=Great+Vibes&family=Dancing+Script:wght@400;700&family=Parisienne&display=swap" rel="stylesheet"/>
      </head>

      <body id='root' className="flex flex-col min-h-screen">
        <RentalProvider> {/* Wrap the entire app with RentalProvider */}
          <Navbar />
          <main className="flex-grow">{children}</main>
          <ChatButton />
          <PrivacyPolicyBar />
          <Footer />
        </RentalProvider>
      </body>
    </html>
  );
}