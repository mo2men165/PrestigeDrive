'use client';

import React from 'react';
import Image from 'next/image';
import { aboutus } from '@/public/assets';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCar, FaUserTie, FaStar, FaShieldAlt } from 'react-icons/fa';

const stats = [
  { value: '500+', label: 'Vehicles in Fleet' },
  { value: '10K+', label: 'Happy Clients' },
  { value: '24/7', label: 'Customer Support' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const pillars = [
  {
    icon: FaCar,
    title: 'Premium Fleet',
    description: 'From executive sedans to luxury SUVs and electric vehicles — every car meticulously maintained.',
  },
  {
    icon: FaUserTie,
    title: 'Chauffeur Service',
    description: 'Request a professional chauffeur for a seamless, first-class travel experience.',
  },
  {
    icon: FaStar,
    title: 'Exceptional Value',
    description: 'Luxury-tier vehicles at competitive prices — premium doesn\'t have to mean expensive.',
  },
  {
    icon: FaShieldAlt,
    title: 'Total Peace of Mind',
    description: 'Comprehensive insurance options and roadside assistance on every rental.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  return (
    <section className="py-12">
      {/* Top: Image + Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          className="relative hidden lg:block"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={aboutus}
              alt="EliteDrive4U luxury vehicle"
              width={640}
              height={480}
              className="object-cover w-full h-[480px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E253F]/60 via-transparent to-transparent" />
          </div>
          {/* Floating accent card */}
          <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-5 border border-gray-100">
            <p className="text-3xl font-bold text-primary">5+</p>
            <p className="text-sm text-gray-500 font-medium">Years of Excellence</p>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            About EliteDrive4U
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Redefining Luxury<br />
            <span className="text-primary">Car Rentals</span>
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mb-8" />

          <p className="text-lg text-gray-600 leading-relaxed mb-5">
            Based in Brighton and serving Sussex, <strong className="text-gray-800">EliteDrive4U</strong> makes premium motoring accessible to everyone. We combine a handpicked fleet of luxury vehicles with white-glove service — all at prices that won&apos;t break the bank.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            What sets us apart is our <strong className="text-gray-800">bespoke chauffeur service</strong> — request a professional driver to accompany your rental for the ultimate in comfort and convenience. Every journey with us is designed to be as memorable as your destination.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              Explore Our Services
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition"
            >
              View Our Fleet
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Pillars */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <pillar.icon className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{pillar.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
