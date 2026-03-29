'use client';

import { partners } from '@/constants';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const Partners = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Trusted Partnerships
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Our Partners
        </h2>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-12 md:gap-20">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            variants={fadeIn}
            className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Image
              src={partner.logo}
              alt={`Partner ${partner.id}`}
              width={partner.width}
              height={partner.height}
              className={`object-contain h-full ${partner.size === 'small' ? 'w-[75%]' : 'w-full'}`}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
