import { partners } from "@/constants";
import Image from "next/image";

const Partners = () => {
  return (
    <section className="mx-auto px-4 py-12">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        Our Partners
      </h2>
      <div className="flex justify-center gap-8 flex-wrap">
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center justify-center w-40 h-40">
            <Image
              src={partner.logo}
              alt={`Partner ${partner.id}`}
              width={250} // Set a base width
              height={150} // Set a base height
              className="object-contain w-full h-full" // Maintain aspect ratio
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;