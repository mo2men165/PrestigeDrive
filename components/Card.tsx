import React from 'react';
import Button from './Button';
import Image, { StaticImageData } from 'next/image';

interface CardProps {
  image: string | StaticImageData;
  title: string;
  price: Number | string;
  features: string[];
  type: string;
  fuelType: string;
  mileage: string;
  year: number;
  transmission: string;
  href: string;
  id: string;
}

export default function Card({
  image,
  title,
  price,
  features,
  type,
  fuelType,
  mileage,
  year,
  transmission,
  href,
  id
}: CardProps) {
  return (
    <div className="bg-neutral rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-secondary mb-2">{title}</h2>
        <p className="text-lg font-semibold text-gray-500 mb-4"> From  £{price.toString()} /day</p>

        {/* Additional Details */}
        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div className="flex justify-between">
            <span><strong>Type:</strong> {type}</span>
            <span><strong>Fuel:</strong> {fuelType}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Mileage:</strong> {mileage}</span>
            <span><strong>Year:</strong> {year}</span>
          </div>
          <div className="flex justify-between">
            <span><strong>Transmission:</strong> {transmission}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="text-sm text-gray-400 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>•</span> {feature}
            </li>
          ))}
        </ul>

        {/* Button */}
        <Button variant="primary" href={`/cars/${id}`}>
          View Details
        </Button>
      </div>
    </div>
  );
}