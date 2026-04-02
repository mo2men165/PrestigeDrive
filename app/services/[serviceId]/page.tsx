'use client';

import { useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaMapMarkerAlt, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Suspense, useEffect, useState } from 'react';
import GlobalLoader from '@/components/GlobalLoader';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import {
  getAllServicePricing,
  countServiceRentalDays,
  isServicePricingKey,
  type ServicePricingDoc,
  type ServicePricingKey,
} from '@/lib/service-pricing';

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

export default function BookingForm() {
  const searchParams = useSearchParams();
  const defaultServiceType = searchParams.get('service') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [pricingByService, setPricingByService] = useState<
    Record<ServicePricingKey, ServicePricingDoc | null> | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsSnapshot, pricing] = await Promise.all([
          getDocs(collection(db, 'locations')),
          getAllServicePricing(db),
        ]);
        const locationsData = locationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationsData);
        setPricingByService(pricing);
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

    const serviceKey = values.serviceType;
    const pricingRow =
      isServicePricingKey(serviceKey) && pricingByService
        ? pricingByService[serviceKey]
        : null;
    const rentalDays =
      values.pickupDate && values.dropoffDate
        ? countServiceRentalDays(new Date(values.pickupDate), new Date(values.dropoffDate))
        : 0;
    const pricePerDay = pricingRow?.pricePerDay ?? null;
    const totalPrice =
      pricePerDay != null && rentalDays > 0
        ? Math.round(pricePerDay * rentalDays * 100) / 100
        : null;

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
      pricePerDay: pricePerDay ?? undefined,
      currency: pricingRow?.currency ?? 'GBP',
      totalPrice: totalPrice ?? undefined,
      pricingNotes: pricingRow?.notes || undefined,
      pricingSource: pricingRow?.fromLegacy ? 'legacy' : pricingRow ? 'pricing' : undefined,
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

      setIsLoading(false);
      const priceLine =
        totalPrice != null && pricePerDay != null
          ? ` Your guide price is £${totalPrice.toFixed(2)} (${rentalDays} day${rentalDays !== 1 ? 's' : ''} × £${pricePerDay.toFixed(2)} per day); final price will be confirmed by our team.`
          : '';
      setConfirmationMessage(
        `Hi ${values.name}, thanks for booking with EliteDrive4U! We have received your booking for ${serviceName}. Your pickup will be from ${values.pickupLocation} on ${formattedPickupDate} at ${formattedPickupTime}, and your dropoff will be at ${values.dropoffLocation} on ${formattedDropoffDate} at ${formattedDropoffTime}. Your booking reference is ${bookingRef}.${priceLine} You will receive a confirmation email and one of our team members will call you to confirm.`
      );
    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsLoading(false);
      setConfirmationMessage('An error occurred while submitting your booking. Please try again.');
    }
  };

  return (
    <Suspense fallback={<GlobalLoader />}>
      <section className="container mx-auto py-12 my-16 max-w-3xl">
        {confirmationMessage && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Booking Request Received</h2>
            <p className="text-gray-500 leading-relaxed mb-6">{confirmationMessage}</p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

        {!confirmationMessage && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Reservation Form</h2>
            <p className="text-sm text-gray-400 mb-2">Fill in the details below to request your booking.</p>
            <p className="text-xs text-gray-500 mb-8 leading-relaxed">
              Guide prices use our public <strong className="font-medium text-gray-600">pricing</strong> list (per day, £); admins manage rates in the dashboard. The site reads <code className="text-[11px] bg-gray-100 px-1 rounded">pricing/{'{serviceKey}'}</code> in Firestore.
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
                const pricingKey = values.serviceType;
                const selectedPricing =
                  isServicePricingKey(pricingKey) && pricingByService
                    ? pricingByService[pricingKey]
                    : null;
                const rentalDaysForDisplay =
                  values.pickupDate && values.dropoffDate
                    ? countServiceRentalDays(
                        new Date(values.pickupDate),
                        new Date(values.dropoffDate)
                      )
                    : null;
                const guideTotal =
                  selectedPricing && rentalDaysForDisplay != null
                    ? Math.round(
                        selectedPricing.pricePerDay * rentalDaysForDisplay * 100
                      ) / 100
                    : null;

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

                  <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-800">Guide price</h3>
                    {!values.serviceType && (
                      <p className="text-xs text-gray-500">Select a service type to see price per day (£).</p>
                    )}
                    {values.serviceType && !isServicePricingKey(values.serviceType) && (
                      <p className="text-xs text-gray-500">Unknown service type for pricing.</p>
                    )}
                    {values.serviceType && isServicePricingKey(values.serviceType) && pricingByService === null && (
                      <p className="text-xs text-gray-500">Loading prices…</p>
                    )}
                    {values.serviceType &&
                      isServicePricingKey(values.serviceType) &&
                      pricingByService !== null &&
                      !selectedPricing && (
                        <p className="text-xs text-gray-600">
                          No guide price is set for this service yet. We will confirm cost when we contact you.
                        </p>
                      )}
                    {selectedPricing && (
                      <>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Price per day (£)
                          </span>
                          <span className="text-lg font-bold text-primary">
                            £{selectedPricing.pricePerDay.toFixed(2)}
                          </span>
                        </div>
                        {selectedPricing.fromLegacy && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                            Showing legacy admin prices until this service is saved under the{' '}
                            <strong className="font-semibold">pricing</strong> collection.
                          </p>
                        )}
                        {selectedPricing.notes ? (
                          <p className="text-xs text-gray-600 leading-relaxed">{selectedPricing.notes}</p>
                        ) : null}
                        {rentalDaysForDisplay != null && guideTotal != null ? (
                          <div className="pt-2 border-t border-gray-200 space-y-1">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>
                                {rentalDaysForDisplay} day{rentalDaysForDisplay !== 1 ? 's' : ''} × £
                                {selectedPricing.pricePerDay.toFixed(2)}
                              </span>
                              <span className="font-semibold text-gray-900">
                                £{guideTotal.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500">
                              Guide total only; final price confirmed by our team.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 pt-1">
                            Choose pickup and drop-off dates to see a guide total.
                          </p>
                        )}
                      </>
                    )}
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
