'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { carsData } from '@/constants';


export default function BookingPage() {
  const { carId } = useParams(); // Use useParams to get dynamic segment
  const router = useRouter();
  const car = carsData[carId as keyof typeof carsData];

  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [chauffeurService, setChauffeurService] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupDate || !dropoffDate) {
      toast.error('Please select both pickup and drop-off dates.');
      return;
    }

    // toast.success(
    //   `Booking confirmed for ${car.title} from ${pickupDate} to ${dropoffDate}${
    //     chauffeurService ? ' with chauffeur service' : ''
    //   }.`
    // );

    // Example: Redirect to confirmation or another page
    router.push('/confirmation');
  };

  // If car is not found
  if (!car) {
    return <p>Car not found.</p>;
  }

  return ( 
    <section className="container mx-auto py-12 my-16">
      <div className="flex flex-col gap-8">
        {/* <h2 className="text-3xl font-semibold">Book Your {car.title}</h2> */}
        {/* <p className="text-lg">{car.description}</p> */}
        {/* <p className="text-xl font-bold">£`{car.price}` / day</p> */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Date */}
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium">
              Pickup Date
            </label>
            <input
              type="date"
              id="pickupDate"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Dropoff Date */}
          <div>
            <label htmlFor="dropoffDate" className="block text-sm font-medium">
              Dropoff Date
            </label>
            <input
              type="date"
              id="dropoffDate"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Chauffeur Service */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="chauffeurService"
              checked={chauffeurService}
              onChange={(e) => setChauffeurService(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="chauffeurService" className="text-sm">
              Add Chauffeur Service (£50)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}
