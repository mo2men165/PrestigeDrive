'use client';

import Button from '@/components/Button';
import { carsData } from '@/constants';
import Image, { StaticImageData } from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCar, FaGasPump, FaCalendarAlt, FaCogs, FaMapMarkerAlt, FaChargingStation, FaSnowflake, FaSun, FaTachometerAlt, FaUsers, FaRoad } from 'react-icons/fa';

interface Car {
  id: string | Number;
  image: string | StaticImageData;
  title: string;
  features: string[];
  type: string;
  fuelType: string;
  transmission: string;
  availability: string[];
  description: string; // Added description field
}

export default function CarDetailsPage() {
  const { id } = useParams(); // id: string | string[] | undefined
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | StaticImageData>('');

  useEffect(() => {
    if (id) {
      // Ensure id is a string (not an array)
      const carId = Array.isArray(id) ? id[0] : id;
      const foundCar = carsData.find((car) => car.id === carId);
      if (foundCar) {
        setCar(foundCar);
        setSelectedImage(foundCar.image); // Set the initial selected image
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Car Image and Carousel */}
        <div>
          {/* Main Image */}
          <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-lg">
            <Image
              src={selectedImage}
              alt={car.title}
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-8 justify-center flex space-x-4">
            <Button
              href={`/booking/${id}`}
              variant='primary'
              className='w-[100%]'
            >
              Reserve Now
            </Button>
          </div>
        </div>


        {/* Car Details */}
        <div className="space-y-8">
          {/* Title */}
          <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] rounded-lg p-8 text-white mb-12">
        <h1 className="text-4xl font-bold mb-4">{car.title}</h1>
        <p className="text-lg leading-8">
          {car.description}
        </p>
      </div> 
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-primary mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-primary">
                    {feature.includes('GPS') && <FaMapMarkerAlt />}
                    {feature.includes('Chauffeur') && <FaChargingStation />}
                    {feature.includes('Luxury') && <FaSun />}
                    {feature.includes('Heated') && <FaSnowflake />}
                    {feature.includes('Automatic') && <FaCogs />}
                  </span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-primary mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCar className="text-primary" />
                <span className="text-gray-700">Type: {car.type}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaGasPump className="text-primary" />
                <span className="text-gray-700">Fuel Type: {car.fuelType}</span>
              </div>

              <div className="flex items-center space-x-3">
                <FaCogs className="text-primary" />
                <span className="text-gray-700">Transmission: {car.transmission}</span>
              </div>

              <div className="flex items-center space-x-3">
                <FaUsers className="text-primary" />
                <span className="text-gray-700">Seats: {car.features.includes('4 Seats') ? '4' : '5'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaRoad className="text-primary" />
                <span className="text-gray-700">Drivetrain: {car.features.includes('All-Wheel Drive') ? 'AWD' : 'FWD'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}