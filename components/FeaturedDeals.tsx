'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { deals } from '@/constants';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedDeals = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Limited Time
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Special Offers
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Image with gradient overlay */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={deal.image}
                alt={deal.title}
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content overlaid on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-1.5">
                  {deal.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-2">
                  {deal.description}
                </p>
                <Link
                  href={deal.ctaLink}
                  className="inline-block px-5 py-2 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-secondary hover:text-white transition-all duration-200"
                >
                  {deal.ctaText}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDeals;
