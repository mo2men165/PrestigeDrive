import SearchBar from '@/components/SearchBar';
import Hero from '@/components/Hero';
import Featured from '@/components/Featured';
import FeaturedDeals from '@/components/FeaturedDeals';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import Blog from './blog/page';
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
      <div className="container mx-auto py-6">
        <AboutSection />  
        <Featured />
        <FeaturedDeals />
        <CTABanner />
        <WhyChooseUs />
        <Partners />
        <HowItWorks />
        <PopularCategories />
        <FAQ />
        <Testimonials />
        <Blog />
      </div>
    </>
  );
}