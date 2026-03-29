'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Card from './Card';
import { useRentalData } from '@/contexts/RentalContext';
import { Car } from '@/types/types';

const Featured = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const { setLoading } = useRentalData();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'cars'));
        const carsList: Car[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];

        setCars(carsList.slice(0, 3));
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [setLoading]);

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Curated Selection
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Our Most Popular Cars
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <Card key={car.id} {...car} />
        ))}
      </div>
    </section>
  );
};

export default Featured;
