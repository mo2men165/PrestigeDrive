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

  const { isLoading, setLoading } = useRentalData();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const q = query(collection(db, 'cars'));
        const querySnapshot = await getDocs(q);
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
  
        setCars(carsList);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCars();
  }, []);
  

  const handleFilterChange = (key: string, value: any) => {
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
      <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] rounded-lg p-8 text-white mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Fleet</h2>
        <p className="text-lg leading-8">
          If it's luxury vehicles, SUVs or electric vehicles that you're looking for, we got it all right here.
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 p-4 bg-neutral rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium mb-2">Transmission</label>
            <select
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="All">All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="All">All</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="All">All</option>
              {uniqueFuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Car Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 my-10">
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
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No cars found matching your criteria.</p>
        )}
      </div>
    </section>
  );
}
