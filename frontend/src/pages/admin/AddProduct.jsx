import React, { useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { toast } from "react-toastify";
import API from "../../axios.js";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      const res = await API.post(`/api/v1/product/addproduct`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);
        // Form reset on success
        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          productImg: [],
          brand: "",
          category: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-800 bg-gray-900 p-4 text-white shadow-xl sm:rounded-[24px] sm:p-8 md:p-10">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg font-bold tracking-tight text-white sm:text-2xl">
          Add Product
        </h1>
        <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
          Enter product details below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-3.5 sm:space-y-5">
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="mb-1 block text-xs font-semibold text-gray-300 sm:mb-1.5 sm:text-sm"
          >
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            name="productName"
            value={productData.productName}
            onChange={handleChange}
            placeholder="Ex - iPhone 15"
            required
            className="w-full rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          />
        </div>

        {/* Price & Brand (2 Columns on Mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Price */}
          <div>
            <label
              htmlFor="productPrice"
              className="mb-1 block text-xs font-semibold text-gray-300 sm:mb-1.5 sm:text-sm"
            >
              Price
            </label>
            <input
              id="productPrice"
              type="number"
              name="productPrice"
              value={productData.productPrice}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            />
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="mb-1 block text-xs font-semibold text-gray-300 sm:mb-1.5 sm:text-sm"
            >
              Brand
            </label>
            <input
              id="brand"
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              placeholder="Ex - Apple"
              required
              className="w-full rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-xs font-semibold text-gray-300 sm:mb-1.5 sm:text-sm"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            placeholder="Ex - Mobile"
            required
            className="w-full rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="productDesc"
            className="mb-1 block text-xs font-semibold text-gray-300 sm:mb-1.5 sm:text-sm"
          >
            Description
          </label>
          <textarea
            id="productDesc"
            name="productDesc"
            value={productData.productDesc}
            onChange={handleChange}
            placeholder="Enter brief description..."
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-700/80 bg-gray-800 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:rows-4 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          />
        </div>

        {/* Image Upload Component */}
        <div>
          <ImageUpload
            productData={productData}
            setProductData={setProductData}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white py-2.5 text-xs font-bold text-black shadow-sm transition hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50 sm:py-3 sm:text-sm"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
