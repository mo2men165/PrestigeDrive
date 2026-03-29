'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { useRentalData } from '@/contexts/RentalContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import GlobalLoader from '@/components/GlobalLoader';


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
  const { pickupDate, dropoffDate, basePrice, totalPrice, pickupTime, dropoffTime, totalDays } = rentalData;

  const selectedPlanDetails = selectedPlan !== null ? plans.find((plan) => plan.id === selectedPlan) : null;
  const planCost = selectedPlanDetails ? selectedPlanDetails.price * totalDays : 0;
  const updatedTotalPrice = basePrice + planCost;

  const handleContinue = () => {
    if (selectedPlan !== null) {
      setRentalData({ ...rentalData, selectedPlan: selectedPlanDetails, totalPrice: updatedTotalPrice });
      router.push(`/booking/${id}/additionalOptions`);
    }
  };
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
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Protection</h1>
          <p className="text-sm text-gray-400 mt-0.5">Select the plan that gives you peace of mind.</p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl cursor-pointer transition-all duration-300 flex flex-col shadow-sm hover:shadow-md ${
              selectedPlan === plan.id ? 'border-2 border-primary ring-4 ring-primary/5' : 'border border-gray-100'
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
            className="px-6 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
          >
            View Breakdown
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedPlan === null}
            className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              selectedPlan === null
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
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
                <span className="text-gray-600">Rental ({totalDays} days):</span>
                <span className="font-medium text-gray-800">£{basePrice.toFixed(2)}</span>
              </div>
              {selectedPlanDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protection Plan ({selectedPlanDetails.name}):</span>
                    <span className="font-medium text-gray-800">£{planCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Per day:</span>
                    <span className="text-xs text-gray-400">£{selectedPlanDetails.price.toFixed(2)}</span>
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