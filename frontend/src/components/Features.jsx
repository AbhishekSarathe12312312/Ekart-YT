import React, { useEffect, useRef } from "react";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headset,
  CreditCard,
  Tag,
  Zap,
  Award,
  Gift,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Features = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const isPaused = useRef(false);

  const featureList = [
    {
      id: 1,
      icon: <Truck />,
      title: "Free Shipping",
      description: "Free shipping on orders over ₹499",
    },
    {
      id: 2,
      icon: <ShieldCheck />,
      title: "Secure Payment",
      description: "100% secure payment gateways",
    },
    {
      id: 3,
      icon: <RefreshCw />,
      title: "Easy Returns",
      description: "7-day instant money-back guarantee",
    },
    {
      id: 4,
      icon: <Headset />,
      title: "24/7 Support",
      description: "Dedicated customer service team",
    },
    {
      id: 5,
      icon: <CreditCard />,
      title: "No-Cost EMI",
      description: "Available on major credit cards",
    },
    {
      id: 6,
      icon: <Tag />,
      title: "Best Price Guarantee",
      description: "Unbeatable deals on top brands",
    },
    {
      id: 7,
      icon: <Zap />,
      title: "Express Delivery",
      description: "Same day dispatch on orders",
    },
    {
      id: 8,
      icon: <Award />,
      title: "Original Products",
      description: "100% genuine brand warranty",
    },
    {
      id: 9,
      icon: <Gift />,
      title: "Special Rewards",
      description: "Earn cashback & points on every purchase",
    },
    {
      id: 10,
      icon: <ThumbsUp />,
      title: "Verified Sellers",
      description: "Trusted partners across India",
    },
  ];

  // Auto Scroll
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const autoScroll = () => {
      if (!isPaused.current) {
        container.scrollLeft += 0.6;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 2
        ) {
          container.scrollLeft = 0;
        }
      }

      animationRef.current = requestAnimationFrame(autoScroll);
    };

    animationRef.current = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Previous / Next Button
  const scrollFeatures = (direction) => {
    const container = scrollRef.current;

    if (!container) return;

    // Pause auto scroll
    isPaused.current = true;

    const card = container.querySelector(".feature-card");

    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 20;

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    // Resume auto scroll after 1 second
    setTimeout(() => {
      isPaused.current = false;
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#080b12] px-4 py-8 shadow-2xl sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Header */}
      <div className="relative mb-7 flex items-end justify-between border-b border-gray-800 pb-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
              Premium Experience
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Why Choose Us?
          </h2>

          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Everything you need for a seamless shopping experience
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="relative mb-3 flex justify-end gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => scrollFeatures("prev")}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-gray-700
            bg-gray-900
            text-gray-400
            transition-all duration-300
            hover:border-blue-400
            hover:bg-blue-500/10
            hover:text-blue-400
            active:scale-90
          "
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => scrollFeatures("next")}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            border border-gray-700
            bg-gray-900
            text-gray-400
            transition-all duration-300
            hover:border-blue-400
            hover:bg-blue-500/10
            hover:text-blue-400
            active:scale-90
          "
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slider */}
      <div
        ref={scrollRef}
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        onTouchStart={() => (isPaused.current = true)}
        onTouchEnd={() => (isPaused.current = false)}
        className="relative flex gap-5 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {featureList.map((item) => (
          <div
            key={item.id}
            className="
              feature-card
              group
              relative
              min-w-[285px]
              shrink-0
              sm:min-w-[320px]
            "
          >
            {/* Outer Glow */}
            <div
              className="
                absolute
                -inset-[1px]
                rounded-2xl
                bg-gradient-to-r
                from-blue-500/0
                via-purple-500/0
                to-blue-500/0
                opacity-0
                blur-sm
                transition-all
                duration-500
                group-hover:from-blue-500/50
                group-hover:via-purple-500/50
                group-hover:to-cyan-500/50
                group-hover:opacity-100
              "
            />

            {/* Card */}
            <div
              className="
              mt-3
                relative
                overflow-hidden
                rounded-xl
                border
                border-gray-800
                bg-gray-900/90
                p-5
                backdrop-blur-xl
                transition-all
                duration-500
                ease-out

                group-hover:-translate-y-2
                group-hover:border-gray-600
                group-hover:bg-gray-900
                group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              "
            >
              {/* Shine Effect */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -left-32
                  top-0
                  h-full
                  w-24
                  rotate-[20deg]
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                  transition-all
                  duration-700
                  group-hover:left-[120%]
                "
              />

              {/* Top Gradient Line */}
              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-[2px]
                  w-0
                  bg-gradient-to-r
                  from-blue-400
                  via-purple-400
                  to-cyan-400
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />

              {/* Content */}
              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-gray-700
                    bg-gray-800
                    text-gray-300
                    shadow-lg
                    transition-all
                    duration-500

                    group-hover:scale-110
                    group-hover:-rotate-3
                    group-hover:border-blue-400/40
                    group-hover:bg-blue-500/10
                    group-hover:text-blue-400
                    group-hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]
                  "
                >
                  {React.cloneElement(item.icon, {
                    className:
                      "h-6 w-6 transition-transform duration-500 group-hover:scale-110",
                  })}

                  {/* Icon Glow */}
                  <div
                    className="
                      absolute
                      inset-0
                      -z-10
                      rounded-2xl
                      bg-blue-500/20
                      opacity-0
                      blur-xl
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-white
                      transition-all
                      duration-300
                      group-hover:text-blue-300
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-gray-500
                      transition-colors
                      duration-300
                      group-hover:text-gray-300
                    "
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="relative mt-5 flex items-center justify-between">
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-gray-700
                    transition-colors
                    duration-300
                    group-hover:text-blue-400
                  "
                >
                  EKart Service
                </span>

                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-800
                    text-[10px]
                    text-gray-600
                    transition-all
                    duration-300
                    group-hover:border-blue-400/40
                    group-hover:text-blue-400
                  "
                >
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="relative mt-3 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-gray-600">
          Auto Scrolling • Hover to Pause
        </span>
      </div>
    </section>
  );
};

export default Features;
