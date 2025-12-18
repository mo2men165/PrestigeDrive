'use client';

import React, { Suspense } from 'react';
import Button from './Button';
import Image, { StaticImageData } from 'next/image';
import { useSearchParams } from 'next/navigation';

export interface CardProps {
  image: string | StaticImageData;
  title: string;
  features: string[];
  type: string;
  fuelType: string;
  transmission: string;
  id: string;
  price?: number;
}

export default function Card(props: CardProps) {
  return (
    <Suspense fallback={<LoadingCard />}>
      <CardContent {...props} />
    </Suspense>
  );
}

function CardContent({
  image,
  title,
  features,
  type,
  fuelType,
  transmission,
  id,
}: CardProps) {
  const searchParams = useSearchParams();

  return (
    <div className="bg-neutral rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>

        {/* Additional Details */}
        <div className="space-y-2 text-sm text-black mb-4">
          <div className="flex justify-between">
            <span>
              <strong>Type:</strong> {type}
            </span>
            <span>
              <strong>Fuel:</strong> {fuelType}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              <strong>Transmission:</strong> {transmission}
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="text-sm text-black mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>•</span> {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-start gap-8">
          <Button variant="primary" href={`/booking/${id}?${searchParams.toString()}`}>
            Reserve Now
          </Button>
          <Button variant="secondary" href={`/cars/${id}`}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

// Placeholder while Suspense is loading
function LoadingCard() {
  return (
    <div className="bg-neutral rounded-lg shadow-lg p-4 animate-pulse">
      <div className="h-48 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 my-4 w-3/4"></div>
      <div className="h-4 bg-gray-300 w-1/2"></div>
    </div>
  );
}