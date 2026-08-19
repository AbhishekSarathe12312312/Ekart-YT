import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCart } from "../redux/productSlice";
import API from "../axios";

const ProductCard = ({ product }) => {
  const { productImg, productPrice, productName } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    // 1. Token Check: Getting token at button click to avoid stale values
    const accessToken = localStorage.getItem("accessToken");

    // 2. Auth Guard: If not logged in, warn user and redirect
    if (!accessToken) {
      toast.warning("Please login to add items to cart");
      return navigate("/login");
    }

    try {
      const res = await API.post(
        `/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-white shadow-sm transition duration-300 hover:border-gray-700 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-800">
        <img
          onClick={() => navigate(`/products/${product._id}`)}
          src={productImg?.[0]?.url}
          alt={productName}
          className="h-36 w-full cursor-pointer object-cover transition duration-300 hover:scale-105 sm:h-44"
        />

        {/* Brand Badge */}
        <span className="absolute left-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-gray-200 backdrop-blur-md sm:left-2 sm:top-2 sm:text-[10px]">
          {product.brand || "Product"}
        </span>
      </div>

      {/* Product Details (Compact Mobile View) */}
      <div className="p-2 sm:p-3">
        {/* Product Name */}
        <h1
          onClick={() => navigate(`/products/${product._id}`)}
          className="cursor-pointer truncate text-xs font-semibold text-white sm:text-sm"
          title={productName}
        >
          {productName}
        </h1>

        {/* Category */}
        <p className="truncate text-[10px] text-gray-400 capitalize sm:text-xs">
          {product.category || "Fashion"}
        </p>

        {/* Price + Rating */}
        <div className="mt-1.5 flex items-center justify-between gap-1 sm:mt-2">
          <h2 className="text-xs font-bold text-white sm:text-sm">
            ₹{productPrice}
          </h2>

          <span className="flex items-center gap-0.5 text-[10px] font-medium text-yellow-400 sm:text-xs">
            ★ {product.rating || "4.5"}
          </span>
        </div>

        {/* Add To Cart Button */}
        <button
          onClick={() => addToCart(product._id)}
          className="mt-2 w-full cursor-pointer rounded-lg bg-white py-1 text-xs font-semibold text-black transition duration-200 hover:bg-gray-200 active:scale-95 sm:py-1.5 sm:text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
