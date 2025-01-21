'use client';

import { carsData } from '@/constants';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CarDetailsPage() {
  const { id } = useParams(); // Use useParams to get the dynamic segment
  const router = useRouter();
  const [car, setCar] = useState<any>(null);

  console.log('ID from URL:', id); // Debugging
  console.log('Cars Data:', carsData); // Debugging

  useEffect(() => {
    if (id) {
      const foundCar = carsData.find((car) => car.id === id);
      if (foundCar) {
        setCar(foundCar);
      } else {
        setCar(null); // Handle case where car data isn't found
      }
    }
  }, [id]);

  // If car data isn't found
  if (!car) {
    return <div>Car details not found.</div>;
  }

  return (
    <section className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="relative w-full h-80 bg-gray-300 rounded-xl overflow-hidden">
          <Image src={car.image} alt={car.title} className="object-cover w-full h-full" />
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-4xl font-semibold">{car.title}</h1>
          <p className="text-lg mt-4">{car.description}</p>
          <p className="text-xl font-bold mt-6">£{car.price} / day</p>

          <button
            onClick={() => router.push(`/booking/${id}`)}
            className="mt-8 py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}