import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const MyOrder = ({ onClose }) => {
  const [userOrder, setUserOrder] = useState([]);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUserOrder(res.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <>
      <div className="mx-auto bg-gray-800 scrollbar-hide max-w-full p-10">
        {/* Header */}
        <div className="mb-3  border-b border-gray-800 pb-4">
          <h1 className="text-xl font-bold text-white">Order History</h1>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* No Orders */}
        {userOrder?.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
            <p className="text-lg font-medium text-gray-400">
              No orders found for this user.
            </p>
          </div>
        ) : (
          <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="relative flex flex-col gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-gray-300 shadow-lg"
              >
                {/* Order ID & Amount */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-gray-800 pb-4">
                  <span className="text-base font-bold text-white">
                    Order ID:{" "}
                    <span className="break-all font-normal text-gray-400">
                      {order._id}
                    </span>
                  </span>

                  <span className="text-sm font-medium text-gray-500">
                    Amount:{" "}
                    <span className="font-bold text-gray-200">
                      {order.currency || "INR"}{" "}
                      {order.amount ? order.amount.toFixed(2) : "0.00"}
                    </span>
                  </span>
                </div>

                {/* User Details & Status */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-200">
                      <span className="text-gray-500">User:</span>{" "}
                      {order.user?.firstName || "Rohit"}{" "}
                      {order.user?.lastName || "Singh"}
                    </p>

                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Email:</span>{" "}
                      {order.user?.email || "rohitsingh280504@gmail.com"}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-block rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide text-white shadow-sm ${
                        order.status === "Paid" || !order.status
                          ? "bg-green-600"
                          : order.status === "Failed"
                            ? "bg-red-600"
                            : "bg-amber-600"
                      }`}
                    >
                      {order.status || "Paid"}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="mb-3 font-semibold text-white">Products</h3>

                  <ul className="space-y-2">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-800 p-3 transition hover:bg-gray-750"
                      >
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={
                            product.productId?.productImg?.[0]?.url
                          }
                          alt={product.name || "Product"}
                        />

                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-200">
                            {product.productId?.productName}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrder;
