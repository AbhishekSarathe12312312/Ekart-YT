import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setCart } from "../redux/productSlice";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // एक्टिव (सिलेक्टेड) इमेज इंडेक्स को ट्रैक करने के लिए स्टेट
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === id);
  const accessToken = localStorage.getItem("accessToken");

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "https://ekart-yt.onrender.com/api/v1/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-700">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-3 py-6 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Product Container */}
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl">
          <div className="grid gap-6 p-4 md:grid-cols-2 md:p-6 lg:p-7">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-3">
              {/* Main Image */}
              <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-gray-800 bg-gray-950 md:h-[380px]">
                <img
                  src={product.productImg?.[activeImageIdx]?.url}
                  alt={`${product.productName} ${activeImageIdx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-2">
                {product.productImg?.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-16 overflow-hidden rounded-md border bg-gray-950 transition-all ${
                      activeImageIdx === idx
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col justify-between py-1">
              <div>
                {/* Category & Brand */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
                    {product.category}
                  </span>

                  <span className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
                    {product.brand}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                  {product.productName}
                </h1>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                    ₹{product.productPrice}
                  </span>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
                    In Stock
                  </span>
                </div>

                {/* Description */}
                <div className="mt-5 border-t border-gray-800 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Description
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {product.productDesc}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 border-t border-gray-800 pt-4">
                {/* Quantity */}
                <div className="flex items-center justify-between sm:justify-start sm:gap-7">
                  <label className="text-sm font-medium text-gray-300">
                    Quantity
                  </label>

                  <div className="flex items-center overflow-hidden rounded-md border border-gray-700 bg-gray-800">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="px-3 py-1.5 font-bold text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-10 border-none bg-transparent text-center text-sm font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="px-3 py-1.5 font-bold text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={() => addToCart(product._id)}
                  className="mt-4 cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:-700 active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974a1.125 1.125 0 011.119 1.007z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
