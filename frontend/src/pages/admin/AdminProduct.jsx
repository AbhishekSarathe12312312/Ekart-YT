import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "../../components/ImageUpload";

import API from "../../axios.js";

import { toast } from "react-toastify";
import { setProducts } from "../../redux/productSlice";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);

  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Edit Product
  // -----------------------------
  const handleEdit = (product) => {
    setEditProduct({
      ...product,
      productImg: product.productImg ? [...product.productImg] : [],
    });
  };

  // -----------------------------
  // Update Product
  // -----------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    if (!editProduct?._id) {
      toast.error("Product ID not found");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("productName", editProduct.productName || "");
      formData.append("productDesc", editProduct.productDesc || "");
      formData.append("productPrice", editProduct.productPrice || 0);
      formData.append("category", editProduct.category || "");
      formData.append("brand", editProduct.brand || "");

      // Existing Cloudinary images
      const existingImages = (editProduct.productImg || [])
        .filter((img) => !(img instanceof File) && img?.public_id)
        .map((img) => img.public_id);

      formData.append("existingImages", JSON.stringify(existingImages));

      // New uploaded images
      (editProduct.productImg || [])
        .filter((img) => img instanceof File)
        .forEach((file) => {
          formData.append("files", file);
        });

      const res = await axios.put(
        `https://ekart-yt.onrender.com/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product updated successfully");

        const updatedProducts = (products || []).map((product) =>
          product._id === editProduct._id ? res.data.product : product,
        );

        dispatch(setProducts(updatedProducts));

        setEditProduct(null);
      }
    } catch (error) {
      console.error("Update Product Error:", error);

      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete Product
  // -----------------------------
  const deleteProductHandler = async (id) => {
    if (!id) {
      toast.error("Product ID not found");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.delete(
        `https://ekart-yt.onrender.com/api/v1/product/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product deleted successfully");

        const remainingProducts = (products || []).filter(
          (product) => product._id !== id,
        );

        dispatch(setProducts(remainingProducts));

        setDeleteProductId(null);
      }
    } catch (error) {
      console.error("Delete Product Error:", error);

      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Search
  // -----------------------------
  const filteredProducts = (products || []).filter((product) =>
    product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // -----------------------------
  // Sort
  // -----------------------------
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.productPrice) || 0;
    const priceB = Number(b.productPrice) || 0;

    if (sortBy === "lowToHigh") {
      return priceA - priceB;
    }

    if (sortBy === "highToLow") {
      return priceB - priceA;
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-3 sm:p-6 text-white">
      {/* ================= SEARCH & SORT ================= */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-300 outline-none transition focus:border-gray-500 w-full sm:w-auto shrink-0"
        >
          <option value="" className="bg-gray-900">
            Sort by Price
          </option>

          <option value="lowToHigh" className="bg-gray-900">
            Price: Low to High
          </option>

          <option value="highToLow" className="bg-gray-900">
            Price: High to Low
          </option>
        </select>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="grid  gap-3 sm:gap-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl  border border-gray-800 bg-gray-900 p-3 sm:p-4 shadow-lg transition hover:border-gray-700"
            >
              {/* Product Information */}
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <img
                  src={product.productImg?.[0]?.url || "/placeholder.png"}
                  alt={product.productName}
                  className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl border border-gray-700 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg font-bold text-white truncate">
                    {product.productName}
                  </h1>

                  <p className="mt-0.5 sm:mt-1 font-semibold text-gray-200 text-sm sm:text-base">
                    ₹{product.productPrice}
                  </p>

                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 truncate">
                    {product.brand}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2.5 pt-3 sm:pt-0 border-t border-gray-800/80 sm:border-t-0 justify-end w-full sm:w-auto">
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
                >
                  <Edit size={16} />
                  Edit
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteProductId(product._id)}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 rounded-xl border border-red-900/60 bg-red-950/60 px-3.5 py-2 text-xs sm:text-sm font-medium text-red-400 transition hover:bg-red-900/80 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
            <p className="text-sm text-gray-500">No matching products found.</p>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="flex max-h-[85vh] sm:max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 pb-2 border-b border-gray-800 shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Edit Product
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Make changes to your product details below.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200">
                  Product Name
                </label>

                <input
                  type="text"
                  name="productName"
                  value={editProduct.productName || ""}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200">
                  Price
                </label>

                <input
                  type="number"
                  name="productPrice"
                  value={editProduct.productPrice || ""}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={editProduct.brand || ""}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={editProduct.category || ""}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-200">
                  Description
                </label>

                <textarea
                  name="productDesc"
                  value={editProduct.productDesc || ""}
                  onChange={handleChange}
                  className="mt-1.5 h-20 sm:h-24 w-full resize-none rounded-xl border border-gray-700 bg-gray-800 p-3 text-sm text-white outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                productData={editProduct}
                setProductData={setEditProduct}
              />
            </div>

            {/* Fixed Footer Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-800 p-4 shrink-0 bg-gray-900/90 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="flex-1 sm:flex-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-5 sm:p-6 text-white shadow-2xl">
            <h2 className="mb-2 text-lg sm:text-xl font-bold text-white">
              Delete Product?
            </h2>

            <p className="mb-6 text-xs sm:text-sm leading-relaxed text-gray-400">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProductId(null)}
                disabled={loading}
                className="flex-1 sm:flex-none justify-center rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteProductHandler(deleteProductId)}
                disabled={loading}
                className="flex-1 sm:flex-none justify-center rounded-xl bg-red-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
