'use client';

import { useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendar,
  FaCalendarAlt,
  FaEnvelope,
  FaHome,
  FaPhoneAlt,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Suspense, useEffect, useState } from 'react';
import GlobalLoader from '@/components/GlobalLoader';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

function formatDateLongUk(ddMmYyyy: string): string {
  const parts = ddMmYyyy.split('/');
  if (parts.length !== 3) return ddMmYyyy;
  const d = new Date(
    parseInt(parts[2], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[0], 10)
  );
  if (isNaN(d.getTime())) return ddMmYyyy;
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function countRentalDays(pickup: Date, dropoff: Date): number {
  const pickupDate = new Date(pickup);
  const dropoffDate = new Date(dropoff);
  if (isNaN(pickupDate.getTime()) || isNaN(dropoffDate.getTime())) return 0;
  const days = Math.ceil(
    (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(1, days);
}

const serviceTypes = [
  { id: 'chauffeur-services', name: 'Chauffeur Services' },
  { id: 'event-rentals', name: 'Event Rentals' },
  { id: 'corporate-services', name: 'Corporate Services' },
];

const BookingSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  pickupDate: Yup.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Pickup date cannot be in the past')
    .required('Pickup date is required'),
  dropoffDate: Yup.date()
    .min(Yup.ref('pickupDate'), 'Dropoff date must be after pickup date')
    .required('Dropoff date is required'),
  pickupLocation: Yup.string().required('Pickup location is required'),
  dropoffLocation: Yup.string().required('Dropoff location is required'),
  pickupTime: Yup.string().required('Pickup time is required'),
  dropoffTime: Yup.string().required('Dropoff time is required'),
  serviceType: Yup.string().required('Service type is required'),
});

type ServiceBookingConfirmation = {
  name: string;
  email: string;
  phone: string;
  serviceLabel: string;
  bookingRef: string;
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  rentalDays: number;
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const defaultServiceType = searchParams.get('service') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ServiceBookingConfirmation | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsSnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = locationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchData();
  }, []);

  const service = serviceTypes.find((s) => s.id === defaultServiceType);
  const serviceName = service ? service.name : 'Unknown Service';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB');
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${display}:${minutes} ${period}`;
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    const isChauffeurBooking = values.serviceType === 'chauffeur-services';
    const bookingType = isChauffeurBooking ? 'chauffeur' : 'service';
    const bookingRef = `ED4U-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const formattedPickupDate = formatDate(values.pickupDate);
    const formattedDropoffDate = formatDate(values.dropoffDate);
    const formattedPickupTime = formatTime(values.pickupTime);
    const formattedDropoffTime = formatTime(values.dropoffTime);

    const rentalDays =
      values.pickupDate && values.dropoffDate
        ? countRentalDays(new Date(values.pickupDate), new Date(values.dropoffDate))
        : 0;

    const bookingData = {
      bookingRef,
      bookingType,
      name: values.name,
      email: values.email,
      phone: values.phone,
      pickupLocation: values.pickupLocation,
      pickupDate: formattedPickupDate,
      pickupTime: formattedPickupTime,
      dropoffLocation: values.dropoffLocation,
      dropoffDate: formattedDropoffDate,
      dropoffTime: formattedDropoffTime,
      service: values.serviceType,
      additionalNotes: values.additionalNotes || '',
      totalDays: rentalDays,
      pricePerDay: 0,
      totalPrice: 0,
      currency: 'GBP',
      createdAt: new Date().toISOString(),
    };

    const firestoreBooking = Object.fromEntries(
      Object.entries(bookingData).filter(([, v]) => v !== undefined)
    );

    try {
      await setDoc(doc(db, 'bookings', bookingRef), firestoreBooking);

      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error('Email send failed');

      const selectedLabel =
        serviceTypes.find((s) => s.id === values.serviceType)?.name ?? serviceName;

      setIsLoading(false);
      setConfirmationError(null);
      setConfirmation({
        name: values.name,
        email: values.email,
        phone: values.phone || '',
        serviceLabel: selectedLabel,
        bookingRef,
        pickupLocation: values.pickupLocation,
        pickupDate: formattedPickupDate,
        pickupTime: formattedPickupTime,
        dropoffLocation: values.dropoffLocation,
        dropoffDate: formattedDropoffDate,
        dropoffTime: formattedDropoffTime,
        rentalDays,
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsLoading(false);
      setConfirmation(null);
      setConfirmationError(
        'We could not complete your request. Please check your connection and try again, or call us on 03333 391 475.'
      );
    }
  };

  return (
    <Suspense fallback={<GlobalLoader />}>
      <section
        className={
          confirmation
            ? 'min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 my-16'
            : 'container mx-auto py-12 my-16 max-w-3xl'
        }
      >
        {confirmationError && !confirmation && (
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">{confirmationError}</p>
              <button
                type="button"
                onClick={() => setConfirmationError(null)}
                className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {confirmation && (
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <FaCheckCircle className="text-green-500 text-5xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Thank you</h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                We&apos;ve received your{' '}
                <span className="font-semibold text-gray-800">{confirmation.serviceLabel}</span> request,
                <span className="font-semibold text-gray-800"> {confirmation.name}</span>.
              </p>
              <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto">
                Your details are with our team. We&apos;ll email you shortly and follow up with a personalised quote
                — pricing depends on vehicle, route, and locations.
              </p>
              <div className="inline-block mt-5 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-sm text-gray-500 mr-2">Reference</span>
                <span className="font-mono font-bold text-primary tracking-wider text-sm">
                  {confirmation.bookingRef}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <FaCalendar className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Service</p>
                    <h2 className="text-2xl font-bold text-white">{confirmation.serviceLabel}</h2>
                    {confirmation.rentalDays > 0 && (
                      <p className="text-white/70 text-sm mt-1">
                        {confirmation.rentalDays} day{confirmation.rentalDays !== 1 ? 's' : ''} requested
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-green-600 text-sm" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Pickup</h3>
                    </div>
                    <p className="text-gray-900 font-medium leading-snug">{confirmation.pickupLocation}</p>
                    <div className="mt-3 flex items-center gap-2 text-gray-500">
                      <FaCalendarAlt className="text-xs shrink-0" />
                      <span className="text-sm">{formatDateLongUk(confirmation.pickupDate)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-5">{confirmation.pickupTime}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-red-500 text-sm" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Drop-off</h3>
                    </div>
                    <p className="text-gray-900 font-medium leading-snug">{confirmation.dropoffLocation}</p>
                    <div className="mt-3 flex items-center gap-2 text-gray-500">
                      <FaCalendarAlt className="text-xs shrink-0" />
                      <span className="text-sm">{formatDateLongUk(confirmation.dropoffDate)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-5">{confirmation.dropoffTime}</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Your contact details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-primary text-xs shrink-0" />
                      <span className="text-gray-900 break-all">{confirmation.email}</span>
                    </div>
                    {confirmation.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhoneAlt className="text-primary text-xs shrink-0" />
                        <span className="text-gray-900">{confirmation.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">What happens next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Confirmation email</p>
                    <p className="text-sm text-gray-500 mt-1">
                      We&apos;ve sent an acknowledgement to{' '}
                      <span className="font-medium text-gray-700">{confirmation.email}</span>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Personalised quote</p>
                    <p className="text-sm text-gray-500 mt-1">
                      A member of our team will contact you within 24 hours to discuss your requirements and confirm
                      pricing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Final confirmation</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Once you&apos;re happy with the quote, we&apos;ll finalise your booking and share any remaining
                      details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500 text-center mb-3">Questions or need to make a change?</p>
              <div className="flex flex-wrap justify-center gap-6">
                <span className="flex items-center gap-2 text-primary font-medium">
                  <FaPhoneAlt className="text-sm" />
                  <span>03333 391 475</span>
                </span>
                <a
                  href="mailto:booking@elitedrive4u.co.uk"
                  className="flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  <FaEnvelope className="text-sm" />
                  <span>booking@elitedrive4u.co.uk</span>
                </a>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                <FaHome />
                Back to Home
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Reference {confirmation.bookingRef} · EliteDrive4U © {new Date().getFullYear()}
            </p>
          </div>
        )}

        {!confirmation && !confirmationError && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Reservation Form</h2>
            <p className="text-sm text-gray-400 mb-2">Fill in the details below to request your booking.</p>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed">
              <strong className="font-medium text-gray-600">Pricing is not shown online</strong> — it varies by vehicle, route, and location. After you submit, our team will contact you with a personalised quote before anything is confirmed.
            </p>

            <Formik
              initialValues={{
                name: '',
                phone: '',
                email: '',
                pickupDate: null as Date | null,
                pickupLocation: '',
                pickupTime: '',
                dropoffDate: null as Date | null,
                dropoffLocation: '',
                dropoffTime: '',
                serviceType: defaultServiceType,
                additionalNotes: '',
              }}
              validationSchema={BookingSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const isChauffeur = values.serviceType === 'chauffeur-services';

                return (
                <Form className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          value={values.phone}
                          onChange={(value) => setFieldValue('phone', value)}
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm"
                        />
                        <ErrorMessage name="phone" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-xs font-medium text-gray-500 mb-1.5">
                      Service Type <span className="text-red-400">*</span>
                    </label>
                    <Field
                      as="select"
                      id="serviceType"
                      name="serviceType"
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newType = e.target.value;
                        const wasChauffeur = values.serviceType === 'chauffeur-services';
                        const willBeChauffeur = newType === 'chauffeur-services';
                        setFieldValue('serviceType', newType);
                        if (wasChauffeur !== willBeChauffeur) {
                          setFieldValue('pickupLocation', '');
                          setFieldValue('dropoffLocation', '');
                        }
                      }}
                    >
                      <option value="" disabled>Select a service type</option>
                      {serviceTypes.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="serviceType" component="div" className="text-red-400 text-xs mt-1" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                      {isChauffeur ? 'Trip Details' : 'Rental Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="pickupLocation" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Pickup Location <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          {isChauffeur ? (
                            <Field
                              type="text"
                              id="pickupLocation"
                              name="pickupLocation"
                              placeholder="Enter pickup address"
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                          ) : (
                            <Field
                              as="select"
                              id="pickupLocation"
                              name="pickupLocation"
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                              <option value="" disabled>Choose pickup location</option>
                              {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                  {location.name} - {location.address}
                                </option>
                              ))}
                            </Field>
                          )}
                          <FaMapMarkerAlt className="absolute right-3 top-3.5 text-gray-300 text-xs" />
                        </div>
                        <ErrorMessage name="pickupLocation" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="pickupDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Pickup Date <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={values.pickupDate ? new Date(values.pickupDate) : null}
                            onChange={(date) => setFieldValue('pickupDate', date)}
                            className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            minDate={new Date()}
                          />
                          <FaCalendar className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                        </div>
                        <ErrorMessage name="pickupDate" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="pickupTime" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Pickup Time <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="time"
                          id="pickupTime"
                          name="pickupTime"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                        <ErrorMessage name="pickupTime" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="dropoffLocation" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Dropoff Location <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          {isChauffeur ? (
                            <Field
                              type="text"
                              id="dropoffLocation"
                              name="dropoffLocation"
                              placeholder="Enter dropoff address"
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                          ) : (
                            <Field
                              as="select"
                              id="dropoffLocation"
                              name="dropoffLocation"
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                              <option value="" disabled>Choose dropoff location</option>
                              {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                  {location.name} - {location.address}
                                </option>
                              ))}
                            </Field>
                          )}
                          <FaMapMarkerAlt className="absolute right-3 top-3.5 text-gray-300 text-xs" />
                        </div>
                        <ErrorMessage name="dropoffLocation" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="dropoffDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Dropoff Date <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={values.dropoffDate ? new Date(values.dropoffDate) : null}
                            onChange={(date) => setFieldValue('dropoffDate', date)}
                            className="w-full p-2.5 border border-gray-200 rounded-lg pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            minDate={values.pickupDate ? new Date(values.pickupDate) : new Date()}
                          />
                          <FaCalendar className="absolute left-3 top-3.5 text-gray-400 text-xs" />
                        </div>
                        <ErrorMessage name="dropoffDate" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="dropoffTime" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Dropoff Time <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="time"
                          id="dropoffTime"
                          name="dropoffTime"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                        <ErrorMessage name="dropoffTime" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Pricing</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      We do not display fixed prices here — your quote depends on the vehicle, locations, and itinerary.
                      A team member will reach out to discuss options and confirm the price with you.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="additionalNotes" className="block text-xs font-medium text-gray-500 mb-1.5">
                      Additional Notes
                    </label>
                    <Field
                      as="textarea"
                      id="additionalNotes"
                      name="additionalNotes"
                      rows={4}
                      placeholder="Any specific requirements, preferences, or information you'd like us to know..."
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </section>
    </Suspense>
  );
}

