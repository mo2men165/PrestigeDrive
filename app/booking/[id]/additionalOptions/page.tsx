'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaChevronLeft, FaInfoCircle, FaUserPlus, FaGasPump, FaShip, FaShieldAlt, FaSnowflake, FaMapMarkedAlt, FaBabyCarriage, FaCarBattery } from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { useRentalData } from '@/app/contexts/RentalContext';
import Button from '@/components/Button';
import Modal from 'react-modal';
import emailjs from 'emailjs-com';
import { additionalOptions } from '@/constants';



export default function AdditionalOptionsPage() {
const { rentalData, setRentalData } = useRentalData();
const { id } = useParams();
const router = useRouter();
const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: boolean }>({});
const [detailsVisible, setDetailsVisible] = useState<{ [key: number]: boolean }>({});
const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [confirmationMessage, setConfirmationMessage] = useState('');
const [countdown, setCountdown] = useState(60);

const handleReserveNow = async () => {
  setLoading(true);

  setTimeout(async () => {
    setLoading(false);

    // Generate confirmation message
    const message = `Hi ${name}, thanks for using Prestige Drive! We have received your order for the ${carMake}. 
    Your pickup will be from ${pickupLocation} on ${pickupDate},
    and your dropoff will be from ${dropoffLocation} on ${dropoffDate}.
    Your total price is £${totalPrice}. You will receive a confirmation email shortly, 
    and a call from one of our team members within the next 24 hours to confirm your booking.`;

    setConfirmationMessage(message);   
    
    const emailParams = {
      // Customer and Booking Details
      name: rentalData.name || "", // Fallback to empty string if undefined
      email: rentalData.email || "",
      phone: rentalData.phone || "",
      carTitle: rentalData.carMake || "",
      selectedPlan: rentalData.selectedPlan?.name || "",
      pickupLocation: rentalData.pickupLocation || "",
      pickupDate: rentalData.pickupDate ? new Date(rentalData.pickupDate).toLocaleDateString('en-GB') : "",
      pickupTime: rentalData.pickupTime || "",
      dropoffLocation: rentalData.dropoffLocation || "",
      dropoffDate: rentalData.dropoffDate ? new Date(rentalData.dropoffDate).toLocaleDateString('en-GB') : "",
      dropoffTime: rentalData.dropoffTime || "",
      totalDays: rentalData.totalDays || "",
    
      // Price Breakdown
      basePrice: rentalData.basePrice?.toFixed(2) || "0.00",
      discountAmount: rentalData.discountAmount?.toFixed(2) || "0.00",
      valueBeforeDiscount: rentalData.valueBeforeDiscount?.toFixed(2) || "0.00",
      vat: rentalData.vat?.toFixed(2) || "0.00",
      vatPercentage: ((rentalData.vat / rentalData.valueBeforeDiscount) * 100).toFixed(2) || "0.00",
      planCost: rentalData.selectedPlan?.price * totalDays || "0.00",
      planCostPerDay: (rentalData.selectedPlan?.price).toFixed(2) || "0.00",
      totalPrice: updatedTotalPrice.toFixed(2) || "0.00",
    
      // Selected Add-ons
      selectedAddons: additionalOptions
        .filter((option) => selectedOptions[option.id])
        .map((option) => option.name)
        .join(", ") || "None",
      addonsCost: additionalOptions
        .filter((option) => selectedOptions[option.id])
        .reduce((total, option) => total + (option.type === 'per day' ? option.price * rentalData.totalDays : option.price), 0)
        .toFixed(2) || "0.00",
    };
    

    console.log("Email Params:", emailParams);
    
    try {
      // Send email to customer
      await emailjs.send(
        'service_lajllhr',
        'template_1fgx54n',
        emailParams,
        'JNKdBh4-SqH_asdv7' // Replace with your actual EmailJS user ID
      );

      // Send email to owner
      await emailjs.send(
        'service_lajllhr',
        'template_e5rw3mj',
        emailParams,
        'JNKdBh4-SqH_asdv7'
      );

      // Start the countdown
      let timer = 60;
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
        timer -= 1;
        if (timer === 0) {
          clearInterval(interval);
          // router.push('/');
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }, 2000);
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

const { pickupDate, dropoffDate, basePrice, totalPrice, discountAmount, pickupTime, dropoffTime, vat, hasDiscount, valueBeforeDiscount, totalDays, carMake, pickupLocation, dropoffLocation, selectedPlan, name, email, dob, phone  } = rentalData;

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

return (
<section className="container mx-auto py-12 my-16">
  {/* Header */}
  <div className="flex items-center space-x-4 mb-8">
    <button onClick={() => router.back()} className="text-gray-800 hover:text-gray-600 transition-all">
      <FaChevronLeft className="text-2xl" />
    </button>
    <h1 className="text-3xl font-bold text-gray-900">Pick Your Add-ons</h1>
  </div>

  {/* Main Grid Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left Side - Add-ons List */}
    <div className="lg:col-span-2 space-y-6">
      {additionalOptions.map((option) => (
        <div key={option.id} className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            {/* Icon, Name, and Price */}
            <div className="flex items-center space-x-4">
              <span className="text-2xl text-gray-700">{React.createElement(option.icon)}</span>
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
          <button onClick={() => toggleDetails(option.id)} className="flex bg-primary items-center mt-3 text-sm text-white hover:underline">
            <FaInfoCircle className="mr-2" />
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
    <div className="border-2 border-gray-300 bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Your Booking Overview</h2>

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
        <span>£{updatedTotalPrice.toFixed(2)}</span>
      </div>

      {/* Confirm Button */}
      <button 
      className="w-full bg-primary text-white hover:bg-white hover:text-primary hover:border-primary border border-transparent" 
      onClick={()=>handleReserveNow()} 
      disabled={loading}>
      {loading ? 'Loading...' : 'Confirm Reservation'}
      </button>
      <Button className="w-full " variant="secondary" onClick={()=>setIsBreakdownModalOpen(true)}>
        Price Breakdown
      </Button>

      {confirmationMessage && (
        <div className="bg-green-600 text-white p-4 rounded-md mt-4">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {confirmationMessage && (
        <p className="mt-2 text-gray-700">
          Redirecting to homepage in {countdown} seconds...
        </p>
      )}

      
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
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium text-gray-800">£{basePrice.toFixed(2)}</span>
            </div>
            {hasDiscount && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-£{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Before Discount:</span>
                  <span className="font-medium text-gray-800">£{valueBeforeDiscount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">VAT:</span>
              <span className="font-medium text-gray-800">£{vat.toFixed(2)}</span>
            </div>

            {selectedPlan && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Cost:</span>
                    <span className="font-medium text-gray-800">£{selectedPlan.price.toFixed(2) * totalDays }</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Cost Per Day:</span>
                    <span className="font-medium text-gray-800">£{selectedPlan.price.toFixed(2)}</span>
                  </div>
                </>
              )}

            {/* Selected Add-ons */}
            {Object.values(selectedOptions).some(Boolean) && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🛠 Selected Add-ons</h3>
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