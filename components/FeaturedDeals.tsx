import React from 'react';
import Button from './Button';
import Image from 'next/image';
import { deals } from '@/constants';

interface Deal {
  id: number;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}



const FeaturedDeals = () => {
  return (
    <section className=" mx-auto px-4 py-12 my-16">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        Special Offers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-neutral rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <Image
              src={deal.image}
              alt={deal.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-extrabold text-bg-primary mb-2">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-800 mb-4">{deal.description}</p>
              <Button variant="primary" href={deal.ctaLink}>
                {deal.ctaText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDeals;