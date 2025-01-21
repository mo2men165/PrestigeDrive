import { allianz, axa, Car, electric, enterprise, family, longterm, luxury, suv, weekend } from "@/public/assets";
import { FaShieldAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHandsHelping, FaRocket } from 'react-icons/fa';
import { GiProgression } from "react-icons/gi";


export const carsData = [
  {
    id: '1', 
    image: Car, 
    title: 'Mercedes-Benz S-Class',
    price: 120,
    features: ['Automatic', '4 Seats', 'Luxury Interior', 'GPS', 'Chauffeur Service Available'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '15,000 miles',
    year: 2022,
    transmission: 'Automatic',
    availability: [], 
  },
  {
    id: '2', 
    image: Car,
    title: 'BMW 7 Series',
    price: 110,
    features: ['Automatic', '4 Seats', 'Premium Sound', 'GPS', 'Panoramic Sunroof'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '12,000 miles',
    year: 2021,
    transmission: 'Automatic',
    availability: [], 
  },
  {
    id: '3', 
    image: Car,
    title: 'Audi A8',
    price: 100,
    features: ['Automatic', '4 Seats', 'Luxury Interior', 'GPS', 'Heated Seats'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '10,000 miles',
    year: 2020,
    transmission: 'Automatic',
    availability: [], 
  },
  {
    id: '4', 
    image: Car,
    title: 'Mercedes-Benz A-Class',
    price: 80,
    features: ['Automatic', '5 Seats', 'Premium Interior', 'GPS', 'AppleCarlay'],
    type: 'Hatchback',
    fuelType: 'Petrol',
    mileage: '8,000 miles',
    year: 2023,
    transmission: 'Automatic',
    availability: [], 
  },
  {
    id: '5', 
    image: Car, 
    title: 'Tesla Model S',
    price: 130,
    features: ['Automatic', '5 Seats', 'Electric', 'GPS', 'Autopilot'],
    type: 'Electric',
    fuelType: 'Electric',
    mileage: '5,000 miles',
    year: 2023,
    transmission: 'Automatic',
    availability: [], 
  },
  {
    id: '6', 
    image: Car,
    title: 'Range Rover Sport',
    price: 150,
    features: ['Automatic', '5 Seats', 'SUV', 'GPS', 'All-Wheel Drive'],
    type: 'SUV',
    fuelType: 'Diesel',
    mileage: '20,000 miles',
    year: 2021,
    transmission: 'Automatic',
    availability: [], 
  },
].map((car) => ({
  ...car,
  href: `/cars/${car.id}`, 
}));

  export const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Our Fleet' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  export const deals = [
    {
      id: 1,
      image: weekend,
      title: 'Weekend Special',
      description: 'Get 20% off on all weekend rentals. Limited time only!',
      ctaText: 'Book Now',
      ctaLink: '#',
    },
    {
      id: 2,
      image: longterm,
      title: 'Long-Term Rental',
      description: 'Rent for a month and get 30% off. Perfect for long trips!',
      ctaText: 'Book Now',
      ctaLink: '#',
    },
    {
      id: 3,
      image: family,
      title: 'Family Package',
      description: 'Special rates for family-sized vehicles. Travel together!',
      ctaText: 'Book Now',
      ctaLink: '#',
    },
  ];

  export const features = [
    {
      id: 1,
      icon: FaShieldAlt, // Icon for security and reliability
      title: "Premium Fleet",
      description: "Choose from our exclusive collection of luxury and high-performance vehicles, meticulously maintained for your comfort and safety.",
    },
    {
      id: 2,
      icon: FaHandsHelping, // Icon for customer service
      title: "Personalized Service",
      description: "Our dedicated team is here to provide tailored recommendations and ensure a seamless rental experience from start to finish.",
    },
    {
      id: 3,
      icon: FaRocket, // Icon for speed and efficiency
      title: "Fast & Flexible Rentals",
      description: "Enjoy quick and hassle-free bookings, with flexible pickup and drop-off options to suit your schedule.",
    },
    {
      id: 4,
      icon: GiProgression, // Icon for innovation and convenience
      title: "Luxury Redefined",
      description: "Experience the ultimate in comfort and style with our state-of-the-art vehicles and premium amenities.",
    },
  ];

  export const testimonials = [
    {
      id: 1,
      quote: "Renting a car was seamless and the service was excellent. Highly recommend!",
      name: "John Doe",
      date: "2023-10-01",
    },
    {
      id: 2,
      quote: "The car was in perfect condition and the pickup process was quick and easy.",
      name: "Jane Smith",
      date: "2023-09-25",
    },
    {
      id: 3,
      quote: "Great prices and friendly staff. Will definitely rent from them again!",
      name: "Alice Johnson",
      date: "2023-09-20",
    },
    {
      id: 4,
      quote: "Smooth booking process and the car was exactly as described.",
      name: "Bob Brown",
      date: "2023-09-15",
    },
    {
      id: 5,
      quote: "Amazing experience! The car was clean and the staff was very helpful.",
      name: "Charlie Davis",
      date: "2023-09-10",
    },
    {
      id: 6,
      quote: "Best car rental service I've ever used. Highly satisfied!",
      name: "Eve White",
      date: "2023-09-05",
    },
  ];

  export const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];
  
  export const services = [
    { name: 'Luxury Car Rentals', href: '/services/luxury' },
    { name: 'Long-Term Rentals', href: '/services/long-term' },
    { name: 'Chauffeur Services', href: '/services/chauffeur' },
    { name: 'Corporate Rentals', href: '/services/corporate' },
  ];
  
  export const contactInfo = [
    { label: 'Address', value: '123 CarRental Street, Brighton, UK' },
    { label: 'Phone', value: '+44 123 456 789' },
    { label: 'Email', value: 'info@carrental.com' },
  ];
  
  export const socialMedia = [
    { icon: FaFacebook, href: 'https://facebook.com' },
    { icon: FaTwitter, href: 'https://twitter.com' },
    { icon: FaInstagram, href: 'https://instagram.com' },
    { icon: FaLinkedin, href: 'https://linkedin.com' },
  ];
  
  export const categories = [
    {
      id: 1,
      image: luxury,
      title: 'Luxury Cars',
      description: 'Experience the pinnacle of comfort and performance with our selection of luxury vehicles, designed for those who demand the best.',
      href: '/cars',
    },
    {
      id: 2,
      image: suv,
      title: 'SUVs',
      description: 'Explore our range of robust and versatile SUVs, perfect for family adventures and off-road journeys.',
      href: '/cars',
    },
    {
      id: 3,
      image: electric,
      title: 'Electric Vehicles',
      description: 'Discover eco-friendly and innovative electric vehicles that combine sustainability with cutting-edge technology.',
      href: '/cars',
    },
  ];

    export const faqs = [
      {
        id: '1',
        question: 'What documents do I need to rent a car?',
        answer: 'You need a valid driver’s license, a credit card, and proof of insurance.',
      },
      {
        id: '2',
        question: 'Can I cancel or modify my booking?',
        answer: 'Yes, you can cancel or modify your booking up to 24 hours before pickup.',
      },
      {
        id: '3',
        question: 'What is the minimum age to rent a car?',
        answer: 'The minimum age to rent a car is typically 21 years old, but it may vary by location and rental company.',
      },
      {
        id: '4',
        question: 'Is there a mileage limit on rental cars?',
        answer: 'Some rental companies have mileage limits, while others offer unlimited mileage. Check the terms and conditions of your rental agreement.',
      },
      {
        id: '5',
        question: 'Can I add an additional driver to my rental?',
        answer: 'Yes, you can usually add an additional driver for an extra fee. Both drivers must meet the rental company’s requirements.',
      },
    ];

    export const partners = [
      { id: 1, logo: axa},
      { id: 2, logo: allianz },
      { id: 3, logo: enterprise},
    ];