import axios from "axios";
import React, { useEffect, useState } from "react";

// Helper: Status Styling
const getStatusStyle = (status) => {
  const styles = {
    Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
    Shipped: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Processing: "bg-purple-50 text-purple-700 ring-purple-600/20",
  };
  return styles[status] || "bg-amber-50 text-amber-700 ring-amber-600/20";
};

// Helper: Safe Image Extraction
const getImageUrl = (product) => {
  if (!product) return null;
  let img = product.productImg || product.image || product.img;
  if (Array.isArray(img)) img = img[0];
  if (typeof img === "object" && img)
    img = img.url || img.secure_url || img.path;
  if (typeof img !== "string" || !img) return null;
  return img.startsWith("http")
    ? img
    : `http://localhost:8000/${img.replace(/^\//, "")}`;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/v1/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-gray-800 px-4 text-white">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="mt-4 text-xl font-bold text-white">Admin Orders</h2>
          <p className="text-xs text-gray-400">Manage customer purchases.</p>
        </div>

        <span className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
          Total: {orders.length}
        </span>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900 p-8 text-center text-sm text-gray-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {orders.map((order) => {
            // Actual Paid Bill Amount (Jo Backend mein Save hua tha)
            const finalPaidBill =
              order.amount ?? 0;

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-lg transition hover:border-gray-700"
              >
                {/* Order Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3 text-xs">
                  <div>
                    <span className="text-gray-500">Order ID: </span>
                    <span className="font-mono font-semibold text-gray-200">
                      {order._id}
                    </span>
                  </div>

                  <div className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="my-3 flex flex-col justify-between gap-2 text-xs text-gray-400 sm:flex-row">
                  <p>
                    <strong className="text-gray-200">Customer:</strong>{" "}
                    {order.user?.name || "Guest"}
                  </p>

                  <p>
                    <strong className="text-gray-200">Email:</strong>{" "}
                    {order.user?.email || "N/A"}
                  </p>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-700 rounded-xl border border-gray-700 bg-gray-800 text-xs">
                  {order.products?.map((item, idx) => {
                    const product = item.productId || item;
                    const imgUrl = getImageUrl(product);
                    const itemPrice =
                      product?.productPrice ||
                      product?.price ||
                      item?.price ||
                      0;
                    const itemQty = item.quantity || 1;

                    return (
                      <div
                        key={item._id || idx}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex items-center gap-3">
                          {/* Product Image */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt="prod"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-gray-500">
                                No Img
                              </span>
                            )}
                          </div>

                          {/* Product Details */}
                          <div>
                            <p className="line-clamp-1 font-medium text-gray-200">
                              {product?.productName || product?.title || "N/A"}
                            </p>

                            <p className="text-gray-500">
                              Qty: {itemQty} • ₹{itemPrice}
                            </p>
                          </div>
                        </div>

                        <p className="font-semibold text-gray-200">
                          ₹{itemPrice * itemQty}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Footer / Summary */}
                <div className="mt-3 flex items-center justify-between border-t border-gray-800 pt-3 text-xs">
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold ring-1 ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>

                  <div className="text-right">
                    <span className="text-gray-500">Total Paid: </span>
                    <span className="text-lg font-bold text-white">
                      ₹{finalPaidBill.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
