import Button from "./Button";

const CTABanner = () => {
  return (
    <section className="relative h-[300px] flex items-center overflow-hidden my-16 rounded-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-[#10131A] opacity-70"></div>

      <div className="relative mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-4">
          Ready to Hit the Road?
        </h2>
        <p className="text-lg md:text-xl font-serif text-white mb-8">
          Book your dream car today and enjoy a seamless rental experience.
        </p>
        <Button variant="primary" href="/cars">
          Reserve Now
        </Button>
      </div>
    </section>
  );
};

export default CTABanner;