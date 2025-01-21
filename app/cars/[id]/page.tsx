'use client';

import { carsData } from '@/constants';
import Image, { StaticImageData } from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Car {
  id: string; // id is a string
  image: string | StaticImageData;
  title: string;
  price: number;
  features: string[];
  type: string;
  fuelType: string;
  mileage: string;
  year: number;
  transmission: string;
  availability: string[];
}

export default function CarDetailsPage() {
  const { id } = useParams(); // id: string | string[] | undefined
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  console.log('ID from URL:', id, 'Type:', typeof id); // Debugging
  console.log('Cars Data:', carsData); // Debugging

  useEffect(() => {
    if (id) {
      // Ensure id is a string (not an array)
      const carId = Array.isArray(id) ? id[0] : id;
      const foundCar = carsData.find((car) => car.id === carId);
      if (foundCar) {
        setCar(foundCar);
      } else {
        router.push('/404'); // Redirect to a 404 page
      }
    }
  }, [id, router]);

  // If car data isn't found
  if (!car) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-semibold">Car details not found.</h1>
        <p className="text-lg mt-4">The car with ID {id} does not exist.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-12 my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="relative w-full h-80 bg-gray-300 rounded-xl overflow-hidden">
          <Image
            src={car.image}
            alt={car.title}
            width={800} // Set appropriate width
            height={600} // Set appropriate height
            className="object-cover w-full h-full"
          />
        </div>

        {/* Car Details */}
        <div>
          <h1 className="text-4xl font-semibold">{car.title}</h1>
          {/* <p className="text-lg mt-4">{car.description}</p> */}
          <p className="text-xl font-bold mt-6">£{car.price} / day</p>

          {/* Display Features */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="list-disc list-inside mt-2">
              {car.features.map((feature, index) => (
                <li key={index} className="text-lg">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Details */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Details</h2>
            <p className="text-lg mt-2">Type: {car.type}</p>
            <p className="text-lg mt-2">Fuel Type: {car.fuelType}</p>
            <p className="text-lg mt-2">Mileage: {car.mileage}</p>
            <p className="text-lg mt-2">Year: {car.year}</p>
            <p className="text-lg mt-2">Transmission: {car.transmission}</p>
          </div>

          {/* Book Now Button */}
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