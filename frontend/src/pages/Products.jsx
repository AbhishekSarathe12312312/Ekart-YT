import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import API from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import {
  Search,
  X,
  ChevronDown,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const [allProducts, setAllProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  // UI states only
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brand = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brand)];

  // =========================
  // GET ALL PRODUCTS
  // =========================
  const getAllProducts = async () => {
    try {
      const res = await API.get(`/api/v1/product/getallproducts`);

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
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

  // =========================
  // PRICE HANDLER
  // =========================
  const handlePriceChange = (value) => {
    if (value === "All") {
      setPriceRange([0, 999999]);
    }

    if (value === "0-1000") {
      setPriceRange([0, 1000]);
    }

    if (value === "1000-5000") {
      setPriceRange([1000, 5000]);
    }

    if (value === "5000-10000") {
      setPriceRange([5000, 10000]);
    }

    if (value === "10000-50000") {
      setPriceRange([10000, 50000]);
    }

    if (value === "50000+") {
      setPriceRange([50000, 999999]);
    }

    setOpenDropdown(null);
  };

  // =========================
  // CURRENT PRICE LABEL
  // =========================
  const getPriceLabel = () => {
    if (priceRange[0] === 0 && priceRange[1] === 999999) {
      return "All Prices";
    }

    if (priceRange[0] === 0 && priceRange[1] === 1000) {
      return "₹0 - ₹1,000";
    }

    if (priceRange[0] === 1000 && priceRange[1] === 5000) {
      return "₹1,000 - ₹5,000";
    }

    if (priceRange[0] === 5000 && priceRange[1] === 10000) {
      return "₹5,000 - ₹10,000";
    }

    if (priceRange[0] === 10000 && priceRange[1] === 50000) {
      return "₹10,000 - ₹50,000";
    }

    if (priceRange[0] === 50000) {
      return "₹50,000+";
    }

    return "All Prices";
  };

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
    setSortOrder("");
    setOpenDropdown(null);
  };

  const priceOptions = [
    { value: "All", label: "All Prices" },
    { value: "0-1000", label: "₹0 - ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000-50000", label: "₹10,000 - ₹50,000" },
    { value: "50000+", label: "₹50,000+" },
  ];

 return (
    <div className="min-h-screen bg-[#090d16] pb-16 text-white selection:bg-blue-500 selection:text-white">
      <div className="mx-auto max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8">
        
        {/* =========================
            HEADER SECTION
        ========================= */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                All Products
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Explore our latest collection of premium products
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900/90 px-3.5 py-2 text-xs font-medium text-gray-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-gray-700 hover:bg-gray-800 sm:hidden active:scale-95"
            >
              <SlidersHorizontal size={14} className="text-blue-400" />
              <span>Filters</span>
            </button>
          </div>

          {/* =========================
              SEARCH + SORT BAR
          ========================= */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 group">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-gray-800/80 bg-gray-900/80 pl-10 pr-10 text-xs text-white outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* DESKTOP SORT */}
            <div className="relative hidden sm:block sm:w-48">
              <ArrowUpDown
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-gray-800/80 bg-gray-900/80 pl-10 pr-9 text-xs font-medium text-gray-300 outline-none backdrop-blur-sm transition-all duration-200 focus:border-blue-500/50 focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="" className="bg-gray-900 text-gray-400">Sort Products</option>
                <option value="lowToHigh" className="bg-gray-900">Price: Low to High</option>
                <option value="highToLow" className="bg-gray-900">Price: High to Low</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* MOBILE SORT */}
            <div className="relative sm:hidden">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-gray-800/80 bg-gray-900/80 px-4 pr-9 text-xs font-medium text-gray-300 outline-none"
              >
                <option value="" className="bg-gray-900 text-gray-400">Sort Products</option>
                <option value="lowToHigh" className="bg-gray-900">Price: Low to High</option>
                <option value="highToLow" className="bg-gray-900">Price: High to Low</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* =========================
            FILTER PANEL
        ========================= */}
        <div
          className={`mb-6 overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900/40 p-4 backdrop-blur-xl transition-all duration-300 sm:block ${
            showFilters ? "block shadow-xl shadow-black/40" : "hidden"
          }`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* CATEGORY DROPDOWN */}
            <div className="relative">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Category
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "category" ? null : "category",
                  )
                }
                className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-800 bg-gray-950 px-3.5 text-xs font-medium text-white transition-all duration-200 hover:border-gray-700 hover:bg-gray-900"
              >
                <span className="truncate">
                  {category === "All" ? "All Categories" : category}
                </span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    openDropdown === "category" ? "rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1.5 origin-top rounded-xl border border-gray-800 bg-gray-900/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-200 ${
                  openDropdown === "category"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {UniqueCategory.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 ${
                        category === item
                          ? "bg-blue-500/15 text-blue-400 shadow-sm"
                          : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                      }`}
                    >
                      <span>{item === "All" ? "All Categories" : item}</span>
                      {category === item && <Check size={13} className="text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BRAND DROPDOWN */}
            <div className="relative">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Brand
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "brand" ? null : "brand")
                }
                className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-800 bg-gray-950 px-3.5 text-xs font-medium text-white transition-all duration-200 hover:border-gray-700 hover:bg-gray-900"
              >
                <span className="truncate">
                  {brand === "All" ? "All Brands" : brand}
                </span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    openDropdown === "brand" ? "rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1.5 origin-top rounded-xl border border-gray-800 bg-gray-900/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-200 ${
                  openDropdown === "brand"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {UniqueBrand.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setBrand(item);
                        setOpenDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 ${
                        brand === item
                          ? "bg-blue-500/15 text-blue-400 shadow-sm"
                          : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                      }`}
                    >
                      <span>{item === "All" ? "All Brands" : item}</span>
                      {brand === item && <Check size={13} className="text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICE DROPDOWN */}
            <div className="relative">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Price Range
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "price" ? null : "price")
                }
                className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-800 bg-gray-950 px-3.5 text-xs font-medium text-white transition-all duration-200 hover:border-gray-700 hover:bg-gray-900"
              >
                <span className="truncate">{getPriceLabel()}</span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    openDropdown === "price" ? "rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1.5 origin-top rounded-xl border border-gray-800 bg-gray-900/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-200 ${
                  openDropdown === "price"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="space-y-0.5">
                  {priceOptions.map((item) => {
                    const selected = getPriceLabel() === item.label;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handlePriceChange(item.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 ${
                          selected
                            ? "bg-blue-500/15 text-blue-400 shadow-sm"
                            : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        {selected && <Check size={13} className="text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CLEAR BUTTON */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
              >
                <X size={14} />
                <span>Clear Filters</span>
              </button>
            </div>

          </div>
        </div>

        {/* =========================
            RESULT INFO BAR
        ========================= */}
        <div className="mb-4 flex items-center justify-between px-1">
          <p className="text-xs font-medium text-gray-400">
            Showing{" "}
            <span className="font-semibold text-white">{products.length}</span>{" "}
            products
          </p>

          {(search ||
            category !== "All" ||
            brand !== "All" ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 999999 ||
            sortOrder) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-blue-400 transition hover:text-blue-300 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* =========================
            PRODUCTS GRID
        ========================= */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          /* =========================
              EMPTY STATE
          ========================= */
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-gray-900/20 px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 shadow-inner">
              <Search size={22} className="text-gray-500" />
            </div>

            <h2 className="text-base font-semibold text-gray-200">
              No products found
            </h2>

            <p className="mt-1 max-w-sm text-xs text-gray-400 leading-relaxed">
              We couldn't find anything matching your criteria. Try loosening up your filters or search keywords.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
