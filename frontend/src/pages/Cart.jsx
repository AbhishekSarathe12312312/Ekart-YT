import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios.js";
import userLogo from "../assets/user.jpg";
import { setCart } from "../redux/productSlice";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05; // 5%
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadCart = async () => {
    try {
      const res = await API.get("/api/v1/cart/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await API.put(
        `/api/v1/cart/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await API.delete(`/api/v1/cart/remove`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-8 sm:px-6 text-white relative overflow-hidden">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {cart?.items?.length > 0 ? (
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Heading */}
          <h1 className="mb-6 text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Shopping Cart
            <span className="text-xs sm:text-sm font-normal px-3 py-1 rounded-full bg-gray-800/80 text-gray-300 border border-gray-700">
              {cart?.items?.length}{" "}
              {cart?.items?.length === 1 ? "item" : "items"}
            </span>
          </h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ================= CART ITEMS ================= */}
            <div className="space-y-4 lg:col-span-2">
              {cart?.items?.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl border border-gray-800/80 bg-gray-900/70 backdrop-blur-md p-4 shadow-xl hover:border-gray-700 transition duration-300"
                >
                  {/* Image + Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl object-cover bg-gray-800 border border-gray-800"
                      src={product.productId?.productImg?.[0]?.url || userLogo}
                      alt={product?.productId?.productName || "Product"}
                    />

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                        {product?.productId?.productName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-400">
                        ₹
                        {product?.productId?.productPrice?.toLocaleString(
                          "en-IN",
                        )}
                      </p>

                      {/* Desktop Quantity Controls */}
                      <div className="hidden sm:flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "decrease",
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-lg text-white hover:bg-gray-700 active:scale-95 transition"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center font-medium text-white">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "increase",
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-lg text-white hover:bg-gray-700 active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Mobile + Pricing */}
                  <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 pt-3 sm:pt-0 border-t border-gray-800/80 sm:border-t-0">
                    {/* Mobile Quantity Controls */}
                    <div className="flex sm:hidden items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "decrease",
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-base text-white active:bg-gray-700"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-white">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "increase",
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800/80 text-base text-white active:bg-gray-700"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2">
                      <p className="text-base sm:text-lg font-bold text-white">
                        ₹
                        {(
                          product?.productId?.productPrice * product?.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                      <button
                        onClick={() => handleRemove(product?.productId?._id)}
                        className="text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition"
                >
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>

            {/* ================= COMPACT ORDER SUMMARY ================= */}
            <div className="h-fit rounded-xl border border-gray-800/80 bg-gray-900/70 backdrop-blur-md p-3.5 sm:p-4 shadow-xl">
              <h2 className="mb-3 border-b border-gray-800/80 pb-2 text-base font-bold text-white">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span className="font-medium text-white">
                    ₹{cart?.totalPrice?.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-white">₹{shipping}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between border-b border-gray-800/80 pb-2 text-gray-400">
                  <span>Tax (5%)</span>
                  <span className="font-medium text-white">
                    ₹{Number(tax || 0).toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-1.5 text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-base text-blue-400">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="my-3 flex">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="w-full rounded-l-md border border-gray-700 bg-gray-800/80 px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-gray-500 focus:border-gray-500 transition"
                />
                <button className="rounded-r-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-gray-200 transition shrink-0">
                  Apply
                </button>
              </div>

              {/* Place Order */}
              <button
                onClick={() => navigate("/address")}
                className="w-full rounded-lg bg-white py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-gray-200 active:scale-[0.98] transition shadow-md"
              >
                PLACE ORDER
              </button>

              {/* Benefits */}
              <div className="mt-3 space-y-1 rounded-md border border-gray-800 bg-gray-950/50 p-2 text-[11px] text-gray-400">
                <p>✓ Free shipping over ₹299</p>
                <p>✓ 30-days return policy</p>
                <p>✓ Secure SSL checkout</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= EMPTY CART ================= */
        <div className="relative z-10 flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl border border-gray-800/80 bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 text-center shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 w-full rounded-xl bg-white px-6 py-2.5 text-sm sm:text-base font-semibold text-black hover:bg-gray-200 transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
