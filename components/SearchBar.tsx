"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { carsData } from "@/constants";
import Card from "./Card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StaticImageData } from "next/image";

interface Car {
  id: string;
  image: string | StaticImageData;
  title: string;
  price: number;
  features: string[];
  type: string;
  fuelType: string;
  mileage: string;
  year: number;
  transmission: string;
  href: string;
}

const SearchBar = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [carType, setCarType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [transmission, setTransmission] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSearched, setHasSearched] = useState(false);

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!pickupLocation) newErrors.pickupLocation = "Pickup location is required.";
    if (!dropoffLocation) newErrors.dropoffLocation = "Dropoff location is required.";
    if (!pickupDate) newErrors.pickupDate = "Pickup date is required.";
    if (!dropoffDate) newErrors.dropoffDate = "Dropoff date is required.";
    if (pickupDate && dropoffDate && new Date(dropoffDate) <= new Date(pickupDate)) {
      newErrors.dropoffDate = "Dropoff date must be after the pickup date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const results = carsData.filter((car) => {
        const matchesType = carType ? car.type.toLowerCase() === carType.toLowerCase() : true;
        const matchesPrice = priceRange ? car.price <= parseInt(priceRange, 10) : true;
        const matchesTransmission = transmission ? car.transmission === transmission : true;

        return matchesType && matchesPrice && matchesTransmission;
      });

      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
  };

  // Auto-trigger search when filters change
  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [carType, priceRange, transmission]);

  const getSimilarCars = () => {
    if (searchResults.length === 0 && hasSearched) {
      return carsData
        .filter((car) => {
          const matchesType = carType ? car.type.toLowerCase() === carType.toLowerCase() : true;
          const matchesTransmission = transmission ? car.transmission === transmission : true;
          const matchesPrice = priceRange ? car.price <= parseInt(priceRange, 10) : true;

          return matchesType || matchesTransmission || matchesPrice;
        })
        .slice(0, 3);
    }
    return [];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Search Form */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Pickup Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <select
            className="mt-1 w-full p-2 border rounded-md"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          >
            <option value="" disabled>
              Choose pickup location
            </option>
            <option value="brighton">Brighton</option>
            <option value="airport">London Airport</option>
            <option value="manchester">Manchester</option>
          </select>
          {errors.pickupLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
          )}
        </div>

        {/* Dropoff Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Dropoff Location
          </label>
          <select
            className="mt-1 w-full p-2 border rounded-md"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          >
            <option value="" disabled>
              Choose dropoff location
            </option>
            <option value="brighton">Brighton</option>
            <option value="airport">London Airport</option>
            <option value="manchester">Manchester</option>
          </select>
          {errors.dropoffLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>
          )}
        </div>

        {/* Pickup Date and Time */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Date
          </label>
          <div className="flex space-x-2">
            <DatePicker
              selected={pickupDate}
              onChange={(date) => setPickupDate(date)}
              className="mt-1 w-full p-2 border rounded-md"
              dateFormat="dd/MM/yyyy"
            />
            <input
              type="time"
              className="mt-1 w-full p-2 border rounded-md"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
          {errors.pickupDate && (
            <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
          )}
        </div>

        {/* Dropoff Date and Time */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Dropoff Date
          </label>
          <div className="flex space-x-2">
            <DatePicker
              selected={dropoffDate}
              onChange={(date) => setDropoffDate(date)}
              className="mt-1 w-full p-2 border rounded-md"
              dateFormat="dd/MM/yyyy"
              minDate={pickupDate || undefined}
            />
            <input
              type="time"
              className="mt-1 w-full p-2 border rounded-md"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </div>
          {errors.dropoffDate && (
            <p className="text-red-500 text-sm mt-1">{errors.dropoffDate}</p>
          )}
        </div>

        {/* Search and Filter Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaSearch className="mr-2" /> Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mt-4 bg-gray-100 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Car Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Car Type
              </label>
              <select
                className="mt-1 w-full p-2 border rounded-md"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                className="mt-1 w-full p-2 border rounded-md"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Any</option>
                <option value="80">Up to £80</option>
                <option value="100">Up to £100</option>
                <option value="120">Up to £120</option>
                <option value="150">Up to £150</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transmission
              </label>
              <select
                className="mt-1 w-full p-2 border rounded-md"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {/* {Object.keys(errors).length > 0 && (
        <div className="text-red-500 mt-4">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )} */}

      {/* Search Results */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {searchResults.map((car) => (
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
        ) : (
          hasSearched && (
            <div>
              <p>No cars found matching your criteria. Here are some similar options:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getSimilarCars().map((car) => (
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
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;