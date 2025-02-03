'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import { carsData } from '@/constants';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import emailjs from 'emailjs-com';
import { pd } from '@/public/assets';


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
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const { id } = useParams();
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

  const calculateTotalPrice = (values: any) => {
    if (!values.pickupDate || !values.dropoffDate) {
      return { days: 0, basePrice: 0, vat: 0, chauffeurFee: 0, totalPrice: 0 };
    }

    const pickupDate = new Date(values.pickupDate);
    const dropoffDate = new Date(values.dropoffDate);

    if (isNaN(pickupDate.getTime()) || isNaN(dropoffDate.getTime())) {
      return { days: 0, basePrice: 0, vat: 0, chauffeurFee: 0, totalPrice: 0 };
    }

    const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = days * car.price;
    const vat = basePrice * 0.2;
    const chauffeurFee = values.chauffeurService ? 50 : 0;
    const totalPrice = basePrice + vat + chauffeurFee;

    return { days, basePrice, vat, chauffeurFee, totalPrice };
  };

  const imageURL = "https://ibb.co/gFFQkzzL"

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    const { totalPrice, basePrice, vat, chauffeurFee, days } = calculateTotalPrice(values);

    setTimeout(async () => {
        setIsLoading(false);
        setConfirmationMessage(
            `Hi ${values.name}, thanks for using Prestige Drive! We have received your order for the ${values.carTitle}. Your pickup will be from ${values.pickupLocation} on ${values.pickupDate} at ${values.pickupTime} and your dropoff will be from ${values.dropoffLocation} on ${values.dropoffDate} at ${values.dropoffTime}. Your total price is £${totalPrice}. You will receive a confirmation email shortly, and a call from one of our team members within the next 24 hours to confirm your booking.`
        );

        // Send the email with EmailJS
        try {
            const response = await emailjs.send(
                'service_r8i8v6g',      // Replace with your service ID
                'template_1fgx54n',     // Replace with your template ID
                {
                  name: values.name,
                  email: values.email,
                  carTitle: car.title,  
                  pickupLocation: values.pickupLocation,
                  pickupDate: values.pickupDate,
                  pickupTime: values.pickupTime,
                  dropoffLocation: values.dropoffLocation,
                  dropoffDate: values.dropoffDate,
                  dropoffTime: values.dropoffTime,
                  totalPrice: totalPrice,
                  basePrice,  // Match the placeholder in the template
                  additionalServices: chauffeurFee,  // Match the placeholder in the template
                  vat: vat,  // Pass VAT directly
                  imageURL,
                },
                'JNKdBh4-SqH_asdv7'      // Replace with your public key
            );

            const ownerEmail = await emailjs.send(
              'service_r8i8v6g',      // Replace with your service ID
              'template_e5rw3mj',     // Replace with your template ID
              {
                name: values.name,
                email: values.email,
                carTitle: car.title,  
                pickupLocation: values.pickupLocation,
                pickupDate: values.pickupDate,
                pickupTime: values.pickupTime,
                dropoffLocation: values.dropoffLocation,
                dropoffDate: values.dropoffDate,
                dropoffTime: values.dropoffTime,
                totalPrice: totalPrice,
                basePrice,  // Match the placeholder in the template
                additionalServices: chauffeurFee,  // Match the placeholder in the template
                vat: vat,  // Pass VAT directly
                imageURL,
                mobile: values.phone,
                dob: values.dob,
              },
              'JNKdBh4-SqH_asdv7'      // Replace with your public key
          );

        } catch (error) {
            console.error('Error sending email', error);
        }

        
        
        // resetForm(); 
    }, 2000);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-purple-50 p-8 rounded-xl shadow-sm">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">{car.title}</h2>
          <p className="text-lg text-gray-700 mb-6">{car.description}</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-purple-500 font-semibold">Price:</span>
              <span className="text-gray-700">£{car.price} / day</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">Booking Form</h2>
          <Formik
            initialValues={{
              name: '',
              phone: '',
              email: '',
              dob: '',
              pickupDate: '',
              dropoffDate: '',
              pickupLocation: '',
              dropoffLocation: '',
              pickupTime: '',
              dropoffTime: '',
              chauffeurService: false,
            }}
            validationSchema={BookingSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              const { totalPrice, basePrice, vat, chauffeurFee, days } = calculateTotalPrice(values);
              return (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2 border rounded-lg"
                      value={values.name || ''}
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
                      value={values.email || ''}
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
                      value={values.dob || ''}
                    />
                    <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                      Pickup Location <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="pickupLocation"
                      name="pickupLocation"
                      className="w-full p-2 border rounded-lg"
                      value={values.pickupLocation || ''}
                    >
                      <option value="" disabled>
                Choose pickup location
              </option>
              <option value="Brighton Airport">Brighton Airport</option>
              <option value="Heathrow Airport">Heathrow Airport</option>
                    </Field>
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
                      value={values.pickupDate || ''}
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
                      value={values.pickupTime || ''}
                    />
                    <ErrorMessage
                      name="pickupTime"
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
                      value={values.dropoffDate || ''}
                      min={values.pickupDate}
                    />
                    <ErrorMessage
                      name="dropoffDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  

                  <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                      Dropoff Location <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="dropoffLocation"
                      name="dropoffLocation"
                      className="w-full p-2 border rounded-lg"
                      value={values.dropoffLocation || ''}
                    >
                      <option value="" disabled>
                Choose dropoff location
              </option>
              <option value="Brighton Airport">Brighton Airport</option>
              <option value="Heathrow Airport">Heathrow Airport</option>
                    </Field>
                    <ErrorMessage
                      name="dropoffLocation"
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
                      value={values.dropoffTime || ''}
                    />
                    <ErrorMessage
                      name="dropoffTime"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      id="chauffeurService"
                      name="chauffeurService"
                      className="h-4 w-4"
                    />
                    <label htmlFor="chauffeurService" className="text-sm text-gray-700">
                      Add Chauffeur Service (£50)
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-purple-900">
                      Total Price: £{totalPrice.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openModal(values)}
                      className="text-purple-600 hover:text-purple-700 underline"
                    >
                      View Breakdown
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm text-white" />
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {/* Modal for Price Breakdown */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Price Breakdown"
      >
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Price Breakdown</h2>
        {modalValues && (
          <div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Days: </span>
                <span>{calculateTotalPrice(modalValues).days}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>£{calculateTotalPrice(modalValues).basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (20%):</span>
                <span>£{calculateTotalPrice(modalValues).vat}</span>
              </div>
              <div className="flex justify-between">
                <span>Chauffeur Service Fee:</span>
                <span>£{calculateTotalPrice(modalValues).chauffeurFee}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>£{calculateTotalPrice(modalValues).totalPrice}</span>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModal}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
}