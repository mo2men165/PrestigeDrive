import React from 'react';
import Image from 'next/image';
import { logo, pd } from '@/public/assets';
import Button from './Button';

const AboutSection = () => {
  return (
    <section className="mx-auto px-4 py-20 my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image Column */}
        <div className="order-1 p-20 md:order-none">
          <Image
            src={logo}
            alt="About Us"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Text Column */}
        <div className="">
          <h2 className="text-4xl my-6 font-sans font-bold text-secondary">
            About Us
          </h2>
          <p className="text-lg my-6 text-gray-800">
            At <strong>Prestige Drive</strong>, we are passionate about bringing luxury within reach. Based in London and serving the UK and Ireland, we specialize in providing premium car rentals at economical prices, ensuring that everyone can experience the thrill of driving a high-end vehicle.
          </p>
          <p className="text-lg my-6 text-gray-800">
            Whether you're looking for a sleek sedan, a powerful SUV, or an eco-friendly electric car, our diverse fleet has the perfect match for every occasion. What sets us apart is our <strong>unique chauffeur service</strong>, where you can request a professional chauffeur to accompany you during your rental period, offering a seamless and luxurious travel experience.
          </p>
          <p className="text-lg my-6 text-gray-800">
            Our mission is simple: to make luxury car rentals <strong>accessible, affordable, and stress-free</strong>. With competitive pricing, exceptional customer service, and a commitment to excellence, we ensure that every journey with Prestige Drive is as memorable as your destination.
          </p>
          <Button variant="primary" href="/about">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;