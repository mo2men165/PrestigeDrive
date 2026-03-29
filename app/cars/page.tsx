'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Car } from '@/types/types';
import { useRentalData } from '@/contexts/RentalContext';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    transmission: 'All',
    type: 'All',
    fuelType: 'All',
  });

  const { setLoading } = useRentalData();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, 'cars'));
        const querySnapshot = await getDocs(q);
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
        setCars(carsList);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [setLoading]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredCars = cars
    .filter((car) => (filters.transmission === 'All' ? true : car.transmission === filters.transmission))
    .filter((car) => (filters.type === 'All' ? true : car.type === filters.type))
    .filter((car) => (filters.fuelType === 'All' ? true : car.fuelType === filters.fuelType));

  const uniqueTypes = [...new Set(cars.map((car) => car.type))];
  const uniqueFuelTypes = [...new Set(cars.map((car) => car.fuelType))];

  return (
    <section className="container mx-auto py-12 my-16">
      <div className="bg-gradient-to-br from-[#0E253F] to-[#1B365D] rounded-2xl p-10 text-white mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">Browse &amp; Reserve</p>
        <h1 className="text-4xl font-bold mb-3">Our Fleet</h1>
        <p className="text-white/70 text-lg max-w-xl">
          Luxury vehicles, SUVs, electric cars and more — find your perfect ride.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Transmission</label>
            <select
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              <option value="All">All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              <option value="All">All</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              <option value="All">All</option>
              {uniqueFuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>{fuelType}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Car Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <Card
              key={car.id}
              image={car.image}
              title={car.title}
              features={car.features}
              type={car.type}
              fuelType={car.fuelType}
              transmission={car.transmission}
              id={car.id}
              price={car.price}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 py-12">
            No cars found matching your criteria.
          </p>
        )}
      </div>
    </section>
  );
}
