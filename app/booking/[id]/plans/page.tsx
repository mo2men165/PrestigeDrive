'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { useRentalData } from '@/contexts/RentalContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import GlobalLoader from '@/components/GlobalLoader';
import { log } from 'console';


export default function PlansPage() {
  const { rentalData, setRentalData } = useRentalData();
  const { id } = useParams();
  const router = useRouter();

  const [plans, setPlans] = useState<any[]>([]);
  const [protectionDetails, setProtectionDetails] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  Modal.setAppElement('#root');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansSnapshot = await getDocs(collection(db, 'plans'));
        const plansData = plansSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => a.price - b.price);
            setPlans(plansData);

        const protectionDocRef = doc(db, 'protection-details', 'default');
        const protectionDocSnap = await getDoc(protectionDocRef);

        if (protectionDocSnap.exists()) {
          console.log(protectionDocSnap.data());
          setProtectionDetails(protectionDocSnap.data().default);
        }

      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (!rentalData || loading) {
    return <GlobalLoader />;
  }

  // Extract rental details
  const { pickupDate, dropoffDate, basePrice, totalPrice, discountAmount, pickupTime, dropoffTime, vat, hasDiscount, valueBeforeDiscount, totalDays } = rentalData;

  // Calculate the total price including the selected plan
  const selectedPlanDetails = selectedPlan !== null ? plans.find((plan) => plan.id === selectedPlan) : null;
  const planCost = selectedPlanDetails ? selectedPlanDetails.price * totalDays : 0;
  const updatedTotalPrice = basePrice + vat + planCost - (hasDiscount ? discountAmount : 0);

  const handleContinue = () => {
    if (selectedPlan !== null) {
      setRentalData({ ...rentalData, selectedPlan: selectedPlanDetails, totalPrice: updatedTotalPrice });
      router.push(`/booking/${id}/additionalOptions`);
    }
  };
  return (
    <section className="container mx-auto py-12 my-16">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-8">
        <button
          onClick={() => router.back()}
          className="text-primary hover:text-primary-dark transition-all duration-300"
        >
          <FaChevronLeft className="text-2xl" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">What protection package do you need?</h1>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 flex flex-col ${
              selectedPlan === plan.id ? 'border-2 border-primary' : 'border border-gray-200'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {/* Plan Name and Radio Button */}
            <div className="flex justify-between items-center bg-gray-100 p-6 rounded-t-lg">
              <h3 className="text-2xl font-bold text-gray-800 whitespace-pre-wrap">{plan.name}</h3>
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === plan.id}
                onChange={() => setSelectedPlan(plan.id)}
                className="form-radio h-5 w-5 text-primary"
              />
            </div>

            {/* Plan Description */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">{plan.description}</p>
            </div>

            {/* Protection Details */}
            <div className="p-6 space-y-3 flex-1">
              {protectionDetails.map((detail, index) => (
                <div key={index} className="flex items-center">
                  {plan.includes.includes(detail) ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-gray-400 mr-2" />
                  )}
                  <span className={plan.includes.includes(detail) ? 'text-gray-800' : 'text-gray-400'}>
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="p-6 border-t border-gray-200">
              <p className="text-lg font-semibold text-primary">£{plan.price} / day</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price and Actions */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-xl font-semibold text-gray-800">
          Total Price: £{updatedTotalPrice.toFixed(2)}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsBreakdownModalOpen(true)}
            className="px-6 py-3 text-lg font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
          >
            View Breakdown
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedPlan === null}
            className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              selectedPlan === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Breakdown Modal */}
      <Modal
        isOpen={isBreakdownModalOpen}
        onRequestClose={() => setIsBreakdownModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            maxWidth: '90%',
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
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (20%):</span>
                <span className="font-medium text-gray-800">£{vat.toFixed(2)}</span>
              </div>
              {hasDiscount && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value Before Discount:</span>
                    <span className="font-medium text-gray-800">£{valueBeforeDiscount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount (30%):</span>
                    <span className="font-medium text-green-600">-£{discountAmount?.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">*Discount applied for renting 30+ days.</div>
                </>
              )}
              {selectedPlanDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Cost:</span>
                    <span className="font-medium text-gray-800">£{planCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Cost Per Day:</span>
                    <span className="font-medium text-gray-800">£{selectedPlanDetails.price.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-800 font-semibold">Total Price:</span>
                <span className="font-bold text-primary text-lg">£{updatedTotalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsBreakdownModalOpen(false)}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
}