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
    <div className="min-h-screen bg-gray-950 px-2 pb-20 text-white sm:p-6 sm:pb-6">
      {/* ================= SEARCH & SORT ================= */}
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-center sm:gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />

          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-600 sm:text-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="shrink-0 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-300 outline-none transition focus:border-gray-600 sm:text-sm"
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

      {/* ================= PRODUCTS GRID ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
              key={product._id}
              className="
              flex
              min-w-0
              flex-col
              rounded
              border
              border-gray-800/80
              bg-gray-900
              p-3
              shadow-md
              transition
              hover:border-gray-700
              sm:p-4
            "
            >
              {/* ================= TOP SECTION ================= */}
              <div className="flex min-w-0 items-start gap-3">
                {/* Product Image */}
                <img
                  src={product.productImg?.[0]?.url || "/placeholder.png"}
                  alt={product.productName}
                  className="
                  h-20
                  w-20
                  shrink-0
                  rounded-lg
                  border
                  border-gray-800
                  object-cover
                  sm:h-24
                  sm:w-24
                "
                />

                {/* Product Information */}
                <div className="min-w-0 flex-1">
                  {/* Brand */}
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                    {product.brand}
                  </span>

                  {/* Product Name - FULL NAME */}
                  <h1 className="mt-1 break-words text-sm font-semibold leading-5 text-white sm:text-base">
                    {product.productName}
                  </h1>

                  {/* Price */}
                  <p className="mt-2 text-sm font-bold text-white sm:text-base">
                    ₹{product.productPrice}
                  </p>
                </div>
              </div>

              {/* ================= ACTION SECTION ================= */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-800 pt-3">
                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="
                  rounded 
                  border
                  border-gray-800
                  bg-gray-800/80
                  px-6
                  py-1.5
                  text-[11px]
                  font-medium
                  text-gray-300
                  transition
                  hover:bg-gray-700
                  hover:text-white
                  sm:text-xs
                "
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteProductId(product._id)}
                  className="
                  rounded
                  border
                  border-red-900/40
                  bg-red-950/40
                  px-6
                  py-1.5
                  text-[11px]
                  font-medium
                  text-red-400
                  transition
                  hover:bg-red-900/60
                  sm:text-xs
                "
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
            <p className="text-xs text-gray-500 sm:text-sm">
              No matching products found.
            </p>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={handleSave}
            className="
            flex
            max-h-[90vh]
            w-full
            max-w-md
            flex-col
            rounded-t-2xl
            border
            border-gray-800
            bg-gray-900
            text-white
            shadow-2xl
            animate-in
            slide-in-from-bottom
            duration-200
            sm:max-h-[85vh]
            sm:rounded
          "
          >
            {/* Header */}
            <div className="shrink-0 border-b border-gray-800 p-4">
              <h1 className="text-base font-bold text-white sm:text-lg">
                Edit Product
              </h1>

              <p className="text-xs text-gray-400">
                Update item details below.
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3 overflow-y-auto p-4 text-xs sm:text-sm">
              {/* Product Name */}
              <div>
                <label className="block font-medium text-gray-300">
                  Product Name
                </label>

                <input
                  type="text"
                  name="productName"
                  value={editProduct.productName || ""}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800 px-3 py-2 text-white outline-none focus:border-gray-600"
                  required
                />
              </div>

              {/* Price + Brand */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block font-medium text-gray-300">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="productPrice"
                    value={editProduct.productPrice || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800 px-3 py-2 text-white outline-none focus:border-gray-600"
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-medium text-gray-300">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={editProduct.brand || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800 px-3 py-2 text-white outline-none focus:border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-medium text-gray-300">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={editProduct.category || ""}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800 px-3 py-2 text-white outline-none focus:border-gray-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-gray-300">
                  Description
                </label>

                <textarea
                  name="productDesc"
                  value={editProduct.productDesc || ""}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-gray-800 bg-gray-800 p-2.5 text-white outline-none focus:border-gray-600"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                productData={editProduct}
                setProductData={setEditProduct}
              />
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-2 border-t border-gray-800 bg-gray-900 p-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="flex-1 rounded-lg border border-gray-800 bg-gray-800 px-3.5 py-2 text-xs font-medium text-gray-300 transition hover:bg-gray-700 sm:flex-none"
              >
                Cancel
              </button>

              {/* Save */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-black transition hover:bg-gray-200 disabled:opacity-50 sm:flex-none"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-2xl border border-gray-800 bg-gray-900 p-4 text-white shadow-2xl">
            {/* Title */}
            <h2 className="mb-1 text-base font-bold text-white">
              Delete Product?
            </h2>

            {/* Message */}
            <p className="mb-4 text-xs leading-relaxed text-gray-400">
              Are you sure? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              {/* Cancel */}
              <button
                type="button"
                onClick={() => setDeleteProductId(null)}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-800 bg-gray-800 py-2 text-xs font-medium text-gray-300"
              >
                Cancel
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => deleteProductHandler(deleteProductId)}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
