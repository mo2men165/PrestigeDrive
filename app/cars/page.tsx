'use client';

import React, { useState } from 'react';
import Card from '@/components/Card';
import { carsData } from '@/constants';

export default function CarsPage() {
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    transmission: 'All',
    feature: '',
    type: 'All',
    fuelType: 'All',
    year: 'All',
    sortBy: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredCars = carsData
    .filter((car) => car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1])
    .filter((car) => (filters.transmission === 'All' ? true : car.transmission === filters.transmission))
    .filter((car) => (filters.feature ? car.features.includes(filters.feature) : true))
    .filter((car) => (filters.type === 'All' ? true : car.type === filters.type))
    .filter((car) => (filters.fuelType === 'All' ? true : car.fuelType === filters.fuelType))
    .filter((car) => (filters.year === 'All' ? true : car.year.toString() === filters.year))
    .sort((a, b) => {
      if (filters.sortBy === 'priceLowToHigh') return a.price - b.price;
      if (filters.sortBy === 'priceHighToLow') return b.price - a.price;
      if (filters.sortBy === 'nameAZ') return a.title.localeCompare(b.title);
      if (filters.sortBy === 'nameZA') return b.title.localeCompare(a.title);
      return 0;
    });

  // Extract unique values for type, fuelType, and year for dropdown options
  const uniqueTypes = [...new Set(carsData.map((car) => car.type))];
  const uniqueFuelTypes = [...new Set(carsData.map((car) => car.fuelType))];
  const uniqueYears = [...new Set(carsData.map((car) => car.year.toString()))].sort((a:any, b:any) => b - a);

  return (
    <section className="container mx-auto py-12">
      {/* Filters */}
      <div className="mb-8 p-4 bg-neutral rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Price Range (£)</label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, +e.target.value])}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Up to £{filters.priceRange[1]}</p>
          </div>

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

          {/* Feature */}
          <div>
            <label className="block text-sm font-medium mb-2">Feature</label>
            <select
              value={filters.feature}
              onChange={(e) => handleFilterChange('feature', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">All</option>
              <option value="Chauffeur Service Available">Chauffeur Service</option>
              <option value="GPS">GPS</option>
              <option value="Luxury Interior">Luxury Interior</option>
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

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="All">All</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">None</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A-Z</option>
              <option value="nameZA">Name: Z-A</option>
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
              price={car.price}
              features={car.features}
              type={car.type}
              fuelType={car.fuelType}
              mileage={car.mileage}
              year={car.year}
              transmission={car.transmission}
              href={car.href}
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