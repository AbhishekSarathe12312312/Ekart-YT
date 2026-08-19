import React from "react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import API from "../axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { Search } from "lucide-react";

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
      const res = await API.get(`/api/v1/product/getallproducts`);
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
    <div className="min-h-screen bg-gray-950 pb-20 text-white lg:pb-8">
      <div className="mx-auto max-w-[1536px] px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* ================= DESKTOP FILTER SIDEBAR ================= */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
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
            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="min-w-0 flex-1">
            {/* Mobile Floating Filter Trigger Button */}
            <div className="fixed bottom-5 right-5 z-50 lg:hidden">
              <button
                onClick={() => {
                  /* Optional: Toggle your Mobile Drawer/Modal state here */
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-blue-600/50 active:scale-95 transition-all"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {/* Sticky Mobile App Bar & Controls */}
            <div className="sticky top-0 z-30 mb-4 -mx-3 -mt-3 bg-gray-950/90 p-3 backdrop-blur-md border-b border-gray-800/60 sm:mx-0 sm:mt-0 sm:rounded-2xl sm:border sm:bg-gray-900/90 sm:p-4">
              {/* Title Section */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <h1 className="text-lg font-bold text-white sm:text-2xl">
                    All Products
                  </h1>
                  <p className="text-[11px] text-gray-400 sm:text-xs">
                    Showing {products.length} items
                  </p>
                </div>

                {/* Desktop Sort Dropdown */}
                <div className="hidden sm:block">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Sort by: Featured</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Mobile Controls: Search Bar + Compact Sort */}
              <div className="flex items-center gap-2">
                {/* Mobile Search Bar (Only Mobile/Tablet) */}
                <div className="relative flex-1 lg:hidden">
                  <input
                    type="text"
                    placeholder="Search shoes, brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900/90 py-2 pl-9 pr-7 text-xs text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:bg-gray-900"
                  />
                  <span className="pointer-events-none absolute text-2xl left-2 top-1/2 -translate-y-1/2 text- text-gray-400">
                    <Search/>
                  </span>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Mobile Sort Dropdown */}
                <div className="relative sm:hidden">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-xl border border-gray-800 bg-gray-900 py-2 pl-3 pr-7 text-xs font-medium text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Sort</option>
                    <option value="lowToHigh">Low → High</option>
                    <option value="highToLow">High → Low</option>
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 p-6 text-center">
                <div className="mb-3 rounded-full bg-gray-800/50 p-3.5 text-3xl">
                  🔍
                </div>
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  No matching products
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
