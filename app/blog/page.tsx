// app/blog/page.tsx
export default function Blog() {
    return (
      <section className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
        <p className="text-lg leading-8">
          Stay updated with the latest news, tips, and updates from Prestige Drive. Check back regularly for new posts!
        </p>
        <ul className="space-y-4 mt-6">
          <li>
            <a href="#" className="text-primary font-semibold hover:underline">
              How to Choose the Perfect Rental Car for Your Trip
            </a>
          </li>
          <li>
            <a href="#" className="text-primary font-semibold hover:underline">
              Top 5 Destinations to Explore in Brighton with a Rental Car
            </a>
          </li>
          <li>
            <a href="#" className="text-primary font-semibold hover:underline">
              Benefits of Using Prestige Drive for Your Chauffeur Needs
            </a>
          </li>
        </ul>
      </section>
    );
  }
  