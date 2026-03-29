'use client';

import { useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { Suspense, useEffect, useState } from 'react';
import GlobalLoader from '@/components/GlobalLoader';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

const serviceTypes = [
  { id: 'chauffeur-services', name: 'Chauffeur Services' },
  { id: 'event-rentals', name: 'Event Rentals' },
  { id: 'corporate-services', name: 'Corporate Services' },
];

const BookingSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  pickupDate: Yup.date().required('Pickup date is required'),
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

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    const emailParams = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      pickupLocation: values.pickupLocation,
      pickupDate: values.pickupDate,
      pickupTime: values.pickupTime,
      dropoffLocation: values.dropoffLocation,
      dropoffDate: values.dropoffDate,
      dropoffTime: values.dropoffTime,
      service: values.serviceType,
    };

    try {
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailParams),
      });
      if (!res.ok) throw new Error('Email send failed');

      setIsLoading(false);
      setConfirmationMessage(
        `Hi ${values.name}, thanks for booking with EliteDrive4U! We have received your booking for ${serviceName}. Your pickup will be from ${values.pickupLocation} on ${values.pickupDate} at ${values.pickupTime}, and your dropoff will be at ${values.dropoffLocation} on ${values.dropoffDate} at ${values.dropoffTime}. You will receive a confirmation email and one of our team members will call you to confirm.`
      );
    } catch (error) {
      console.error('Error sending email:', error);
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
            <p className="text-sm text-gray-400 mb-8">Fill in the details below to request your booking.</p>

            <Formik
              initialValues={{
                name: '',
                phone: '',
                email: '',
                pickupDate: '',
                pickupLocation: '',
                pickupTime: '',
                dropoffDate: '',
                dropoffLocation: '',
                dropoffTime: '',
                serviceType: defaultServiceType,
              }}
              validationSchema={BookingSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
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
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Rental Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="pickupLocation" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Pickup Location <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
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
                          <FaMapMarkerAlt className="absolute right-3 top-3.5 text-gray-300 text-xs" />
                        </div>
                        <ErrorMessage name="pickupLocation" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="pickupDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Pickup Date <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="date"
                          id="pickupDate"
                          name="pickupDate"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
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
                          <FaMapMarkerAlt className="absolute right-3 top-3.5 text-gray-300 text-xs" />
                        </div>
                        <ErrorMessage name="dropoffLocation" component="div" className="text-red-400 text-xs mt-1" />
                      </div>
                      <div>
                        <label htmlFor="dropoffDate" className="block text-xs font-medium text-gray-500 mb-1.5">
                          Dropoff Date <span className="text-red-400">*</span>
                        </label>
                        <Field
                          type="date"
                          id="dropoffDate"
                          name="dropoffDate"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
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

                  <div>
                    <label htmlFor="serviceType" className="block text-xs font-medium text-gray-500 mb-1.5">
                      Service Type <span className="text-red-400">*</span>
                    </label>
                    <Field
                      as="select"
                      id="serviceType"
                      name="serviceType"
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
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

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </section>
    </Suspense>
  );
}
