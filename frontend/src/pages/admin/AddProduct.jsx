import React, { useState } from "react";
import ImageUpload from "../../components/ImageUpload";
import { toast } from "react-toastify";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../redux/productSlice";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
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
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      const res = await API.post(
        `/api/v1/product/addproduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-[24px] border border-gray-800 bg-gray-900 p-10 text-white shadow-lg">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Add Product
        </h1>
        <h2 className="mt-1 text-sm text-gray-400">
          Enter product details below
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="mb-2 block text-sm font-semibold text-gray-200"
          >
            Product Name
          </label>

          <input
            id="productName"
            type="text"
            name="productName"
            value={productData.productName}
            onChange={handleChange}
            placeholder="Ex - iPhone"
            required
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Price & Brand */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Price */}
          <div>
            <label
              htmlFor="productPrice"
              className="mb-2 block text-sm font-semibold text-gray-200"
            >
              Price
            </label>

            <input
              id="productPrice"
              type="number"
              name="productPrice"
              value={productData.productPrice}
              onChange={handleChange}
              placeholder="Enter price"
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
            />
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-sm font-semibold text-gray-200"
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
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-gray-200"
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
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="productDesc"
            className="mb-2 block text-sm font-semibold text-gray-200"
          >
            Description
          </label>

          <textarea
            id="productDesc"
            name="productDesc"
            value={productData.productDesc}
            onChange={handleChange}
            placeholder="Enter brief description of product..."
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Images */}
        <div className="pt-2">
          <ImageUpload
            productData={productData}
            setProductData={setProductData}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black shadow-sm transition hover:bg-gray-200 active:scale-[0.99]"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
