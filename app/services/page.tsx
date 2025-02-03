'use client';

import { motion } from 'framer-motion'; // Import Framer Motion
import CTABanner from '@/components/CTABanner'; // Import your CTABanner component
import Image from 'next/image';
import { carrental, chauffeur, corporate, event } from '@/public/assets';
import Button from '@/components/Button';

// Animation variants for Framer Motion
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function OurServices() {
  return (
    <section className="container mx-auto py-12 my-16">
      {/* Centered Header */}
      <div className="bg-gradient-to-r from-purple-950 to-purple-700 rounded-lg p-8 text-white mb-12">
      <motion.h2
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our Services
      </motion.h2>
        <p className="text-lg leading-8">
          See our wide range of services below
        </p>
      </div>      

      {/* Section 1: Image on the left, text on the right */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={carrental} // Replace with your image path
            alt="Car Rentals"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Car Rentals</h2>
          <p className="text-lg leading-8 mb-4">
            Our car rental service offers a wide range of vehicles to suit every need, from compact cars for city driving to luxury vehicles for special occasions. Whether you're traveling for business or pleasure, we have the perfect car for you.
          </p>
          <p className="text-lg leading-8 mb-4">
            We pride ourselves on providing affordable rates without compromising on quality. Our fleet is regularly maintained to ensure your safety and comfort. With flexible rental periods and convenient pickup locations, renting a car has never been easier.
          </p>
          <p className="text-lg leading-8 mb-6">
            Additionally, we offer optional add-ons such as GPS navigation, child seats, and insurance coverage to make your journey as smooth as possible. Experience the freedom of the open road with our reliable car rental service.
          </p>
          <Button variant='primary' href={`/cars`}>
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Section 2: Image on the right, text on the left */}
      <motion.div
        className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={chauffeur} // Replace with your image path
            alt="Chauffeur Services"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Chauffeur Services</h2>
          <p className="text-lg leading-8 mb-4">
            Our chauffeur services provide a luxurious and stress-free way to travel. Whether you're heading to a business meeting, airport, or special event, our professional drivers will ensure you arrive in style and on time.
          </p>
          <p className="text-lg leading-8 mb-4">
            We offer a fleet of premium vehicles, including sedans, SUVs, and limousines, all driven by experienced and courteous chauffeurs. Our team is trained to prioritize your safety, comfort, and privacy at all times.
          </p>
          <p className="text-lg leading-8 mb-6">
            With 24/7 availability and personalized service, our chauffeur services are perfect for corporate clients, tourists, and anyone looking for a first-class travel experience. Sit back, relax, and let us take care of the driving.
          </p>
          <Button variant='primary' href={`/cars`}>
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Section 3: Image on the left, text on the right */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={event} // Replace with your image path
            alt="Event Rentals"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Event Rentals</h2>
          <p className="text-lg leading-8 mb-4">
            Make a lasting impression at your next event with our premium event rental services. From weddings and proms to corporate gatherings, we provide a range of luxury vehicles to suit your needs.
          </p>
          <p className="text-lg leading-8 mb-4">
            Our event rental packages include customizable options such as red carpet service, champagne toasts, and personalized decorations. We work closely with you to ensure every detail is perfect for your special occasion.
          </p>
          <p className="text-lg leading-8 mb-6">
            With a focus on elegance and reliability, our event rental services are designed to make your event unforgettable. Let us handle the transportation so you can focus on enjoying your celebration.
          </p>
          <Button variant='primary' href={`/cars`}>
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Section 4: Image on the right, text on the left */}
      <motion.div
        className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={corporate} // Replace with your image path
            alt="Corporate Services"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Corporate Services</h2>
          <p className="text-lg leading-8 mb-4">
            Our corporate services are tailored to meet the needs of businesses and professionals. We provide premium vehicles for executive travel, client meetings, and corporate events, ensuring a seamless and professional experience.
          </p>
          <p className="text-lg leading-8 mb-4">
            With a focus on punctuality and discretion, our corporate services are designed to enhance your business image. Our drivers are trained to handle high-profile clients and confidential travel arrangements with the utmost care.
          </p>
          <p className="text-lg leading-8 mb-6">
            We also offer long-term rental options and customized packages for businesses with ongoing transportation needs. Trust us to provide reliable and luxurious transportation solutions for your corporate requirements.
          </p>
          <Button variant='primary' href={`/cars`}>
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Render CTABanner component at the end */}
      <CTABanner />
    </section>
  );
}