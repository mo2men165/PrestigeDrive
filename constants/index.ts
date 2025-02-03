import { allianz, axa, bmw5, Car, electric, mercedesCclass, enterprise, family, longterm, luxury, mercedesAclass, rangerover, suv, tesla, weekend, volvo, blog1, blog2, blog3 } from "@/public/assets";
import { FaShieldAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHandsHelping, FaRocket } from 'react-icons/fa';
import { GiProgression } from "react-icons/gi";


export const carsData = [
  {
    id: 'bmw-5-series',
    image: bmw5,
    title: 'BMW 5 Series',
    features: ['Automatic', '4 Seats', 'Luxury Interior', 'GPS', 'Chauffeur Service Available'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '15,000 miles',
    year: 2023,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The BMW 5 Series combines luxury and performance with its sleek design, advanced technology, and powerful engine. Perfect for both business and leisure, this sedan offers a comfortable and dynamic driving experience.',
  },
  {
    id: 'mercedes-a-class',
    image: mercedesAclass,
    title: 'Mercedes-Benz A-Class',
    features: ['Automatic', '4 Seats', 'Luxury Interior', 'GPS', 'Heated Seats'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '10,000 miles',
    year: 2020,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The Mercedes-Benz A-Class is a compact luxury sedan that offers a perfect blend of style, comfort, and cutting-edge technology. With its premium interior and advanced features, it’s ideal for urban driving.',
  },
  {
    id: 'mercedes-c-class',
    image: mercedesCclass,
    title: 'Mercedes-Benz C-Class',
    features: ['Automatic', '5 Seats', 'Premium Interior', 'GPS', 'Apple CarPlay'],
    type: 'Sedan',
    fuelType: 'Petrol',
    mileage: '8,000 miles',
    year: 2023,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The Mercedes-Benz C-Class is a mid-size luxury sedan that delivers a perfect balance of elegance and performance. With its refined interior and state-of-the-art features, it’s a top choice for discerning drivers.',
  },
  {
    id: 'tesla-model-s',
    image: tesla,
    title: 'Tesla Model S',
    features: ['Automatic', '5 Seats', 'Electric', 'GPS', 'Autopilot'],
    type: 'Sedan',
    fuelType: 'Electric',
    mileage: '5,000 miles',
    year: 2023,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The Tesla Model S is a fully electric luxury sedan that redefines performance and innovation. With its long-range battery, autopilot capabilities, and minimalist design, it’s the future of driving.',
  },
  {
    id: 'range-rover-sport',
    image: rangerover,
    title: 'Land Rover Range Rover Sport',
    features: ['Automatic', '5 Seats', 'SUV', 'GPS', 'All-Wheel Drive'],
    type: 'SUV',
    fuelType: 'Diesel',
    mileage: '20,000 miles',
    year: 2021,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The Land Rover Range Rover Sport is a premium SUV that combines rugged capability with luxury. With its powerful engine, advanced off-road features, and spacious interior, it’s perfect for any adventure.',
  },
  {
    id: 'volvo-xc90',
    image: volvo,
    title: 'Volvo XC90',
    features: ['Automatic', '7 Seats', 'SUV', 'GPS', 'All-Wheel Drive'],
    type: 'SUV',
    fuelType: 'Diesel',
    mileage: '20,000 miles',
    year: 2021,
    transmission: 'Automatic',
    availability: [],
    price: 120,
    description: 'The Volvo XC90 is a luxurious and spacious SUV that prioritizes safety, comfort, and sustainability. With its Scandinavian design and advanced technology, it’s ideal for families and long journeys.',
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
    { label: 'Address', value: '41 Westfield Crescent, Brighton, UK. BN1 8JB' },
    { label: 'Phone', value: '+44 (0) 777 777 7777' },
    { label: 'Email', value: 'info@prestigedrive.com' },
  ];
  
  export const socialMedia = [
    { icon: FaFacebook, href: '/' },
    { icon: FaTwitter, href: '/' },
    { icon: FaInstagram, href: '/' },
    { icon: FaLinkedin, href: '/' },
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

    export const articles = [
      {
        id: "uk-driving-laws",
        title: "Understanding the UK's Driving Laws for Tourists",
        description: "A comprehensive guide to help tourists navigate UK roads safely and legally. Learn about speed limits, parking rules, and more.",
        image: blog1,
        introduction: "Driving in the United Kingdom can be a new experience for tourists, especially those accustomed to driving on the right-hand side of the road. To ensure a safe and hassle-free trip, it's crucial to familiarize yourself with the UK's driving regulations. This guide will cover essential laws and tips to help you navigate UK roads with confidence.",
        sections: [
          {
            header: "Driving on the Left",
            subtext: "One of the most notable differences for tourists is that the UK drives on the left-hand side of the road. This means:",
            bulletPoints: [
              "Overtaking is done on the right.",
              "Roundabouts circulate clockwise.",
              "The right lane on motorways is used for overtaking."
            ]
          },
          {
            header: "Speed Limits",
            subtext: "Speed limits in the UK vary depending on the type of road and vehicle. The standard limits are:",
            bulletPoints: [
              "30 mph (48 km/h) in urban areas.",
              "60 mph (96 km/h) on single carriageways.",
              "70 mph (112 km/h) on motorways and dual carriageways."
            ]
          },
          {
            header: "Seatbelt and Child Seat Laws",
            subtext: "Seatbelts are mandatory for all passengers, and children must use an appropriate car seat until they are 12 years old or 135 cm tall."
          },
          {
            header: "Driving License Requirements",
            subtext: "Tourists can drive in the UK using a valid driving license from their home country if visiting for less than 12 months. An International Driving Permit (IDP) may be required for licenses not written in English."
          },
          {
            header: "Alcohol Limits and DUI Laws",
            subtext: "The legal blood alcohol limit varies:",
            bulletPoints: [
              "80 mg per 100 ml of blood in England, Wales, and Northern Ireland.",
              "50 mg per 100 ml of blood in Scotland."
            ]
          },
          {
            header: "Parking Rules",
            subtext: "Pay attention to parking restrictions to avoid fines:",
            bulletPoints: [
              "Single yellow lines mean limited parking.",
              "Double yellow lines mean no parking.",
              "Controlled parking zones require permits or payments."
            ]
          },
          {
            header: "Mobile Phone Use",
            subtext: "Using a mobile phone while driving is strictly prohibited unless hands-free. Violations result in heavy fines and penalty points."
          },
          {
            header: "Emergency Numbers",
            subtext: "In case of an accident or emergency, dial 999 or 112 for police, ambulance, or fire services."
          }
        ],
        conclusion: "By understanding these essential UK driving laws, tourists can ensure a safe and enjoyable driving experience while exploring the country."
      },
      {
        id: "comparing-car-rental-insurance",
        title: "Comparing Car Rental Insurance Options: What You Need to Know",
        description: "A detailed guide to understanding and comparing car rental insurance options. Make the best choice for your trip with confidence.",
        image: blog2,
        introduction: "Renting a car can be a convenient way to explore new destinations, but understanding the insurance options available is crucial to avoid unexpected costs. This guide will help you compare different types of car rental insurance, so you can make an informed decision that suits your needs and budget.",
        sections: [
          {
            header: "Collision Damage Waiver (CDW)",
            subtext: "A CDW covers damage to the rental car in case of an accident. Key points to consider:",
            bulletPoints: [
              "Often comes with an excess fee that you must pay before the coverage kicks in.",
              "May not cover theft or damage to tires and windows.",
              "Check if your credit card or personal auto insurance already provides similar coverage."
            ]
          },
          {
            header: "Theft Protection",
            subtext: "This covers the cost of the rental car if it is stolen. Important details include:",
            bulletPoints: [
              "Usually included in comprehensive insurance packages.",
              "May have an excess fee, so review the terms carefully.",
              "Ensure you report the theft to the police and rental company immediately."
            ]
          },
          {
            header: "Third-Party Liability Insurance",
            subtext: "This covers damage or injury caused to others in an accident. Key considerations:",
            bulletPoints: [
              "Mandatory in most countries, but coverage limits vary.",
              "Check if your personal auto insurance or credit card offers additional coverage.",
              "Consider purchasing supplemental liability insurance for higher coverage limits."
            ]
          },
          {
            header: "Personal Accident Insurance",
            subtext: "This covers medical expenses for you and your passengers in case of an accident. Things to know:",
            bulletPoints: [
              "Often overlaps with your personal health or travel insurance.",
              "Review your existing policies before purchasing.",
              "May include coverage for accidental death or disability."
            ]
          },
          {
            header: "Roadside Assistance",
            subtext: "This provides help in case of breakdowns, flat tires, or lockouts. Key points:",
            bulletPoints: [
              "Check if your rental company offers this as part of their insurance package.",
              "Some credit cards and auto clubs include roadside assistance.",
              "Review the coverage limits and response times."
            ]
          },
          {
            header: "Excess Insurance",
            subtext: "This reduces or eliminates the excess fee you pay in case of a claim. Important details:",
            bulletPoints: [
              "Can be purchased separately or as part of a comprehensive package.",
              "Compare prices from third-party providers, as they may be cheaper than the rental company.",
              "Ensure the policy covers all potential excess fees."
            ]
          }
        ],
        conclusion: "By comparing car rental insurance options and understanding your existing coverage, you can save money and ensure peace of mind during your trip. Always read the fine print and ask questions before making a decision."
      },
      {
        id: "tips-for-first-time-renters",
        title: "Tips for First-Time Renters: A Beginner's Guide to Car Rentals",
        description: "Essential tips and advice for first-time car renters. Ensure a smooth and stress-free rental experience with this beginner's guide.",
        image: blog3,
        introduction: "Renting a car for the first time can be overwhelming, but with the right preparation, it can be a seamless experience. This guide provides practical tips to help first-time renters navigate the process, from choosing the right vehicle to understanding rental agreements.",
        sections: [
          {
            header: "Choose the Right Vehicle",
            subtext: "Selecting the right car for your needs is crucial. Consider the following:",
            bulletPoints: [
              "Size: Choose a car that fits your group and luggage comfortably.",
              "Fuel efficiency: Opt for a fuel-efficient model to save on gas costs.",
              "Features: Consider extras like GPS, child seats, or a sunroof if needed."
            ]
          },
          {
            header: "Understand Rental Agreements",
            subtext: "Read the rental agreement carefully to avoid surprises. Key points to look for:",
            bulletPoints: [
              "Mileage limits: Check if there are restrictions on how far you can drive.",
              "Fuel policy: Understand whether you need to return the car with a full tank.",
              "Additional fees: Look for charges like late return fees or extra driver fees."
            ]
          },
          {
            header: "Inspect the Car Before Driving",
            subtext: "Always inspect the rental car for damage before driving off. Steps to follow:",
            bulletPoints: [
              "Check the exterior for scratches, dents, or other damage.",
              "Inspect the interior for cleanliness and functionality.",
              "Take photos or videos as proof of the car's condition."
            ]
          },
          {
            header: "Know Your Insurance Options",
            subtext: "Insurance is a critical part of renting a car. Things to consider:",
            bulletPoints: [
              "Check if your personal auto insurance or credit card covers rentals.",
              "Understand the rental company's insurance options and costs.",
              "Consider purchasing excess insurance to reduce out-of-pocket expenses."
            ]
          },
          {
            header: "Plan Your Route",
            subtext: "Planning your route in advance can save time and stress. Tips include:",
            bulletPoints: [
              "Use a GPS or map app to familiarize yourself with the area.",
              "Check for toll roads and ensure you have the necessary payment methods.",
              "Plan rest stops and fuel stations along the way."
            ]
          },
          {
            header: "Return the Car on Time",
            subtext: "Returning the car late can result in additional fees. Tips to avoid this:",
            bulletPoints: [
              "Set reminders for the return date and time.",
              "Allow extra time for traffic or unexpected delays.",
              "Fill up the tank before returning if required."
            ]
          }
        ],
        conclusion: "By following these tips, first-time renters can enjoy a hassle-free car rental experience. Preparation and knowledge are key to making the most of your rental and ensuring a smooth journey."
      }
    ];