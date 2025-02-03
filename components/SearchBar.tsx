"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaPlane, FaCalendar, FaBars } from "react-icons/fa";
import { carsData } from "@/constants";
import Card from "./Card";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import Button from "./Button";

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
  const [pickupTime, setPickupTime] = useState("12:30");
  const [dropoffTime, setDropoffTime] = useState("08:30");
  const [showFilters, setShowFilters] = useState(false);
  const [carType, setCarType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [transmission, setTransmission] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [showDropoffInput, setShowDropoffInput] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsNavbarVisible(false); // Hide navbar on scroll down
      } else {
        setIsNavbarVisible(true); // Show navbar on scroll up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShowCars = () => {
    router.push("/cars");
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 border-p z-40 bg-white p-6 container rounded-lg shadow-lg transition-transform duration-300 ${
      isNavbarVisible ? 'translate-y-20' : 'translate-y-0'
    }`}>
      {/* Toggle Button for Smaller Screens */}
      <button
        className="md:hidden absolute top-2 right-4 p-2 bg-gray-200 rounded-lg"
        onClick={toggleSearchBar}
      >
        <FaBars className="text-gray-700" />
      </button>

      {/* Search Form */}
      <div className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 ${
        isSearchBarVisible ? 'block' : 'hidden md:flex'
      }`}>
        {/* Pickup Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <div className="relative mt-1">
            <select
              className="w-full p-2 border rounded-md pl-10"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="" disabled>
                Choose pickup location
              </option>
              <option value="brighton-airport">Brighton Airport</option>
              <option value="heathrow-airport">Heathrow Airport</option>
            </select>
            <FaPlane className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Dropoff Location
          </label>
          <div className="relative mt-1">
            {showDropoffInput ? (
              <select
                className="w-full p-2 border rounded-md pl-10"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              >
                <option value="" disabled>
                  Choose dropoff location
                </option>
                <option value="brighton-airport">Brighton Airport</option>
                <option value="heathrow-airport">Heathrow Airport</option>
              </select>
            ) : (
              <p
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setShowDropoffInput(true)}
              >
                Different than pickup location?
              </p>
            )}
            {showDropoffInput && <FaPlane className="absolute left-3 top-3 text-gray-500" />}
          </div>
        </div>

        {/* Pickup Date and Time */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Date
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <DatePicker
                selected={pickupDate}
                onChange={(date) => setPickupDate(date)}
                className="w-full p-2 border rounded-md pl-10"
                dateFormat="dd/MM/yyyy"
                placeholderText="Pickup date"
              />
              <FaCalendar className="absolute left-3 top-3 text-gray-500" />
            </div>
            {pickupDate && (
              <input
                type="time"
                className="w-1/3 p-2 border rounded-md"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Dropoff Date and Time */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Dropoff Date
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <DatePicker
                selected={dropoffDate}
                onChange={(date) => setDropoffDate(date)}
                className="w-full p-2 border rounded-md pl-10"
                dateFormat="dd/MM/yyyy"
                placeholderText="Dropoff date"
                minDate={pickupDate || undefined}
              />
              <FaCalendar className="absolute left-3 top-3 text-gray-500" />
            </div>
            {dropoffDate && (
              <input
                type="time"
                className="w-1/3 p-2 border rounded-md"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Show Cars Button */}
        <div className="flex space-x-4">
          <Button
            href="/cars"
          >
            Show Cars
          </Button>
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
    </div>
  );
};

export default SearchBar;