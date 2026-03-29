'use client';

import React, { Suspense } from 'react';
import Button from './Button';
import Image, { StaticImageData } from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FaCar, FaGasPump, FaCogs, FaCheckCircle } from 'react-icons/fa';

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
  price,
}: CardProps) {
  const searchParams = useSearchParams();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image with gradient overlay */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {price && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
            <span className="text-xs text-gray-500">From </span>
            <span className="text-lg font-bold text-primary">£{price}</span>
            <span className="text-xs text-gray-500">/day</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2.5 px-1">
            <FaCar className="text-primary text-sm mb-1" />
            <span className="text-[11px] text-gray-500 text-center leading-tight">{type}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2.5 px-1">
            <FaGasPump className="text-primary text-sm mb-1" />
            <span className="text-[11px] text-gray-500 text-center leading-tight">{fuelType}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg py-2.5 px-1">
            <FaCogs className="text-primary text-sm mb-1" />
            <span className="text-[11px] text-gray-500 text-center leading-tight">{transmission}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
          {features.slice(0, 3).map((feature, index) => (
            <span key={index} className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaCheckCircle className="text-secondary text-[10px]" />
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" href={`/booking/${id}?${searchParams.toString()}`} className="flex-1 text-center">
            Reserve Now
          </Button>
          <Button variant="secondary" href={`/cars/${id}`} className="flex-1 text-center">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
      <div className="h-56 bg-gray-100 rounded-xl" />
      <div className="mt-4 h-5 bg-gray-100 rounded w-3/4" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="h-14 bg-gray-100 rounded-lg" />
        <div className="h-14 bg-gray-100 rounded-lg" />
        <div className="h-14 bg-gray-100 rounded-lg" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 bg-gray-100 rounded-lg flex-1" />
        <div className="h-10 bg-gray-100 rounded-lg flex-1" />
      </div>
    </div>
  );
}
