import { articles } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPreview() {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">
          Insights &amp; Tips
        </p>
        <h2 className="text-3xl font-bold text-gray-900">
          Latest from Our Blog
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(0, 3).map((article) => (
          <div
            key={article.id}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{article.description}</p>
              <Link
                href={`/blog/${article.id}`}
                className="text-sm font-semibold text-primary hover:text-secondary transition-colors duration-200"
              >
                Read More &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-block px-8 py-3.5 border-2 border-primary text-primary font-semibold rounded-lg text-sm hover:bg-primary hover:text-white transition-all duration-300"
        >
          View All Articles
        </Link>
      </div>
    </section>
  );
}
