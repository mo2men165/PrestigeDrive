import Image from "next/image";
import Button from "./Button";
import { categories } from "@/constants";

const PopularCategories = () => {
  return (
    <section className="mx-auto px-4 py-12">
      <h2 className="text-4xl font-sans font-bold text-center uppercase mb-6">
        Popular Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-neutral rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <Image
              src={category.image}
              alt={category.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-secondary mb-2">
                {category.title}
              </h3>
              {/* Add the description here */}
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>
              <Button variant="primary" href={category.href}>
                Explore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;