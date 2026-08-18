import React, { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    tagline: "E-Kart: Your Electronics Hub",
    title: "MODERN ELECTRONICS AT BEST PRICES",
    description:
      "Discover cutting-edge technology with unbeatable deals on smartphones, laptops, and more.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Shop Now",
    secondaryBtn: "View Deals",
  },
  {
    id: 2,
    tagline: "Exclusive Workstation Deals",
    title: "POWERFUL LAPTOPS & ACCESSORIES",
    description:
      "Upgrade your productivity with up to 40% off on premium ultra-books and gaming rigs.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Explore Laptops",
    secondaryBtn: "Top Offers",
  },
  {
    id: 3,
    tagline: "Limited Time Offers",
    title: "NEXT-GEN SMARTPHONES",
    description:
      "Experience ultra-fast 5G performance and stunning cameras at no-cost EMI options.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Buy Mobile",
    secondaryBtn: "See All",
  },
  {
    id: 4,
    tagline: "Immersive Sound Experience",
    title: "PREMIUM AUDIO & HEADPHONES",
    description:
      "Feel every beat with active noise-canceling wireless headphones and soundbars.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Explore Audio",
    secondaryBtn: "View Deals",
  },
  {
    id: 5,
    tagline: "Smart Living Starts Here",
    title: "NEXT-GEN SMARTWEAR & WATCHES",
    description:
      "Track your fitness, health metrics, and stay connected seamlessly on the go.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Shop Wearables",
    secondaryBtn: "Learn More",
  },

  // 6
  {
    id: 6,
    tagline: "Gaming Power Unleashed",
    title: "ULTIMATE GAMING SETUP",
    description:
      "Level up your gaming experience with powerful PCs, mechanical keyboards and premium gaming accessories.",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Shop Gaming",
    secondaryBtn: "View Deals",
  },

  // 7
  {
    id: 7,
    tagline: "Capture Every Moment",
    title: "PROFESSIONAL CAMERAS & GEAR",
    description:
      "Capture stunning photos and videos with professional cameras, lenses and photography accessories.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Explore Cameras",
    secondaryBtn: "Top Deals",
  },

  // 8
  {
    id: 8,
    tagline: "Entertainment Redefined",
    title: "SMART TVS & HOME CINEMA",
    description:
      "Transform your living room into a cinema with stunning 4K displays and immersive entertainment systems.",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Shop TVs",
    secondaryBtn: "View Offers",
  },

  // 10
  {
    id: 10,
    tagline: "Technology For Your Home",
    title: "SMART HOME DEVICES",
    description:
      "Make your home smarter with smart speakers, security devices, lighting and connected home technology.",
    image:
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1600&auto=format&fit=crop&q=80",
    primaryBtn: "Explore Smart Home",
    secondaryBtn: "View Collection",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[522px] w-full overflow-hidden rounded-xl shadow-2xl">
      {/* Background Images with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-center"
          />
          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
      ))}

      {/* Left Navigation Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black active:scale-90"
        aria-label="Previous Slide"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Overlay Content */}
      <div className="relative z-10 flex h-full items-center px-8 md:px-16">
        <div className="max-w-xl">
          <p className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-widest text-gray-300">
            {slides[currentSlide].tagline}
          </p>

          <h1 className="mb-4 text-3xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-5xl">
            {slides[currentSlide].title}
          </h1>

          <p className="mb-8 text-sm md:text-base leading-relaxed text-gray-300">
            {slides[currentSlide].description}
          </p>

          <div className="flex gap-4">
            <button className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-gray-200 active:scale-95 shadow-lg">
              {slides[currentSlide].primaryBtn}
            </button>

            <button className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95">
              {slides[currentSlide].secondaryBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Right Navigation Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black active:scale-90"
        aria-label="Next Slide"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators (5 Dots) */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
