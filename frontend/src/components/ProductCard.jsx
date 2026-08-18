import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCart } from "../redux/productSlice";
import API from "../axios";

const ProductCard = ({ product }) => {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
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
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-gray-900 text-white transition duration-300 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative">
        <img
          onClick={() => navigate(`/products/${product._id}`)}
          src={productImg?.[0]?.url}
          alt={productName}
          className="h-40 w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
        />

        {/* Brand */}
        <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-[10px]">
          {product.brand || "Product"}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-3">
        {/* Product Name */}
        <h1 className="truncate text-base font-semibold text-white">
          {productName}
        </h1>

        {/* Category */}
        <p className="mt-1 text-xs text-gray-400">
          {product.category || "Fashion"}
        </p>

        {/* Price + Rating */}
        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-base font-medium text-white">₹{productPrice}</h2>

          <p className="text-xs text-yellow-400">★ {product.rating || "4.5"}</p>
        </div>

        {/* Add To Cart */}
        <button
          onClick={() => addToCart(product._id)}
          className="mt-3 w-full cursor-pointer rounded bg-white py-1.5 text-sm font-medium text-black transition duration-200 hover:bg-gray-200 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
