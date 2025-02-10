'use client';

import { useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';
import { locations } from '@/constants';
import emailjs from 'emailjs-com';


const serviceTypes = [
  { id: 'chauffeur-services', name: 'Chauffeur Services' },
  { id: 'event-rentals', name: 'Event Rentals' },
  { id: 'corporate-services', name: 'Corporate Services' },
];

// Validation schema
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
      // Send email to customer
      await emailjs.send(
        'service_lajllhr',
        'template_1fgx54n',
        emailParams,
        'JNKdBh4-SqH_asdv7' // Replace with your actual EmailJS public key
      );

      // Send email to owner
      await emailjs.send(
        'service_lajllhr',
        'template_e5rw3mj',
        emailParams,
        'JNKdBh4-SqH_asdv7'
      );

      // Simulate form submission
      setTimeout(() => {
        setIsLoading(false);
        setConfirmationMessage(
          `Hi ${values.name}, thanks for booking with Prestige Drive! We have received your booking for ${serviceName}. Your pickup will be from ${values.pickupLocation} on ${values.pickupDate} at ${values.pickupTime}, and your dropoff will be at ${values.dropoffLocation} on ${values.dropoffDate} at ${values.dropoffTime}. You will receive a confirmation email of your request and one of our team members will call you to confirm the booking.`
        );

        console.log('Email Params:', emailParams);
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsLoading(false);
      setConfirmationMessage('An error occurred while submitting your booking. Please try again.');
    }
  };

const service = serviceTypes.find((service) => service.id === defaultServiceType);
const serviceName = service ? service.name : 'Unknown Service';


  return (
    <section className="container mx-auto py-12 my-16">
      {confirmationMessage && (
        <div className="bg-green-600 text-white p-4 rounded-md mb-8">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-primary mb-6">Reservation Form</h2>
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
          {({ values, setFieldValue }) => {
                // const service = serviceTypes.find((service) => service.id === values.serviceType);
                // const serviceName = service ? service.name : 'Unknown Service';
          return (
            <Form className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary">Who's Driving?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={(value) => setFieldValue('phone', value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary">Rental Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                      Pickup Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="pickupLocation"
                        name="pickupLocation"
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="" disabled>Choose pickup location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name} - {location.address}
                          </option>
                        ))}
                      </Field>
                      <FaMapMarkerAlt className="absolute right-5 top-3 text-gray-500" />
                    </div>
                    <ErrorMessage
                      name="pickupLocation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                      Pickup Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="date"
                      id="pickupDate"
                      name="pickupDate"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage
                      name="pickupDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">
                      Pickup Time <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="time"
                      id="pickupTime"
                      name="pickupTime"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage
                      name="pickupTime"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                      Dropoff Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="dropoffLocation"
                        name="dropoffLocation"
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="" disabled>Choose dropoff location</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name} - {location.address}
                          </option>
                        ))}
                      </Field>
                      <FaMapMarkerAlt className="absolute right-5 top-3 text-gray-500" />
                    </div>
                    <ErrorMessage
                      name="dropoffLocation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="dropoffDate" className="block text-sm font-medium text-gray-700">
                      Dropoff Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="date"
                      id="dropoffDate"
                      name="dropoffDate"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage
                      name="dropoffDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="dropoffTime" className="block text-sm font-medium text-gray-700">
                      Dropoff Time <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="time"
                      id="dropoffTime"
                      name="dropoffTime"
                      className="w-full p-2 border rounded-lg"
                    />
                    <ErrorMessage
                      name="dropoffTime"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="serviceType"
                  name="serviceType"
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="" disabled>Select a service type</option>
                  {serviceTypes.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="serviceType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-white hover:text-primary hover:border-primary hover:border transition-all duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit Booking'}
              </button>
            </Form>
          )}}
        </Formik>
      </div>
    </section>
  );
}