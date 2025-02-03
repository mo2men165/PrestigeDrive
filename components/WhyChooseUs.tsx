'use client';

import { features } from '@/constants';
import React, { useState, useEffect } from 'react';

// interface Feature {
//   id: number;
//   icon: string;
//   title: string;
//   description: string;
// }

const WhyChooseUs = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Function to check screen size and update state
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < 1024); // 768px is the breakpoint for 'md' in Tailwind
  };

  // Add event listener for window resize
  useEffect(() => {
    checkScreenSize(); // Check on initial render
    window.addEventListener('resize', checkScreenSize); // Update on resize

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="mx-auto px-4 py-12 my-16">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-12 text-primary">
        Why Choose Us?
      </h2>

      {/* Mobile Layout: 4 cards stacked vertically */}
      {isMobile ? (
        <div className="space-y-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-xl p-8 text-center transition-transform hover:scale-105"
              style={{
                backgroundColor:
                  feature.id === 1
                    ? "#F0F4FF" // Light blue
                    : feature.id === 2
                    ? "#FFF7F0" // Light orange
                    : feature.id === 3
                    ? "#F0FFF4" // Light green
                    : "#F5F0FF", // Light purple
              }}
            >
              <div className="text-5xl mb-6 text-blue-600">
                {React.createElement(feature.icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-md text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Top Row: Two horizontal cards */}
          <div className="md:col-span-1 lg:col-span-1">
            <div
              className="bg-white rounded-lg shadow-xl p-8 text-center transition-transform hover:scale-105"
              style={{ backgroundColor: "#F0F4FF" }} // Light blue
            >
              <div className="text-5xl mb-6 text-blue-600">
                {React.createElement(features[0].icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {features[0].title}
              </h3>
              <p className="text-md text-gray-600">{features[0].description}</p>
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-1 md:translate-y-12">
            <div
              className="bg-white rounded-lg shadow-xl p-8 text-center transition-transform hover:scale-105"
              style={{ backgroundColor: "#FFF7F0" }} // Light orange
            >
              <div className="text-5xl mb-6 text-blue-600">
                {React.createElement(features[1].icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {features[1].title}
              </h3>
              <p className="text-md text-gray-600">{features[1].description}</p>
            </div>
          </div>

          {/* Bottom Row: One wide horizontal card */}
          <div className="md:col-span-2 lg:col-span-2">
            <div
              className="bg-white rounded-lg shadow-xl p-8 text-center transition-transform hover:scale-105"
              style={{ backgroundColor: "#F0FFF4" }} // Light green
            >
              <div className="text-5xl mb-6 text-blue-600">
                {React.createElement(features[2].icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {features[2].title}
              </h3>
              <p className="text-md text-gray-600">{features[2].description}</p>
            </div>
          </div>

          {/* Vertical Card: Extends between the two rows */}
          <div className="md:col-span-1 lg:col-span-1 absolute right-0 top-0 bottom-0 w-full md:w-auto lg:w-1/3">
            <div
              className="bg-white rounded-lg shadow-xl p-8 text-center transition-transform hover:scale-105 h-full"
              style={{ backgroundColor: "#F5F0FF" }} // Light purple
            >
              <div className="text-5xl mb-6 text-blue-600">
                {React.createElement(features[3].icon)}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {features[3].title}
              </h3>
              <p className="text-md text-gray-600">{features[3].description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhyChooseUs;