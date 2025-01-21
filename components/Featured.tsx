import { carsData } from '@/constants';
import React from 'react';
import Card from './Card';

const Featured = () => {
  return (
    <>
<section className='my-16'>
<h2 className="text-4xl font-sans font-bold text-center uppercase mt-12 mb-6">
        Our most popular cars
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {carsData.slice(0, 3).map((car) => (
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
        ))}
      </div>
</section>
    </>
  );
};

export default Featured;