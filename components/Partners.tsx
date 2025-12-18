'use client';
import { partners } from "@/constants";
import Image from "next/image";
import { motion } from 'framer-motion';

const Partners = () => {

  const variants = {
    hidden: { opacity: 0, x: -100 }, // Start from the left
    visible: { opacity: 1, x: 0 }, // Move to the original position
  };

  return (
    <section className="mx-auto px-4 py-12">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        Our Partners
      </h2>
      <div className="flex justify-center md:gap-24 flex-col md:flex-row gap-10 items-center flex-wrap">
        {partners.map((partner, index) => (
          <motion.div 
          key={partner.id} 
          variants={variants}
          className="flex items-center justify-center w-40 h-40"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: index * 0.5 }} 
           >
            <Image
              src={partner.logo}
              alt={`Partner ${partner.id}`}
              width={partner.width}
              height={partner.height} 
              className= {` object-contain h-full ${partner.size === "small" ? "w-[75%]" : "w-full"} `}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Partners;