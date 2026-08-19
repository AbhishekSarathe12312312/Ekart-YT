import API from "../axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const MyOrder = ({ onClose }) => {
  const [userOrder, setUserOrder] = useState([]);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await API.get(`/api/v1/orders/myorder`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      {/* Container: Max-width fixed, smooth scrolling */}
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-gray-900 p-3 sm:p-6 md:p-8 border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between border-b border-gray-800 pb-3 sm:mb-5 sm:pb-4">
          <div>
            <h1 className="text-base font-bold text-white sm:text-xl md:text-2xl">
              Order History
            </h1>
            <p className="text-[11px] text-gray-400 sm:text-xs">
              Track and manage your past orders
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white sm:p-2"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
        </div>

        {/* No Orders State */}
        {userOrder?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-950/50 py-10 px-4 text-center">
            <div className="mb-2 text-3xl sm:text-4xl">📦</div>
            <p className="text-xs font-medium text-gray-400 sm:text-sm">
              No orders found for this user.
            </p>
          </div>
        ) : (
          /* Orders List Container */
          <div className="max-h-[70vh] space-y-3 sm:space-y-4 overflow-y-auto pr-1 text-gray-300 scrollbar-thin scrollbar-thumb-gray-700">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="relative flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-950/70 p-3 sm:p-5 shadow-sm transition hover:border-gray-700/80"
              >
                {/* Top Row: Order ID & Status */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-800/80 pb-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white sm:text-sm">
                      <span>Order</span>
                      <span className="truncate font-mono text-[11px] font-normal text-gray-400 sm:text-xs">
                        #{order._id}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-400 sm:text-xs">
                      Amount:{" "}
                      <span className="font-semibold text-white">
                        {order.currency || "INR"}{" "}
                        {order.amount ? order.amount.toFixed(2) : "0.00"}
                      </span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs font-semibold tracking-wide text-white ${
                      order.status === "Paid" || !order.status
                        ? "bg-emerald-600/90"
                        : order.status === "Failed"
                          ? "bg-rose-600/90"
                          : "bg-amber-600/90"
                    }`}
                  >
                    {order.status || "Paid"}
                  </span>
                </div>

                {/* User Details */}
                <div className="flex flex-col gap-0.5 text-[11px] sm:text-xs text-gray-400">
                  <p className="truncate">
                    <span className="text-gray-500">User:</span>{" "}
                    <span className="text-gray-200">
                      {order.user?.firstName || "Rohit"}{" "}
                      {order.user?.lastName || "Singh"}
                    </span>
                  </p>
                  <p className="truncate">
                    <span className="text-gray-500">Email:</span>{" "}
                    <span className="text-gray-200">
                      {order.user?.email || "rohitsingh280504@gmail.com"}
                    </span>
                  </p>
                </div>

                {/* Products List */}
                <div className="pt-1">
                  <p className="mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Items ({order.products?.length || 0})
                  </p>

                  <div className="grid gap-2">
                    {order.products?.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 rounded-lg border border-gray-800/80 bg-gray-900/60 p-1.5 sm:p-2"
                      >
                        <img
                          className="h-10 w-10 shrink-0 rounded-md object-cover sm:h-12 sm:w-12"
                          src={
                            product.productId?.productImg?.[0]?.url ||
                            "/placeholder.png"
                          }
                          alt={product.productId?.productName || "Product"}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-gray-200 sm:text-sm">
                            {product.productId?.productName ||
                              "Unnamed Product"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
