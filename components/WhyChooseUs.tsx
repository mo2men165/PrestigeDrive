'use client';

import { features } from '@/constants';
import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const WhyChooseUs = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          The EliteDrive4U Difference
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Why Choose Us
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className="group bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors duration-300">
              <span className="text-3xl text-primary">
                {React.createElement(feature.icon)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
