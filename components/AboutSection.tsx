import React from 'react';
import Image from 'next/image';
import { aboutus, logo, pd } from '@/public/assets';
import Button from './Button';

const AboutSection = () => {
  return (
    <section className="mx-auto px-4 py-20 my-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image Column */}
        <div className="order-1 p-20 md:order-none lg:block hidden">
          <Image
            src={aboutus}
            alt="About Us"
            width={600}
            height={600}
            className="rounded-lg shadow-lg "
          />
        </div>

        {/* Text Column */}
        <div className="w-[100%] text-center">
        <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] rounded-lg p-8 text-text mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
      </div>  
          <p className="text-lg my-6 text-gray-800">
            At <strong>MyEasyDrive</strong>, we are passionate about bringing luxury within reach. Based in London and serving the UK and Ireland, we specialise in providing premium car rentals at economical prices, ensuring that everyone can experience the thrill of driving a high-end vehicle.
          </p>
          <p className="text-lg my-6 text-gray-800">
            Whether you're looking for a sleek sedan, a powerful SUV, or an eco-friendly electric car, our diverse fleet has the perfect match for every occasion. What sets us apart is our <strong>unique chauffeur service</strong>, where you can request a professional chauffeur to accompany you during your rental period, offering a seamless and luxurious travel experience.
          </p>
          <p className="text-lg my-6 text-gray-800">
            Our mission is simple: to make luxury car rentals <strong>accessible, affordable, and stress-free</strong>. With competitive pricing, exceptional customer service, and a commitment to excellence, we ensure that every journey with MyEasyDrive is as memorable as your destination.
          </p>
          <Button variant="primary" href="/services">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;