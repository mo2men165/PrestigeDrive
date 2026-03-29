'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCar, FaGasPump, FaCogs, FaMapMarkerAlt, FaChargingStation, FaSnowflake, FaSun, FaUsers, FaRoad } from 'react-icons/fa';
import Image from 'next/image';
import Button from '@/components/Button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Car } from '@/types/types';

export default function CarDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const carId = Array.isArray(id) ? id[0] : id;
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const carData = { id: docSnap.id, ...docSnap.data() } as Car;
          setCar(carData);
          setSelectedImage(carData.image);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, router]);

  if (!car) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-semibold">Car details not found.</h1>
        <p className="text-lg mt-4 text-gray-500">The car with ID {id} does not exist.</p>
      </div>
    );
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('GPS')) return <FaMapMarkerAlt />;
    if (feature.includes('Chauffeur')) return <FaChargingStation />;
    if (feature.includes('Luxury')) return <FaSun />;
    if (feature.includes('Heated')) return <FaSnowflake />;
    if (feature.includes('Automatic')) return <FaCogs />;
    return <FaCar />;
  };

  return (
    <section className="container mx-auto py-12 my-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="relative w-full h-96 bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Image
              src={selectedImage}
              alt={car.title}
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-6">
            <Button href={`/booking/${id}`} variant="primary" className="w-full py-3.5 text-base">
              Reserve This Vehicle
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#0E253F] to-[#1B365D] rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-3">{car.title}</h1>
            <p className="text-white/70 leading-relaxed">{car.description}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FaCar className="text-primary text-xs" />
                </div>
                <span className="text-gray-600"><span className="font-medium text-gray-900">Type:</span> {car.type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FaGasPump className="text-primary text-xs" />
                </div>
                <span className="text-gray-600"><span className="font-medium text-gray-900">Fuel:</span> {car.fuelType}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FaCogs className="text-primary text-xs" />
                </div>
                <span className="text-gray-600"><span className="font-medium text-gray-900">Transmission:</span> {car.transmission}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FaUsers className="text-primary text-xs" />
                </div>
                <span className="text-gray-600"><span className="font-medium text-gray-900">Seats:</span> {car.features.includes('4 Seats') ? '4' : '5'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm col-span-2">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FaRoad className="text-primary text-xs" />
                </div>
                <span className="text-gray-600"><span className="font-medium text-gray-900">Drivetrain:</span> {car.features.includes('All-Wheel Drive') ? 'AWD' : 'FWD'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-primary text-xs">{getFeatureIcon(feature)}</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
