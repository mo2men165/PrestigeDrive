import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-end">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero.jpg')" }}
      ></div>

      {/* Overlay with Reduced Opacity */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container with Subtle Gold Background */}
      <div className="relative w-full bg-primary py-12">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-text mb-4">
            Drive in Luxury, Arrive in Style
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-4">
          Discover premium car rentals with professional chauffeur services.
          </p>
        </div>
      </div>
    </section>
  );
}