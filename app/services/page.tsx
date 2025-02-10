'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import CTABanner from '@/components/CTABanner';
import Image from 'next/image';
import { carrental, chauffeur, corporate, event } from '@/public/assets';
import Button from '@/components/Button';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function OurServices() {
  const searchParams = useSearchParams();
  const selectedService = searchParams.get('service');

  return (
    <section className="container mx-auto py-12 my-16">
      {/* Centered Header */}
      <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] rounded-lg p-8 text-white mb-12">
        <motion.h2
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Services
        </motion.h2>
        <p className="text-lg leading-8">See our wide range of services below</p>
      </div>

      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image src={carrental} alt="Car Rentals" className="rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Car Rentals</h2>
          <p className="text-lg leading-8 mb-4">
            Our car rental service offers a variety of vehicles to cater to different needs, 
            whether you require a compact car for city drives, a spacious SUV for family road trips, 
            or a luxury car for a stylish experience. We provide flexible rental periods, competitive pricing, 
            and 24/7 customer support to ensure a smooth experience.
          </p>
          <Button variant="primary" href="/cars">
            Reserve Now
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image src={chauffeur} alt="Chauffeur Services" className="rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Chauffeur Services</h2>
          <p className="text-lg leading-8 mb-4">
            Experience ultimate comfort with our professional chauffeur services. Whether you need a reliable 
            ride for corporate meetings, airport transfers, or a luxury vehicle for a special event, our skilled 
            drivers ensure a hassle-free, timely, and comfortable journey. Choose from a fleet of high-end 
            vehicles driven by expert chauffeurs committed to customer satisfaction.
          </p>
          <Button variant="primary" href="/services/chauffeur-services?service=chauffeur-services">
            Reserve Now
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image src={event} alt="Event Rentals" className="rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Event Rentals</h2>
          <p className="text-lg leading-8 mb-4">
            Elevate your special occasion with our exclusive event car rentals. Whether it’s a wedding, 
            prom, gala, or corporate gathering, we provide luxury vehicles that leave a lasting impression. 
            Choose from elegant limousines, sports cars, or classic vintage models to match the theme of your event. 
            Our chauffeurs ensure you arrive in style and comfort.
          </p>
          <Button variant="primary" href="/services/event-rentals?service=event-rentals">
            Reserve Now
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image src={corporate} alt="Corporate Services" className="rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Corporate Services</h2>
          <p className="text-lg leading-8 mb-4">
            Enhance your business operations with our tailored corporate transportation solutions. 
            Whether you need executive travel, VIP client pickups, or regular employee commutes, 
            we offer premium vehicles and professional drivers to ensure a smooth and prestigious 
            travel experience. Our services are designed to maintain professionalism and efficiency 
            for busy executives and companies.
          </p>
          <Button variant="primary" href="/services/corporate-services?service=corporate-services">
            Reserve Now
          </Button>
        </div>
      </motion.div>

      <CTABanner />
    </section>
  );
}
