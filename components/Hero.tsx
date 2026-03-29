'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center justify-center overflow-hidden" style={{ marginTop: 'calc(var(--navbar-height, 80px) * -1)' }}>
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/assets/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0E253F]/90" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.p
          className="text-sm md:text-base uppercase tracking-[0.3em] text-white/70 font-medium mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Premium Car Rentals &amp; Chauffeur Services
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Drive in Luxury.
          <br />
          <span className="text-secondary">Arrive in Style.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Handpicked luxury vehicles. Professional chauffeurs. Competitive prices.
          Experience motoring at its finest across the UK &amp; Ireland.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/cars"
            className="px-10 py-4 bg-white text-primary font-semibold rounded-lg text-lg hover:bg-secondary hover:text-white transition-all duration-300"
          >
            Explore Our Fleet
          </Link>
          <Link
            href="/services"
            className="px-10 py-4 border-2 border-white/40 text-white font-semibold rounded-lg text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Our Services
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
