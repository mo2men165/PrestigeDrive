"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPlane, FaCalendar, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
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
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    setIsExpanded(false);
  }, []);

  // Read navbar height — poll briefly on mount since Navbar may set it after SearchBar mounts
  useEffect(() => {
    const readNavHeight = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--navbar-height")
        .trim();
      const parsed = parseInt(val, 10);
      if (parsed > 0) setNavHeight(parsed);
      return parsed;
    };

    readNavHeight();

    // Poll a few times in case the Navbar hasn't set it yet
    const interval = setInterval(() => {
      if (readNavHeight() > 0) clearInterval(interval);
    }, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    window.addEventListener("resize", () => readNavHeight());
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener("resize", () => readNavHeight());
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsSnapshot = await getDocs(collection(db, "locations"));
        const locationsData = locationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const handleShowCars = () => {
    const finalDropoffLocation = rentalData.dropoffLocation || rentalData.pickupLocation;

    const updatedData = {
      ...rentalData,
      dropoffLocation: finalDropoffLocation,
    };
    setRentalData(updatedData);

    const pickupDateISO = updatedData.pickupDate ? new Date(updatedData.pickupDate).toISOString() : "";
    const dropoffDateISO = updatedData.dropoffDate ? new Date(updatedData.dropoffDate).toISOString() : "";

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
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topOffset = isNavbarVisible ? navHeight + 8 : 8;

  return (
    <div
      className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 p-5 container rounded-b-2xl shadow-sm transition-all duration-300"
      style={{ top: `${topOffset}px` }}
    >
      {/* Collapsed summary */}
      {!isExpanded && (
        <button
          className="flex items-center gap-3 w-full text-left pr-12"
          onClick={() => setIsExpanded(true)}
        >
          <FaSearch className="text-primary text-sm shrink-0" />
          <span className="text-gray-400 text-sm font-medium truncate">
            Search for pickup location, dates &amp; times
          </span>
        </button>
      )}

      {/* Toggle Button */}
      <button
        className="absolute top-3 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? (
          <FaChevronUp className="text-gray-500 text-xs" />
        ) : (
          <FaChevronDown className="text-gray-500 text-xs" />
        )}
      </button>

      {/* Collapsible Search Form */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/* Pickup Row */}
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Pickup Location</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  value={rentalData.pickupLocation}
                  onChange={(e) => setRentalData({ ...rentalData, pickupLocation: e.target.value })}
                >
                  <option value="" disabled>Choose pickup location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
                <FaPlane className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                {rentalData.pickupLocation && (
                  <a
                    href={locations.find((loc) => loc.id === rentalData.pickupLocation)?.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-5 top-3.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <FaMapMarkerAlt className="text-xs" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Pickup Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <DatePicker
                    selected={rentalData.pickupDate ? new Date(rentalData.pickupDate) : null}
                    onChange={(date) => setRentalData({ ...rentalData, pickupDate: date ? date.toISOString() : null })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pickup date"
                  />
                  <FaCalendar className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                </div>
                {rentalData.pickupDate && (
                  <input
                    type="time"
                    className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={rentalData.pickupTime}
                    onChange={(e) => setRentalData({ ...rentalData, pickupTime: e.target.value })}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Dropoff Row */}
          <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Dropoff Location</label>
              <div className="relative">
                {showDropoffInput ? (
                  <select
                    className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={rentalData.dropoffLocation}
                    onChange={(e) => setRentalData({ ...rentalData, dropoffLocation: e.target.value })}
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
                    className="text-sm text-gray-400 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowDropoffInput(true)}
                  >
                    Different than pickup location?
                  </p>
                )}
                {showDropoffInput && (
                  <>
                    <FaPlane className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                    {rentalData.dropoffLocation && (
                      <a
                        href={locations.find((loc) => loc.id === rentalData.dropoffLocation)?.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-5 top-3.5 text-gray-400 hover:text-primary transition-colors"
                      >
                        <FaMapMarkerAlt className="text-xs" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Dropoff Date</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <DatePicker
                    selected={rentalData.dropoffDate ? new Date(rentalData.dropoffDate) : null}
                    onChange={(date) => setRentalData({ ...rentalData, dropoffDate: date ? date.toISOString() : null })}
                    className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Dropoff date"
                    minDate={rentalData.pickupDate ? new Date(rentalData.pickupDate) : undefined}
                  />
                  <FaCalendar className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                </div>
                {rentalData.dropoffDate && (
                  <input
                    type="time"
                    className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={rentalData.dropoffTime}
                    onChange={(e) => setRentalData({ ...rentalData, dropoffTime: e.target.value })}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Show Cars Button */}
          <div className="flex justify-center items-center w-full">
            <Button onClick={handleShowCars} className="w-full py-3">
              Show Cars
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
