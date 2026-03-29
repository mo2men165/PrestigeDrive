'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/constants';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const PopularCategories = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Browse by Type
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Popular Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="group relative rounded-2xl overflow-hidden h-72 shadow-sm hover:shadow-xl transition-all duration-300"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={category.image}
              alt={category.title}
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">{category.description}</p>
              <Link
                href={category.href}
                className="inline-block text-sm font-semibold text-secondary hover:text-white transition-colors duration-200"
              >
                Explore &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
