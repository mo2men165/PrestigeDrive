'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { carsData, locations } from '@/constants';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Modal from 'react-modal';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useRentalData } from '@/app/contexts/RentalContext';
import { useSearchParams } from "next/navigation";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

const BookingSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  dob: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  pickupDate: Yup.date().required('Pickup date is required'),
  dropoffDate: Yup.date()
    .min(Yup.ref('pickupDate'), 'Dropoff date must be after pickup date')
    .required('Dropoff date is required'),
  pickupLocation: Yup.string().required('Pickup location is required'),
  dropoffLocation: Yup.string().required('Dropoff location is required'),
  pickupTime: Yup.string().required('Pickup time is required'),
  dropoffTime: Yup.string().required('Dropoff time is required'),
});

export default function BookingPage() {
  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    // Calculate price breakdown
    const { basePrice, vat, totalPrice, discountAmount, valueAfterDiscount, hasDiscount, valueBeforeDiscount, days } =
      calculateTotalPrice(values);

    // Update rental data in context
    setRentalData({
      ...rentalData,
      pickupDate: new Date(values.pickupDate),
      dropoffDate: new Date(values.dropoffDate),
      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      pickupTime: values.pickupTime,
      dropoffTime: values.dropoffTime,
      basePrice: basePrice ?? 0,
      vat: vat ?? 0,
      totalPrice: totalPrice ?? 0,
      discountAmount: discountAmount ?? 0,
      valueAfterDiscount: valueAfterDiscount ?? 0,
      hasDiscount: hasDiscount ?? false,
      valueBeforeDiscount: valueBeforeDiscount ?? 0,
      totalDays: days ?? 0,
      carMake: car?.title ?? '',
      name: values.name,
      email: values.email,
      phone: values.phone,
      dob: values.dob,
    });

    setTimeout(() => {
      setIsLoading(false);
      setConfirmationMessage(
        `Hi ${values.name}, thanks for using Prestige Drive! We have received your order for the ${car?.title}. Your pickup will be from ${values.pickupLocation} on ${values.pickupDate} at ${values.pickupTime} and your dropoff will be from ${values.dropoffLocation} on ${values.dropoffDate} at ${values.dropoffTime}. Your total price is £${totalPrice}. You will receive a confirmation email shortly, and a call from one of our team members within the next 24 hours to confirm your booking.`
      );
    }, 2000);
  };

  const searchParams = useSearchParams();
  const { rentalData, setRentalData } = useRentalData(); // Use the context
  console.log("Rental Data in BookingPage:", rentalData); // Debugging
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValues, setModalValues] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const car = carsData.find((car) => car.id === id);

  if (!car) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-semibold">Car not found.</h1>
        <p className="text-lg mt-4">Please wait.</p>
      </div>
    );
  }

  const initialValues = {
    name: '',
    phone: '',
    email: '',
    dob: '',
    pickupLocation: searchParams.get("pickupLocation") || "",
    dropoffLocation: searchParams.get("dropoffLocation") || "",
    pickupDate: searchParams.get("pickupDate") ? new Date(searchParams.get("pickupDate")!) : null,
    dropoffDate: searchParams.get("dropoffDate") ? new Date(searchParams.get("dropoffDate")!) : null,
    pickupTime: searchParams.get("pickupTime") || "12:30",
    dropoffTime: searchParams.get("dropoffTime") || "08:30",
  };

  console.log("Initial Values in BookingPage:", initialValues);

  const calculateTotalPrice = (values: any) => {
    if (!values.pickupDate || !values.dropoffDate) {
      return { days: 0, basePrice: 0, vat: 0, totalPrice: 0 };
    }

    const pickupDate = new Date(values.pickupDate);
    const dropoffDate = new Date(values.dropoffDate);

    if (isNaN(pickupDate.getTime()) || isNaN(dropoffDate.getTime())) {
      return { days: 0, basePrice: 0, vat: 0, totalPrice: 0 };
    }

    const days = Math.ceil(
      (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    let basePrice = days * car.price;
    const vat = basePrice * 0.2;
    let totalPrice = basePrice + vat;

    // Calculate discount details if rental is for 30+ days
    let valueBeforeDiscount = totalPrice;
    let discountAmount = 0;
    let valueAfterDiscount = totalPrice;

    if (days >= 30) {
      discountAmount = totalPrice * 0.3; // 30% discount
      valueAfterDiscount = totalPrice - discountAmount;
    }

    return {
      days,
      basePrice,
      vat,
      totalPrice: valueAfterDiscount, // Final price after discount
      valueBeforeDiscount,
      discountAmount,
      valueAfterDiscount,
      hasDiscount: days >= 30, // Flag to check if discount is applied
    };
  };

  const openModal = (values: any) => {
    setModalValues(values);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="container mx-auto py-12 my-16">
      {confirmationMessage && (
        <div className="bg-green-600 text-white p-4 rounded-md mb-8">
          <p>{confirmationMessage}</p>
        </div>
      )}

      {/* Car Details */}
      <div className="bg-purple-50 p-8 rounded-xl shadow-sm mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">{car.title}</h2>
        <p className="text-lg text-gray-700 mb-6">{car.description}</p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-primary font-semibold">Price:</span>
            <span className="text-gray-700">£{car.price} / day</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-primary mb-6">Reservation Form</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={BookingSchema}
          onSubmit={(values) => {
            handleSubmit(values);
            router.push(`/booking/${id}/plans`);
          }}
        >
          {({ values, setFieldValue }) => {
            const { totalPrice, days } = calculateTotalPrice(values);
            return (
              <Form className="space-y-6">
                {/* Who's Driving? Section */}
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

                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="date"
                        id="dob"
                        name="dob"
                        className="w-full p-2 border rounded-lg"
                      />
                      <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Rental Dates Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-primary">Rental Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Location */}
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

                    {/* Pickup Date */}
                    <div>
                      <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                        Pickup Date <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        className="w-full p-2 border rounded-lg"
                        value={values.pickupDate ? new Date(values.pickupDate).toISOString().split('T')[0] : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("pickupDate", e.target.value ? new Date(e.target.value) : null);
                        }}
                      />
                      <ErrorMessage
                        name="pickupDate"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Pickup Time */}
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

                    {/* Dropoff Location */}
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
                          value={values.dropoffLocation || values.pickupLocation} // Default to pickupLocation if empty
                        >
                          <option value="" disabled>
                            Choose dropoff location
                          </option>
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

                    {/* Dropoff Date */}
                    <div>
                      <label htmlFor="dropoffDate" className="block text-sm font-medium text-gray-700">
                        Dropoff Date <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="date"
                        id="dropoffDate"
                        name="dropoffDate"
                        className="w-full p-2 border rounded-lg"
                        value={values.dropoffDate ? new Date(values.dropoffDate).toISOString().split('T')[0] : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("dropoffDate", e.target.value ? new Date(e.target.value) : null);
                        }}
                      />
                      <ErrorMessage
                        name="dropoffDate"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Dropoff Time */}
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

                {/* Total Price and Continue Button */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">
                    Total Price: £{totalPrice.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => openModal(values)}
                    className="text-primary hover:text-primary underline"
                  >
                    View Breakdown
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-white hover:text-primary hover:border-primary hover:border transition-all duration-300 ease-in-out"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Pick Your Protection Plan'}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>

            {/* Breakdown Modal */}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              style={{
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  transform: 'translate(-50%, -50%)',
                  width: '600px', // Increased width
                  maxWidth: '90%', // Ensure it doesn't overflow on smaller screens
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f9fafb', // Light background
                  border: '1px solid #e5e7eb', // Subtle border
                },
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                },
              }}
              contentLabel="Price Breakdown"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">Price Breakdown</h2>
              {modalValues && (
                <div className="space-y-6">
                  {/* Rental Details Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">📅</span> Rental Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Date:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(modalValues.pickupDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Time:</span>
                        <span className="font-medium text-gray-800">
                          {modalValues.pickupTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dropoff Date:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(modalValues.dropoffDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dropoff Time:</span>
                        <span className="font-medium text-gray-800">
                          {modalValues.dropoffTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Rental Days:</span>
                        <span className="font-medium text-gray-800">
                          {calculateTotalPrice(modalValues).days}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">💵</span> Price Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium text-gray-800">
                          £{calculateTotalPrice(modalValues).basePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT (20%):</span>
                        <span className="font-medium text-gray-800">
                          £{calculateTotalPrice(modalValues).vat.toFixed(2)}
                        </span>
                      </div>
                      {calculateTotalPrice(modalValues).hasDiscount && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Value Before Discount:</span>
                            <span className="font-medium text-gray-800">
                              £{calculateTotalPrice(modalValues).valueBeforeDiscount?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount (30%):</span>
                            <span className="font-medium text-green-600">
                              -£{calculateTotalPrice(modalValues).discountAmount?.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            *Discount applied for renting 30+ days.
                          </div>
                        </>
                      )}
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-800 font-semibold">Total Price:</span>
                        <span className="font-bold text-primary text-lg">
                          £{calculateTotalPrice(modalValues).totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </Modal>
    </section>
  );
}