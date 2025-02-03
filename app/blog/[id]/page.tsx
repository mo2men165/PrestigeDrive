  'use client';
  import { useParams } from 'next/navigation';
  import Image from 'next/image';
  import { articles } from '@/constants';

  export default function BlogPost() {
    const { id } = useParams();
    const article = articles.find((article) => article.id === id);

    if (!article) {
      return <p className="text-center text-red-500 text-lg">Article not found.</p>;
    }

    return (
      <div className="container mx-auto px-4 py-10 md:px-10 my-16">
        {/* Article Title */}
        <h1 className="text-purple-950 text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>

        {/* Article Image */}
        <Image
        src={article.image}
        alt={article.title}
        width={1200} // Set appropriate width
        height={800} // Set appropriate height
        quality={90} // Increase quality for better resolution
        sizes="(max-width: 768px) 100vw, 50vw" // Responsive image sizes
        className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
      />


        {/* Article Introduction */}
        <p className="text-black text-lg leading-relaxed mb-8">{article.introduction}</p>

        {/* Article Sections */}
        <div className="space-y-8">
          {article.sections.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              {/* Section Header */}
              <h2 className="text-purple-950 text-2xl font-semibold mb-4">{section.header}</h2>

              {/* Section Subtext */}
              <p className="text-black text-lg leading-relaxed mb-4">{section.subtext}</p>

              {/* Bullet Points (if they exist) */}
              {section.bulletPoints && (
                <ul className="list-disc list-inside text-black text-lg leading-relaxed">
                  {section.bulletPoints.map((point, idx) => (
                    <li key={idx} className="mb-2">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Article Conclusion */}
        <div className="mt-8">
          <p className="text-black text-lg leading-relaxed">{article.conclusion}</p>
        </div>
      </div>
    );
  }