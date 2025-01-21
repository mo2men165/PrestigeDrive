import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      ></div>

      {/* Overlay with Reduced Opacity */}
      <div
        className="absolute inset-0 bg-[#10131A] opacity-70"
      ></div>

      {/* Content */}
      <div className="relative container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-script  text-secondary mb-4">
          Drive in Luxury, Arrive in Style
        </h1>
        <p className="text-lg md:text-2xl font-serif text-white mb-8">
          Experience high-end car rentals with chauffeur options at economical
          prices in Brighton, UK.
        </p>
        <Button variant="primary" href="/cars">
          Explore Our Fleet
        </Button>
      </div>
    </section>
  );
}