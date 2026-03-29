'use client';

import { motion } from 'framer-motion';
import { FaSearch, FaCalendarCheck, FaCar } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    icon: FaSearch,
    title: 'Search',
    description: 'Browse our curated fleet and find the perfect vehicle for your journey.',
  },
  {
    id: 2,
    icon: FaCalendarCheck,
    title: 'Book',
    description: 'Choose your dates, select your protection plan, and confirm in minutes.',
  },
  {
    id: 3,
    icon: FaCar,
    title: 'Drive',
    description: 'Collect your vehicle — or let our chauffeur come to you — and enjoy the ride.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const HowItWorks = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Simple Process
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          How It Works
        </h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gray-200" />

        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative flex flex-col items-center text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg">
              <step.icon className="text-white text-2xl" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center shadow">
                {step.id}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
