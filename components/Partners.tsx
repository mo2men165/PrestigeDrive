import { partners } from "@/constants";
import Image from "next/image";

  
  const Partners = () => {
    return (
      <section className=" mx-auto px-4 py-12">
        <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
          Our Partners
        </h2>
        <div className="flex justify-center gap-8">
          {partners.map((partner) => (
            <Image
              key={partner.id}
              src={partner.logo}
              alt={`Partner ${partner.id}`}
              width={150}
              height={150}
              className=""
            />
          ))}
        </div>
      </section>
    );
  };

  export default Partners;