import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../axios.js";

const ShowUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redux store, Params aur Router hooks
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const navigate = useNavigate();

  // Route URL se userId nikalna ya Redux store se prioritize karna
  const userId = params.userId || user?._id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      try {
        setLoading(true);
        const res = await API.get(`/api/v1/orders/user-order/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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
    <div className="mx-auto my-4 sm:my-10 max-w-3xl rounded-2xl border border-gray-800/80 bg-gray-900 p-3.5 sm:p-6 text-white shadow-xl">
      {/* Header Section with Back Button */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-gray-800 pb-3 sm:pb-4 gap-2">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white">
            User Orders History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            View details and items for this specific user
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="shrink-0 rounded-xl border border-gray-700 bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-200 transition hover:bg-gray-700 active:scale-95"
        >
          Go Back
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-12 text-center text-xs sm:text-sm font-medium text-gray-400">
          Loading user orders...
        </div>
      ) : !userId ? (
        <div className="py-12 text-center text-xs sm:text-sm font-semibold text-red-400">
          User ID is missing or invalid.
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-xs sm:text-sm text-gray-500">
          No orders found for this user.
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-sm sm:text-lg font-bold text-gray-300">
            Total Orders ({orders.length})
          </h2>

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-800 bg-gray-950 p-3.5 sm:p-5 shadow-sm transition hover:border-gray-700"
            >
              {/* Top Order Details */}
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-800/80 pb-2.5">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
                    Order ID
                  </span>
                  <p className="text-xs sm:text-sm font-mono font-semibold text-gray-200 truncate">
                    {order._id}
                  </p>
                </div>

                {order.createdAt && (
                  <div className="text-right shrink-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
                      Order Date
                    </span>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-800/60">
                {order.products?.map((item, index) => {
                  const product = item.productId || item.product || item;
                  const imageUrl = getImageUrl(product);

                  return (
                    <div
                      key={product?._id || item._id || index}
                      className="flex items-center gap-3 py-2.5"
                    >
                      {/* Image Container */}
                      <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              product?.productName || product?.name || "Product"
                            }
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-gray-800 bg-gray-900 object-cover"
                            onError={(e) => {
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
                          className="h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-center text-[10px] font-medium text-gray-500"
                        >
                          No Image
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-200 truncate">
                          {product?.productName ||
                            product?.name ||
                            "Product Name N/A"}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          ₹{product?.productPrice ?? product?.price ?? "0"}
                        </p>
                        {item.quantity && (
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            Qty: {item.quantity}
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
