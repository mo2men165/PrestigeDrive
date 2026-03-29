import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'EliteDrive4U — Premium Car Rentals & Chauffeur Services in Brighton',
  description:
    'Hire luxury cars at affordable prices across the UK & Ireland. SUVs, sedans, electric vehicles and professional chauffeur services. Book online with EliteDrive4U.',
  alternates: { canonical: 'https://elitedrive4u.co.uk' },
};
import Hero from '@/components/Hero';
import Featured from '@/components/Featured';
import FeaturedDeals from '@/components/FeaturedDeals';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import BlogPreview from '@/components/BlogPreview';
import HowItWorks from '@/components/HowItWorks';
import PopularCategories from '@/components/PopularCategories';
import CTABanner from '@/components/CTABanner';
import FAQ from '@/components/FAQ';
import Partners from '@/components/Partners';
import AboutSection from '@/components/AboutSection';

export default function Home() {
  return (
    <>
      <SearchBar />
      <Hero />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutSection />
        <Featured />
        <FeaturedDeals />
        <CTABanner />
        <WhyChooseUs />
        <HowItWorks />
        <PopularCategories />
        <FAQ />
        <Testimonials />
        <Partners />
        <BlogPreview />
      </div>
    </>
  );
}