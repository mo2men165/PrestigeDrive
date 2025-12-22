"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPlane, FaCalendar, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { useRentalData } from "@/contexts/RentalContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const SearchBar = () => {
  const { rentalData, setRentalData } = useRentalData();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [showDropoffInput, setShowDropoffInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>();
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsExpanded(window.innerWidth >= 768);
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsSnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = locationsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }));
            setLocations(locationsData);
  
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };
  
    fetchData();
  }, []);

  const router = useRouter();

  const handleShowCars = () => {
    // If dropoffLocation is empty, set it to pickupLocation
    const finalDropoffLocation = rentalData.dropoffLocation || rentalData.pickupLocation;

    // Update rental data in context
    const updatedData = {
      ...rentalData,
      dropoffLocation: finalDropoffLocation,
    };
    setRentalData(updatedData);
  
    // Convert dates to ISO strings
    const pickupDateISO = updatedData.pickupDate ? new Date(updatedData.pickupDate).toISOString() : "";
    const dropoffDateISO = updatedData.dropoffDate ? new Date(updatedData.dropoffDate).toISOString() : "";
  
    // Encode rental data as query parameters
    const queryParams = new URLSearchParams({
      pickupLocation: updatedData.pickupLocation,
      dropoffLocation: updatedData.dropoffLocation,
      pickupDate: pickupDateISO,
      dropoffDate: dropoffDateISO,
      pickupTime: updatedData.pickupTime,
      dropoffTime: updatedData.dropoffTime,
    });
  
    router.push(`/cars?${queryParams.toString()}`);
  };

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false); // Hide navbar → Move search bar up
      } else {
        setIsNavbarVisible(true); // Show navbar → Move search bar down
      }

      lastScrollY.current = currentScrollY; // Update ref value
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white p-6 container rounded-lg shadow-lg transition-all duration-300 ${
        isNavbarVisible ? "translate-y-28" : "translate-y-4"
      }`}
    >
      {/* Toggle Button (Dropdown Arrow) */}
      <button
        className="absolute top-2 right-4 p-2 bg-gray-200 rounded-lg"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-primary" />}
      </button>

      {/* Collapsible Search Form */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/* Pickup Location */}
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <div className="relative mt-1">
                <select
                  className="w-full p-2 border rounded-md pl-10"
                  value={rentalData.pickupLocation}
                  onChange={(e) => {
                    setRentalData({ ...rentalData, pickupLocation: e.target.value });
                    console.log("Pickup Location Updated:", e.target.value); // Debugging
                  }}
                >
                  <option value="" disabled>Choose pickup location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
                <FaPlane className="absolute left-3 top-3 text-gray-500" />
                {rentalData.pickupLocation && (
                  <a
                    href={locations.find((loc) => loc.id === rentalData.pickupLocation)?.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-5 top-3 text-gray-500 hover:text-primary"
                  >
                    <FaMapMarkerAlt />
                  </a>
                )}
              </div>
            </div>

            {/* Pickup Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <DatePicker
                    selected={rentalData.pickupDate ? new Date(rentalData.pickupDate) : null}
                    onChange={(date) => {
                      setRentalData({ ...rentalData, pickupDate: date ? date.toISOString() : null });
                      console.log("Pickup Date Updated:", date); // Debugging
                    }}
                    className="w-full p-2 border rounded-md pl-10"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pickup date"
                  />
                  <FaCalendar className="absolute left-3 top-3 text-gray-500" />
                </div>
                {rentalData.pickupDate && (
                  <input
                    type="time"
                    className="w-1/3 p-2 border rounded-md"
                    value={rentalData.pickupTime}
                    onChange={(e) => {
                      setRentalData({ ...rentalData, pickupTime: e.target.value });
                      console.log("Pickup Time Updated:", e.target.value); // Debugging
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Dropoff Data */}
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
              <div className="relative mt-1">
                {showDropoffInput ? (
                  <select
                    className="w-full p-2 border rounded-md pl-10"
                    value={rentalData.dropoffLocation}
                    onChange={(e) => {
                      setRentalData({ ...rentalData, dropoffLocation: e.target.value });
                      console.log("Dropoff Location Updated:", e.target.value); // Debugging
                    }}
                  >
                    <option value="" disabled>Choose dropoff location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p
                    className="text-sm text-gray-500 cursor-pointer"
                    onClick={() => setShowDropoffInput(true)}
                  >
                    Different than pickup location?
                  </p>
                )}
                {showDropoffInput && (
                  <>
                    <FaPlane className="absolute left-3 top-3 text-gray-500" />
                    {rentalData.dropoffLocation && (
                      <a
                        href={locations.find((loc) => loc.id === rentalData.dropoffLocation)?.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-5 top-3 text-gray-500 hover:text-primary"
                      >
                        <FaMapMarkerAlt />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Dropoff Date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Dropoff Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <DatePicker
                    selected={rentalData.dropoffDate ? new Date(rentalData.dropoffDate) : null}
                    onChange={(date) => {
                      setRentalData({ ...rentalData, dropoffDate: date ? date.toISOString() : null });
                      console.log("Dropoff Date Updated:", date); // Debugging
                    }}
                    className="w-full p-2 border rounded-md pl-10"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Dropoff date"
                    minDate={rentalData.pickupDate ? new Date(rentalData.pickupDate) : undefined}
                  />
                  <FaCalendar className="absolute left-3 top-3 text-gray-500" />
                </div>
                {rentalData.dropoffDate && (
                  <input
                    type="time"
                    className="w-1/3 p-2 border rounded-md"
                    value={rentalData.dropoffTime}
                    onChange={(e) => {
                      setRentalData({ ...rentalData, dropoffTime: e.target.value });
                      console.log("Dropoff Time Updated:", e.target.value); // Debugging
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Show Cars Button */}
          <div className="flex justify-center items-center w-full">
            <Button onClick={handleShowCars} className="w-[100%]">Show Cars</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;