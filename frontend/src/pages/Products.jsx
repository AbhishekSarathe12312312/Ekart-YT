import React from "react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `https://ekart-yt.onrender.com/api/v1/product/getallproducts`,
      );
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = [...allProducts];
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }
    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-800 px-4 py-4 text-white lg:px-8">
      <div className="mx-auto flex max-w-8xl gap-4">
        {/* ================= FILTER SIDEBAR ================= */}
        <aside className="hidden w-64 shrink-0 md:block">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            allProducts={allProducts}
          />
        </aside>

        {/* ================= PRODUCTS ================= */}
        <main className="min-w-0 flex-1">
          {/* Top Bar */}
          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">All Products</h2>

              <p className="mt-1 text-sm text-gray-400">
                Explore our latest collection
              </p>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="
              w-full
              cursor-pointer
              appearance-none
              rounded-lg
              border border-gray-700
              bg-gray-800
              px-4 py-3 pr-10
              text-sm
              font-medium
              text-white
              outline-none
              transition
              hover:border-gray-500
              focus:border-white
              sm:w-56
            "
              >
                <option value="">Sort by Price</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ↓
              </span>
            </div>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1  gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            /* No Products */
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900">
              <div className="mb-4 text-5xl">🛍️</div>

              <h3 className="text-xl font-bold text-white">
                No Products Found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
