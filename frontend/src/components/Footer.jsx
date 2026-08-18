import React from "react";
import { Mail, Phone, Send, MapPin, ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden rounded-t-3xl border-t border-gray-800 bg-gray-950 text-gray-300">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top Brand Banner */}
        <div className="mb-12 flex flex-col justify-between gap-6 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Welcome to
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              EKart
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Smart shopping. Better prices. Trusted products.
            </p>
          </div>

          <Link
            to="/products"
            className="group flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-200 hover:shadow-xl active:scale-95"
          >
            Start Shopping
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="group inline-block transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <img
                src="/Ekart.png"
                alt="EKart Logo"
                className="h-11 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Your one-stop destination for premium products at unbeatable
              prices. Discover electronics, fashion, accessories and daily
              essentials with a smooth and trusted shopping experience.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20"
              >
                <FaFacebookF className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/20"
              >
                <FaTwitter className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-600 hover:text-white hover:shadow-lg hover:shadow-pink-600/20"
              >
                <FaInstagram className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-700 hover:text-white hover:shadow-lg hover:shadow-blue-700/20"
              >
                <FaLinkedinIn className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["Shop All", "/products"],
                ["Featured Items", "/products"],
                ["Offers & Discounts", "/products"],
                ["Contact Us", "/"],
              ].map(([title, path]) => (
                <li key={title}>
                  <Link
                    to={path}
                    className="group flex w-fit items-center gap-1 text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Customer Care
            </h3>

            <ul className="space-y-3">
              {[
                "Track Your Order",
                "Shipping Policy",
                "Returns & Exchanges",
                "FAQs",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex w-fit items-center gap-1 text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Stay Updated
            </h3>

            <p className="mb-4 text-xs leading-6 text-gray-400">
              Subscribe to get exclusive offers, new arrivals and special
              discounts directly in your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="group relative"
            >
              <div className="flex overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all duration-300 focus-within:border-gray-600 focus-within:ring-2 focus-within:ring-white/5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600"
                />

                <button
                  type="submit"
                  className="m-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-all duration-300 hover:bg-gray-200 active:scale-90"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-3 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Call Us
                  </p>
                  <p className="text-xs font-medium text-gray-300">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-3 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300">
                  <Mail className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Email
                  </p>
                  <p className="text-xs font-medium text-gray-300">
                    support@ekart.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-gray-500 sm:px-6 md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-300">EKart</span>. All
            rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              Cookie Settings
            </a>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-3.5 w-3.5" />
            India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
