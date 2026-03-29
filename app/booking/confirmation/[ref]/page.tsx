'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaCheckCircle, FaCar, FaCalendarAlt, FaMapMarkerAlt, FaShieldAlt, FaPuzzlePiece, FaPhoneAlt, FaEnvelope, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import GlobalLoader from '@/components/GlobalLoader';

interface BookingData {
  bookingRef: string;
  name: string;
  email: string;
  phone: string;
  carTitle: string;
  selectedPlan: string;
  selectedPlanPrice: number;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number;
  basePrice: number;
  planCost: number;
  totalPrice: number;
  selectedAddons: string;
  addonsCost: number;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const { ref } = useParams();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const fetchBooking = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'bookings', ref as string));
        if (docSnap.exists()) {
          setBooking(docSnap.data() as BookingData);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [ref]);

  if (loading) return <GlobalLoader />;

  if (notFound || !booking) {
    return (
      <section className="container mx-auto py-24 my-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Booking not found</h1>
        <p className="text-gray-500 mt-2">We couldn&apos;t find a booking with reference <span className="font-mono font-semibold">{ref}</span>.</p>
        <Link
          href="/cars"
          className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Browse Our Fleet
        </Link>
      </section>
    );
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const {
    bookingRef,
    name,
    email,
    carTitle,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    totalDays,
    basePrice,
    selectedPlan,
    selectedPlanPrice,
    planCost,
    selectedAddons,
    addonsCost,
    totalPrice,
  } = booking;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 my-16">
      <div className="container mx-auto max-w-4xl px-4">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed</h1>
          <p className="text-lg text-gray-500">
            Thank you, <span className="font-semibold text-gray-800">{name}</span>. Your reservation is all set.
          </p>
          <div className="inline-block mt-4 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm text-gray-500 mr-2">Reference:</span>
            <span className="font-mono font-bold text-primary tracking-wider">{bookingRef}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Vehicle Banner */}
          <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <FaCar className="text-white text-xl" />
              </div>
              <div>
                <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Vehicle</p>
                <h2 className="text-2xl font-bold text-white">{carTitle}</h2>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {/* Pickup & Dropoff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-green-600 text-sm" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Pickup</h3>
                </div>
                <p className="text-gray-900 font-medium">{pickupLocation}</p>
                <div className="mt-3 flex items-center gap-2 text-gray-500">
                  <FaCalendarAlt className="text-xs" />
                  <span className="text-sm">{formatDate(pickupDate)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-5">{pickupTime}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-red-500 text-sm" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Drop-off</h3>
                </div>
                <p className="text-gray-900 font-medium">{dropoffLocation}</p>
                <div className="mt-3 flex items-center gap-2 text-gray-500">
                  <FaCalendarAlt className="text-xs" />
                  <span className="text-sm">{formatDate(dropoffDate)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-5">{dropoffTime}</p>
              </div>
            </div>

            {/* Duration Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-primary">
                <FaCalendarAlt />
                <span>{totalDays} day{totalDays !== 1 ? 's' : ''} rental</span>
              </div>
            </div>

            {/* Plan & Add-ons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedPlan && (
                <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <FaShieldAlt className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">Protection Plan</p>
                    <p className="text-gray-900 font-semibold mt-1">{selectedPlan}</p>
                    {selectedPlanPrice > 0 && (
                      <p className="text-sm text-gray-500 mt-0.5">£{selectedPlanPrice.toFixed(2)}/day</p>
                    )}
                  </div>
                </div>
              )}

              {selectedAddons && selectedAddons !== 'None' && (
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <FaPuzzlePiece className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Add-ons</p>
                    <p className="text-gray-900 font-semibold mt-1">{selectedAddons}</p>
                    <p className="text-sm text-gray-500 mt-0.5">£{addonsCost?.toFixed(2)} total</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200" />

            {/* Price Breakdown */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Rental ({totalDays} days)</span>
                  <span className="text-gray-900 font-medium">£{basePrice?.toFixed(2)}</span>
                </div>
                {selectedPlan && planCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>{selectedPlan} ({totalDays} days × £{selectedPlanPrice?.toFixed(2)})</span>
                    <span className="text-gray-900 font-medium">£{planCost.toFixed(2)}</span>
                  </div>
                )}
                {addonsCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Add-ons</span>
                    <span className="text-gray-900 font-medium">£{addonsCost?.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">£{totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">What Happens Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Confirmation Email</p>
                <p className="text-sm text-gray-500 mt-1">
                  A detailed confirmation has been sent to <span className="font-medium text-gray-700">{email}</span>.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Team Call</p>
                <p className="text-sm text-gray-500 mt-1">
                  One of our specialists will call you within 24 hours to finalise your booking.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pickup Day</p>
                <p className="text-sm text-gray-500 mt-1">
                  Arrive at the pickup location with your driving licence. Your vehicle will be ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Need Help */}
        <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 text-center mb-3">Need to make changes or have questions?</p>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-2 text-primary font-medium">
              <FaPhoneAlt className="text-sm" />
              <span>03333 391 475</span>
            </span>
            <a href="mailto:booking@elitedrive4u.co.uk" className="flex items-center gap-2 text-primary font-medium hover:underline">
              <FaEnvelope className="text-sm" />
              <span>booking@elitedrive4u.co.uk</span>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            <FaHome />
            Back to Home
          </Link>
        </div>

        {/* Booking Ref Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Booking reference: {bookingRef} &middot; EliteDrive4U &copy; {new Date().getFullYear()}
        </p>

      </div>
    </section>
  );
}
