import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ShowUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redux store, Params aur Router hooks
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const navigate = useNavigate();

  // Route URL se userId nikalna ya Redux store se prioritize karna
  const userId = params.userId || user?._id;

  // Backend URL (Agar relative image path ho toh)
  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/orders/user-order/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (res.data.success) {
          setOrders(res.data.orders || []);
        } else {
          toast.error(res.data.message || "Failed to load orders");
        }
      } catch (error) {
        console.error("Fetch orders error:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch user orders",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // FIXED HELPER FUNCTION: Ab yeh Array format ko sahi se parse karega
  const getImageUrl = (product) => {
    if (!product) return null;

    let rawImg = null;

    // 1. Array check karna (ChChahe productImg ho ya images)
    if (Array.isArray(product.productImg) && product.productImg.length > 0) {
      rawImg = product.productImg[0];
    } else if (Array.isArray(product.images) && product.images.length > 0) {
      rawImg = product.images[0];
    } else {
      // 2. Direct String/Object fields check karna
      rawImg =
        product.productImg ||
        product.image ||
        product.productImage ||
        product.img;
    }

    if (!rawImg) return null;

    // 3. Agar image object ke format me ho ({ url: "..." })
    if (typeof rawImg === "object") {
      rawImg = rawImg.url || rawImg.secure_url || rawImg.path || null;
    }

    if (!rawImg) return null;

    const urlString = String(rawImg).trim();

    // 4. External / Cloudinary URL check
    if (
      urlString.startsWith("http://") ||
      urlString.startsWith("https://") ||
      urlString.startsWith("data:")
    ) {
      return urlString;
    }

    // 5. Relative URL case (Local uploads)
    return `${BACKEND_URL}${urlString.startsWith("/") ? "" : "/"}${urlString}`;
  };

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-xl border border-gray-800 bg-gray-800 p-6 shadow-md">
      {/* Header Section with Back Button */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            User Orders History
          </h1>
          <p className="text-sm text-gray-300">
            View details and items for this specific user
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 active:scale-95"
        >
          Go Back
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-10 text-center font-medium text-gray-600">
          Loading user orders...
        </div>
      ) : !userId ? (
        <div className="py-10 text-center font-semibold text-red-500">
          User ID is missing or invalid.
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          No orders found for this user.
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">
            Total Orders ({orders.length})
          </h2>

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Top Order Details */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Order ID
                  </span>
                  <p className="text-sm font-bold text-gray-800">{order._id}</p>
                </div>

                {order.createdAt && (
                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Order Date
                    </span>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {order.products?.map((item, index) => {
                  const product = item.productId || item.product || item;
                  const imageUrl = getImageUrl(product);

                  return (
                    <div
                      key={product?._id || item._id || index}
                      className="flex items-center gap-4 py-3"
                    >
                      {/* Image or Fallback Container */}
                      <div className="h-16 w-16 flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              product?.productName || product?.name || "Product"
                            }
                            className="h-16 w-16 rounded-md border border-gray-200 object-cover shadow-sm"
                            onError={(e) => {
                              // Broken image ke liye visual fallback
                              e.target.style.display = "none";
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}

                        {/* Fallback Box */}
                        <div
                          style={{ display: imageUrl ? "none" : "flex" }}
                          className="h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-200 text-center text-xs font-medium text-gray-400"
                        >
                          No Image
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {product?.productName ||
                            product?.name ||
                            "Product Name N/A"}
                        </h4>
                        <p className="text-sm font-medium text-gray-600">
                          Price: $
                          {product?.productPrice ?? product?.price ?? "0"}
                        </p>
                        {item.quantity && (
                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowUserOrders;
