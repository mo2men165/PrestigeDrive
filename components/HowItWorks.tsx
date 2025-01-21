'use client';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarCheck, FaCar } from 'react-icons/fa';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    id: 1,
    icon: <FaSearch className="text-4xl text-blue-600 mb-4" />,
    title: 'Search',
    description: 'Find the perfect car for your needs.',
  },
  {
    id: 2,
    icon: <FaCalendarCheck className="text-4xl text-blue-600 mb-4" />,
    title: 'Book',
    description: 'Select your dates and confirm your booking.',
  },
  {
    id: 3,
    icon: <FaCar className="text-4xl text-blue-600 mb-4" />,
    title: 'Drive',
    description: 'Pick up your car and hit the road!',
  },
];

const HowItWorks = () => {
  const cardVariants = {
    hidden: { opacity: 0, x: -100 }, // Start from the left
    visible: { opacity: 1, x: 0 }, // Move to the original position
  };

  return (
    <section className="mx-auto px-4 py-12 my-16">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="bg-neutral rounded-lg shadow-lg p-6 text-center transition-transform hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: index * 0.5 }} // Increased delay
          >
            {step.icon}
            <h3 className="text-xl font-bold  mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;