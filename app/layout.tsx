// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Car Rental Website',
  description: 'Rent cars quickly and easily!',
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

      <body className="flex flex-col min-h-screen">
        
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
