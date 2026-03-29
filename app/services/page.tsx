'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { carrental, chauffeur, corporate, event } from '@/public/assets';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const servicesList = [
  {
    title: 'Car Rentals',
    image: carrental,
    alt: 'Car Rentals',
    description:
      'Our car rental service offers a variety of vehicles to cater to different needs, whether you require a compact car for city drives, a spacious SUV for family road trips, or a luxury car for a stylish experience. We provide flexible rental periods, competitive pricing, and 24/7 customer support.',
    href: '/cars',
  },
  {
    title: 'Chauffeur Services',
    image: chauffeur,
    alt: 'Chauffeur Services',
    description:
      'Experience ultimate comfort with our professional chauffeur services. Whether you need a reliable ride for corporate meetings, airport transfers, or a luxury vehicle for a special event, our skilled drivers ensure a hassle-free, timely, and comfortable journey.',
    href: '/services/chauffeur-services?service=chauffeur-services',
    reverse: true,
  },
  {
    title: 'Event Rentals',
    image: event,
    alt: 'Event Rentals',
    description:
      'Elevate your special occasion with our exclusive event car rentals. Whether it\u2019s a wedding, prom, gala, or corporate gathering, we provide luxury vehicles that leave a lasting impression. Choose from elegant limousines, sports cars, or classic vintage models.',
    href: '/services/event-rentals?service=event-rentals',
  },
  {
    title: 'Corporate Services',
    image: corporate,
    alt: 'Corporate Services',
    description:
      'Enhance your business operations with our tailored corporate transportation solutions. Whether you need executive travel, VIP client pickups, or regular employee commutes, we offer premium vehicles and professional drivers for a prestigious travel experience.',
    href: '/services/corporate-services?service=corporate-services',
    reverse: true,
  },
];

export default function OurServices() {
  return (
    <section className="container mx-auto py-12 my-16">
      <div className="bg-gradient-to-br from-[#0E253F] to-[#1B365D] rounded-2xl p-10 text-white mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
          What We Offer
        </p>
        <h1 className="text-4xl font-bold mb-3">Our Services</h1>
        <p className="text-white/70 text-lg max-w-xl">
          From premium car rentals to professional chauffeur services — we have you covered.
        </p>
      </div>

      <div className="space-y-24">
        {servicesList.map((service, index) => (
          <motion.div
            key={service.title}
            className={`flex flex-col ${service.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <Image src={service.image} alt={service.alt} className="w-full h-auto object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
              <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>
              <Link
                href={service.href}
                className="inline-block px-8 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Reserve Now
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24">
        <CTABanner />
      </div>
    </section>
  );
}
