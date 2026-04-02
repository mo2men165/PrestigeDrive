'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft} from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import Button from '@/components/Button';
import Modal from 'react-modal';
import { useRentalData } from '@/contexts/RentalContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export default function AdditionalOptionsPage() {
const { rentalData, setRentalData } = useRentalData();
const { id } = useParams();
const router = useRouter();
const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: boolean }>({});
const [detailsVisible, setDetailsVisible] = useState<{ [key: number]: boolean }>({});
const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [dataLoading, setDataLoading] = useState(false);
const [additionalOptions, setAdditionalOptions] = useState<any[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      setDataLoading(true);
      const optionsSnapshot = await getDocs(collection(db, 'additionalOptions'));
      const optionsData = optionsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }));
          setAdditionalOptions(optionsData);

    } catch (error) {
      console.error('Error fetching Firestore data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  fetchData();
}, []);



const formatDateGB = (date: any) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-GB');
};

const formatTimeTo12h = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${minutes} ${period}`;
};

const handleReserveNow = async () => {
  setLoading(true);

  const addonsNames = additionalOptions
    .filter((option) => selectedOptions[option.id])
    .map((option) => option.name)
    .join(", ") || "None";

  const addonsTotalCost = additionalOptions
    .filter((option) => selectedOptions[option.id])
    .reduce((total, option) => total + (option.type === 'per day' ? option.price * rentalData.totalDays : option.price), 0);

  const bookingRef = `ED4U-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  setRentalData({
    ...rentalData,
    selectedAddons: addonsNames,
    addonsCost: addonsTotalCost,
    finalTotalPrice: updatedTotalPrice,
    bookingRef,
  });

  const formattedPickupDate = formatDateGB(rentalData.pickupDate);
  const formattedDropoffDate = formatDateGB(rentalData.dropoffDate);
  const formattedPickupTime = formatTimeTo12h(rentalData.pickupTime || "");
  const formattedDropoffTime = formatTimeTo12h(rentalData.dropoffTime || "");

  const bookingData = {
    bookingRef,
    bookingType: 'standard',
    name: rentalData.name || "",
    email: rentalData.email || "",
    phone: rentalData.phone || "",
    carTitle: rentalData.carMake || "",
    selectedPlan: rentalData.selectedPlan?.name || "",
    selectedPlanPrice: rentalData.selectedPlan?.price || 0,
    pickupLocation: rentalData.pickupLocation || "",
    pickupDate: formattedPickupDate,
    pickupTime: formattedPickupTime,
    dropoffLocation: rentalData.dropoffLocation || "",
    dropoffDate: formattedDropoffDate,
    dropoffTime: formattedDropoffTime,
    totalDays: rentalData.totalDays || 0,
    basePrice: rentalData.basePrice || 0,
    planCost: (rentalData.selectedPlan?.price || 0) * (rentalData.totalDays || 0),
    totalPrice: updatedTotalPrice || 0,
    selectedAddons: addonsNames,
    addonsCost: addonsTotalCost,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'bookings', bookingRef), bookingData);

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bookingData,
        basePrice: rentalData.basePrice?.toFixed(2) || "0.00",
        planCost: ((rentalData.selectedPlan?.price || 0) * (rentalData.totalDays || 0)).toFixed(2),
        planCostPerDay: rentalData.selectedPlan?.price?.toFixed(2) || "0.00",
        totalPrice: updatedTotalPrice?.toFixed(2) || "0.00",
        addonsCost: addonsTotalCost.toFixed(2),
      }),
    }).catch((err) => console.error('Email send error:', err));

    router.push(`/booking/confirmation/${bookingRef}`);
  } catch (error) {
    console.error('Error saving booking:', error);
    alert('There was an issue confirming your booking. Please try again.');
  } finally {
    setLoading(false);
  }
};


const toggleOption = (optionId: number) => {
setSelectedOptions((prev) => ({
  ...prev,
  [optionId]: !prev[optionId],
}));
};

const toggleDetails = (optionId: number) => {
setDetailsVisible((prev) => ({
  ...prev,
  [optionId]: !prev[optionId],
}));
};

const { pickupDate, dropoffDate, basePrice, totalPrice, pickupTime, dropoffTime, totalDays, carMake, pickupLocation, dropoffLocation, selectedPlan, name, email, dob, phone  } = rentalData;

// Format the rental period as "8 days - (Feb 11th - Feb 19th)"
const formatDate = (date: Date | any) => {
return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const rentalPeriod = `${totalDays} days - (${formatDate(pickupDate)} - ${formatDate(dropoffDate)})`;

// Calculate the total price including additional options
const calculateTotalPrice = () => {
let additionalCost = 0;
additionalOptions.forEach((option) => {
  if (selectedOptions[option.id]) {
    additionalCost += option.type === 'per day' ? option.price * totalDays : option.price;
  }
});
return totalPrice + additionalCost;
};

const updatedTotalPrice = calculateTotalPrice();

const infoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.88-13h1.75v1.75h-1.75V7zm0 3.5h1.75v6h-1.75v-6z"/>
</svg>`;

Modal.setAppElement('#root');


return (
  <section className="container mx-auto py-12 my-16">
    {/* Header */}
    <div className="flex items-center gap-4 mb-10">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
      >
        <FaChevronLeft />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pick Your Add-ons</h1>
        <p className="text-sm text-gray-400 mt-0.5">Enhance your rental experience with optional extras.</p>
      </div>
    </div>
  
    {/* Main Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side - Add-ons List */}
      <div className="lg:col-span-2 space-y-6">
      {additionalOptions.map((option) => (
    <div key={option.id} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        {/* Icon, Name, and Price */}
        <div className="flex items-center space-x-4">
          {/* Render SVG from string */}
          <span className="text-2xl text-gray-700" dangerouslySetInnerHTML={{ __html: option.icon }} />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
            <p className="text-gray-600">£{option.price} <span className="text-sm">({option.type})</span></p>
          </div>
        </div>
  
        {/* Toggle Switch */}
        <Switch
          checked={!!selectedOptions[option.id]}
          onChange={() => toggleOption(option.id)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full border-2 transition-all ${
            selectedOptions[option.id] ? 'bg-primary border-primary' : 'bg-gray-300 border-gray-400'
          }`}
        >
          <span
            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${
              selectedOptions[option.id] ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </Switch>
      </div>
  
      {/* Details Button */}
      <button onClick={() => toggleDetails(option.id)} className="flex items-center mt-3 text-xs text-gray-400 hover:text-primary transition-colors">
        <span dangerouslySetInnerHTML={{ __html: infoIconSvg }} className="mr-2 w-4 h-4" />
        Details
      </button>
  
      {/* Details Text */}
      {detailsVisible[option.id] && (
        <p className="mt-3 text-gray-600 text-sm border-l-4 border-primary pl-4">{option.details}</p>
      )}
    </div>
  ))}
  
      </div>
  
      {/* Right Side - Booking Overview */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-5 sticky top-28">
        <h2 className="text-lg font-bold text-gray-900">Your Booking Overview</h2>
  
        {/* Car Details */}
        <div className="border-b pb-4 border-gray-300">
          <p className="text-gray-600 text-sm">Car Rented</p>
          <p className="text-lg font-semibold text-gray-900">{carMake}</p>
        </div>
  
        {/* Rental Period */}
        <div className="border-b pb-4 border-gray-300">
          <p className="text-gray-600 text-sm">Rental Period</p>
          <p className="text-lg font-semibold text-gray-900">{rentalPeriod}</p>
        </div>
  
        {/* Pickup & Drop-off */}
        <div className="border-b pb-4 border-gray-300">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm">A</span>
              </div>
              <div className="w-1 h-8 bg-gray-300 border-l-2 border-dashed"></div>
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm">B</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pickup Location</p>
              <p className="text-lg font-semibold text-gray-900">{pickupLocation}</p>
              <p className="text-gray-600 text-sm mt-2">Drop-off Location</p>
              <p className="text-lg font-semibold text-gray-900">{dropoffLocation}</p>
            </div>
          </div>
        </div>
  
        {/* Selected Plan */}
        <div className="border-b pb-4 border-gray-300">
          <p className="text-gray-600 text-sm">Selected Plan</p>
          <p className="text-lg font-semibold text-gray-900">{selectedPlan?.name}</p>
        </div>
  
        {/* Selected Add-ons */}
        {Object.values(selectedOptions).some(Boolean) && (
          <div className="border-b pb-4 border-gray-300">
            <p className="text-gray-600 text-sm">Selected Add-ons</p>
            <ul className="text-lg font-semibold text-gray-900">
              {additionalOptions.filter(option => selectedOptions[option.id]).map(option => (
                <li key={option.id} className="mt-1">• {option.name}</li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Total Price */}
        <div className="flex justify-between items-center font-bold text-lg text-gray-900">
          <span>Total Price:</span>
          <span>£{updatedTotalPrice?.toFixed(2)}</span>
        </div>
  
        {/* Confirm Button */}
        <button 
        className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200" 
        onClick={()=>handleReserveNow()} 
        disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Reservation'}
        </button>
        <Button className="w-full " variant="secondary" onClick={()=>setIsBreakdownModalOpen(true)}>
          Price Breakdown
        </Button>
  
        
      </div>
    </div>
    
  
      <Modal
        isOpen={isBreakdownModalOpen}
        onRequestClose={() => setIsBreakdownModalOpen(false)}
        style= {{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          maxHeight: '80vh', // Prevents full-screen height
          overflowY: 'auto', // Enables scrolling for long content
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
        contentLabel="Price Breakdown"
      >
        <h2 className="text-2xl font-bold text-primary mb-6">Price Breakdown</h2>
  
        <div className="space-y-6">
          {/* Rental Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📅 Rental Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date:</span>
                <span className="font-medium text-gray-800">{pickupDate ? new Date(pickupDate).toLocaleDateString() : "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Time:</span>
                <span className="font-medium text-gray-800">{pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dropoff Date:</span>
                <span className="font-medium text-gray-800">{dropoffDate ? new Date(dropoffDate).toLocaleDateString() : "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dropoff Time:</span>
                <span className="font-medium text-gray-800">{dropoffTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Days:</span>
                <span className="font-medium text-gray-800">{totalDays}</span>
              </div>
            </div>
          </div>
  
          {/* Price Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💵</span> Price Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental ({totalDays} days):</span>
                <span className="font-medium text-gray-800">£{basePrice?.toFixed(2)}</span>
              </div>

              {selectedPlan && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protection Plan ({selectedPlan.name}):</span>
                    <span className="font-medium text-gray-800">£{(selectedPlan.price * totalDays).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Per day:</span>
                    <span className="text-xs text-gray-400">£{selectedPlan.price?.toFixed(2)}</span>
                  </div>
                </>
              )}

              {Object.values(selectedOptions).some(Boolean) && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Selected Add-ons</h3>
                  <ul className="space-y-2">
                    {additionalOptions
                      .filter(option => selectedOptions[option.id])
                      .map(option => (
                        <li key={option.id} className="flex justify-between text-gray-800">
                          <span>{option.name}</span>
                          <span>£{(option.type === 'per day' ? option.price * totalDays : option.price).toFixed(2)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total Price:</span>
                <span>£{updatedTotalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Close Button */}
        <button
          onClick={() => setIsBreakdownModalOpen(false)}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 mt-4 rounded-lg transition"
        >
          Close
        </button>
      </Modal>
  </section>
);
}