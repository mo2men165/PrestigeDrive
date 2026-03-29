import Image from 'next/image';
import { articles } from '@/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://elitedrive4u.co.uk/blog/${id}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `https://elitedrive4u.co.uk/blog/${id}`,
    },
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export default async function BlogPost({ params }: Props) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 my-16 max-w-4xl">
      <Link
        href="/blog"
        className="text-sm text-gray-400 hover:text-primary transition-colors mb-8 inline-block"
      >
        &larr; Back to Blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {article.title}
      </h1>

      <div className="rounded-2xl overflow-hidden mb-10 border border-gray-100 shadow-sm">
        <Image
          src={article.image}
          alt={article.title}
          width={1200}
          height={600}
          quality={90}
          sizes="(max-width: 768px) 100vw, 800px"
          className="w-full h-80 md:h-96 object-cover"
        />
      </div>

      <p className="text-lg text-gray-600 leading-relaxed mb-10">{article.introduction}</p>

      <div className="space-y-8">
        {article.sections.map((section, index) => (
          <section
            key={index}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.header}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{section.subtext}</p>

            {section.bulletPoints && (
              <ul className="space-y-2">
                {section.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 rounded-2xl border border-gray-100 p-8">
        <p className="text-gray-600 leading-relaxed">{article.conclusion}</p>
      </div>
    </article>
  );
}
