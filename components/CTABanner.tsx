import Link from 'next/link';

const CTABanner = () => {
  return (
    <section className="relative h-[320px] flex items-center overflow-hidden my-6 rounded-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E253F]/90 to-[#0E253F]/70" />

      <div className="relative mx-auto text-center px-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4">
          Start Your Journey
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Ready to Hit the Road?
        </h2>
        <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed">
          Book your dream car today and enjoy a seamless, premium rental experience from start to finish.
        </p>
        <Link
          href="/cars"
          className="inline-block px-10 py-4 bg-white text-primary font-semibold rounded-lg text-base hover:bg-secondary hover:text-white transition-all duration-300"
        >
          Reserve Now
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;
