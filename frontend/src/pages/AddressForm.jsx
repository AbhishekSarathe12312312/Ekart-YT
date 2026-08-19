import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addAddress,
  deleteAddress,
  setSelectedAddress,
  setCart,
} from "../redux/productSlice";
import API from "../axios";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const {
    cart,
    addresses = [],
    selectedAddress,
  } = useSelector((store) => store.product);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      return toast.error("Please fill in all required address fields.");
    }

    const newAddress = { ...formData, id: Date.now() };
    dispatch(addAddress(newAddress));
    dispatch(setSelectedAddress(addresses.length)); // Automatically select newly added address
    setShowForm(false);
  };

  // Safe pricing calculations rounded to 2 decimal places
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const handlePayment = async () => {
    if (selectedAddress === null || !addresses[selectedAddress]) {
      return toast.error("Please select a valid delivery address");
    }

    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      // 1. Create order on backend
      const { data } = await API.post(
        `/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
          shippingAddress: addresses[selectedAddress],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!data?.success) {
        setLoading(false);
        return toast.error(
          data?.message || "Something went wrong creating order",
        );
      }

      // 2. Configure Razorpay SDK options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              `/api/v1/orders/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            if (verifyRes.data.success) {
              dispatch(setCart({ items: [], totalPrice: 0 }));
              toast.success("✅ Payment Successful!");
              navigate("/order-success");
            } else {
              toast.error("❌ Payment Verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Error verifying payment");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async function () {
            await API.post(
              `/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            toast.error("Payment cancelled");
            setLoading(false);
          },
        },
        prefill: {
          name: addresses[selectedAddress]?.fullName || formData.fullName,
          email: addresses[selectedAddress]?.email || formData.email,
          contact: addresses[selectedAddress]?.phone || formData.phone,
        },
        theme: { color: "#F472B6" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        await API.post(
          `/api/v1/orders/verify-payment`,
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        toast.error("Payment Failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-3 py-6 sm:px-4 lg:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* LEFT SIDE - ADDRESS MANAGEMENT */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-xl lg:col-span-2">
          {showForm ? (
            <form onSubmit={handleSave}>
              <h2 className="mb-5 border-b border-gray-800 pb-3 text-lg font-bold text-white">
                Shipping Information
              </h2>

              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 9543526475"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    placeholder="123 Street area"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="zip"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    required
                    placeholder="700101"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]"
                >
                  Save & Continue
                </button>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-gray-800 pb-3">
                <h2 className="text-lg font-bold text-white">
                  Saved Addresses
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20"
                >
                  + Add Address
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((addr, index) => {
                  const isSelected = selectedAddress === index;

                  return (
                    <div
                      key={index}
                      onClick={() => dispatch(setSelectedAddress(index))}
                      className={`relative cursor-pointer rounded-lg border p-4 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                          : "border-gray-800 bg-gray-950 hover:border-gray-700"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">
                              {addr.fullName}
                            </p>
                            {isSelected && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {addr.phone} | {addr.email}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteAddress(index));
                            if (isSelected) {
                              dispatch(setSelectedAddress(null));
                            }
                          }}
                          className="rounded-md px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>

                      <p className="pr-8 text-sm leading-relaxed text-gray-400">
                        {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                        {addr.country}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-gray-800 pt-4">
                <button
                  disabled={selectedAddress === null || loading}
                  onClick={handlePayment}
                  className={`w-full rounded-lg py-3 text-sm font-semibold transition active:scale-[0.99] ${
                    selectedAddress === null || loading
                      ? "cursor-not-allowed border border-gray-800 bg-gray-800 text-gray-600"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Processing..." : "Proceed To Checkout"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 shadow-xl">
          <h1 className="mb-5 border-b border-gray-800 pb-3 text-lg font-bold text-white">
            Order Summary
          </h1>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                Subtotal ({cart?.items?.length || 0} items)
              </span>
              <span className="font-semibold text-white">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Shipping</span>
              <span className="font-semibold text-green-400">
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tax (5%)</span>
              <span className="font-semibold text-white">
                ₹{tax.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <span className="font-bold text-white">Total</span>
              <span className="text-lg font-extrabold text-blue-400">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2 rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-400">
            <p className="flex items-center gap-2">
              <span className="font-bold">✓</span> Free shipping on orders over
              ₹50
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">✓</span> 30-day return policy
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">✓</span> Secure checkout with SSL
              encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
