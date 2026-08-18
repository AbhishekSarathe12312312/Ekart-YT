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
      const res = await API.delete(
        `/api/v1/cart/remove`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: { productId },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
        console.log(res.data.cart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      {cart?.items?.length > 0 ? (
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <h1 className="mb-6 text-3xl font-bold text-white">Shopping Cart</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ================= CART ITEMS ================= */}
            <div className="space-y-4 lg:col-span-2">
              {cart?.items?.map((product, index) => (
                <div
                  key={index}
                  className="
                flex flex-col gap-4
                rounded-lg
                border border-gray-800
                bg-gray-900
                p-4
                shadow
                transition
                duration-300
                hover:shadow-lg
                sm:flex-row
                sm:items-center
              "
                >
                  {/* Image */}
                  <img
                    className="h-24 w-24 rounded-lg object-cover"
                    src={product.productId?.productImg?.[0]?.url || userLogo}
                    alt={product?.productId?.productName}
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      {product?.productId?.productName}
                    </h2>

                    <p className="mt-1 text-gray-400">
                      ₹
                      {product?.productId?.productPrice?.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "decrease",
                          )
                        }
                        className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded
                      border border-gray-700
                      bg-gray-800
                      text-lg text-white
                      transition
                      hover:bg-gray-700
                    "
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
                        className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded
                      border border-gray-700
                      bg-gray-800
                      text-lg text-white
                      transition
                      hover:bg-gray-700
                    "
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total + Remove */}
                  <div className="flex flex-row items-center justify-between gap-5 sm:flex-col sm:items-end">
                    <p className="text-lg font-bold text-white">
                      ₹
                      {(
                        product?.productId?.productPrice * product?.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => handleRemove(product?.productId?._id)}
                      className="
                    text-sm
                    font-medium
                    text-red-400
                    transition
                    hover:text-red-300
                  "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="
              inline-block
              font-medium
              text-gray-300
              transition
              hover:text-white
            "
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="h-fit rounded-lg border border-gray-800 bg-gray-900 p-5 shadow">
              <h2 className="mb-5 text-xl font-bold text-white">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between border-b border-gray-800 pb-4 text-gray-400">
                <span>Subtotal ({cart?.items?.length}) items</span>

                <span className="font-medium text-white">
                  ₹{cart?.totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between py-4 text-gray-400">
                <span>Shipping</span>

                <span className="font-medium text-white">₹{shipping}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between border-b border-gray-800 pb-4 text-gray-400">
                <span>Tax (5%)</span>

                <span className="font-medium text-white">
                  ₹{Number(tax || 0).toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between py-5">
                <span className="text-lg font-bold text-white">Total</span>

                <span className="text-xl font-bold text-white">₹{total}</span>
              </div>

              {/* Promo Code */}
              <div className="mb-5 flex">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="
                min-w-0 flex-1
                rounded-l-lg
                border border-gray-700
                bg-gray-800
                px-3 py-2
                text-white
                outline-none
                placeholder:text-gray-500
                focus:border-white
              "
                />

                <button
                  className="
                rounded-r-lg
                bg-white
                px-4 py-2
                font-medium
                text-black
                transition
                hover:bg-gray-200
              "
                >
                  Apply
                </button>
              </div>

              {/* Place Order */}
              <button
                onClick={() => navigate("/address")}
                className="
              w-full
              rounded-lg
              bg-white
              py-3
              font-semibold
              text-black
              transition
              hover:bg-gray-200
              active:scale-[0.98]
            "
              >
                PLACE ORDER
              </button>

              {/* Benefits */}
              <div className="mt-5 space-y-2 text-sm text-gray-500">
                <p>✓ Free shipping on orders over ₹299</p>
                <p>✓ 30-days return policy</p>
                <p>✓ Secure checkout with SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= EMPTY CART ================= */
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="max-w-md rounded-lg border border-gray-800 bg-gray-900 p-8 text-center shadow">
            <h2 className="text-2xl font-bold text-white">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-400">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="
            mt-6
            rounded-lg
            bg-white
            px-6 py-3
            font-semibold
            text-black
            transition
            hover:bg-gray-200
          "
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
