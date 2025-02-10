import Button from "@/components/Button";
import { articles } from "@/constants";
import Image from "next/image";

export default function Blog() {
  return (
    <section className="container mx-auto px-4 py-12 my-16">
      {/* Mini Hero Section */}
      <div className="bg-gradient-to-r from-[#0E253F] to-[#1B365D] rounded-lg p-8 text-white mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Blog</h2>
        <p className="text-lg leading-8">
          Stay updated with the latest news, tips, and updates from Prestige Drive. Check back regularly for new posts!
        </p>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Image
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <Button
                href={`/blog/${article.id}`}
                variant="primary"
              >
                Read More
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}