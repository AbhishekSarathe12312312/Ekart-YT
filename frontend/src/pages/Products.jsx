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
    <div className="min-h-screen bg-gray-950 pb-12 text-white">
      <div className="mx-auto max-w-[1536px] px-3 py-4 sm:px-5 lg:px-7">
        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                All Products
              </h1>

              <p className="mt-0.5 text-[11px] text-gray-500">
                Explore our latest products
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-300 transition-all duration-200 hover:border-gray-700 hover:bg-gray-800 sm:hidden"
            >
              <SlidersHorizontal size={14} />

              <span>Filters</span>
            </button>
          </div>

          {/* =========================
              SEARCH + SORT
          ========================= */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-9 w-full rounded-lg border border-gray-800 bg-gray-900 pl-9 pr-9 text-xs text-white outline-none transition-all duration-200 placeholder:text-gray-600 focus:border-gray-700"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* DESKTOP SORT */}
            <div className="relative hidden sm:block sm:w-44">
              <ArrowUpDown
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-gray-800 bg-gray-900 pl-9 pr-8 text-xs text-gray-300 outline-none transition focus:border-gray-700"
              >
                <option value="">Sort Products</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* MOBILE SORT */}
            <div className="relative sm:hidden">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-gray-800 bg-gray-900 px-3 pr-8 text-xs text-gray-300 outline-none"
              >
                <option value="">Sort Products</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* =========================
            FILTER PANEL
        ========================= */}
        <div
          className={`mb-4 rounded-xl border border-gray-800 bg-gray-900/70 p-3 transition-all duration-300 sm:block ${
            showFilters ? "block" : "hidden"
          }`}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* =========================
                CATEGORY DROPDOWN
            ========================= */}
            <div className="relative">
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Category
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "category" ? null : "category",
                  )
                }
                className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs text-white transition-all duration-200 hover:border-gray-700"
              >
                <span className="truncate">
                  {category === "All" ? "All Categories" : category}
                </span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                    openDropdown === "category" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* CATEGORY MENU */}
              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1 origin-top rounded-lg border border-gray-800 bg-gray-900 p-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
                  openDropdown === "category"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="max-h-56 overflow-y-auto">
                  {UniqueCategory.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-all duration-150 ${
                        category === item
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span>{item === "All" ? "All Categories" : item}</span>

                      {category === item && (
                        <Check size={13} className="text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =========================
                BRAND DROPDOWN
            ========================= */}
            <div className="relative">
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Brand
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "brand" ? null : "brand")
                }
                className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs text-white transition-all duration-200 hover:border-gray-700"
              >
                <span className="truncate">
                  {brand === "All" ? "All Brands" : brand}
                </span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                    openDropdown === "brand" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* BRAND MENU */}
              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1 origin-top rounded-lg border border-gray-800 bg-gray-900 p-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
                  openDropdown === "brand"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="max-h-56 overflow-y-auto">
                  {UniqueBrand.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setBrand(item);
                        setOpenDropdown(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-all duration-150 ${
                        brand === item
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span>{item === "All" ? "All Brands" : item}</span>

                      {brand === item && (
                        <Check size={13} className="text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =========================
                PRICE DROPDOWN
            ========================= */}
            <div className="relative">
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Price
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "price" ? null : "price")
                }
                className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs text-white transition-all duration-200 hover:border-gray-700"
              >
                <span className="truncate">{getPriceLabel()}</span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-500 transition-transform duration-200 ${
                    openDropdown === "price" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* PRICE MENU */}
              <div
                className={`absolute left-0 right-0 top-full z-50 mt-1 origin-top rounded-lg border border-gray-800 bg-gray-900 p-1 shadow-2xl shadow-black/40 transition-all duration-200 ${
                  openDropdown === "price"
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                {priceOptions.map((item) => {
                  const selected = getPriceLabel() === item.label;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => handlePriceChange(item.value)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-all duration-150 ${
                        selected
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>

                      {selected && (
                        <Check size={13} className="text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =========================
                CLEAR BUTTON
            ========================= */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs text-gray-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
              >
                <X size={13} />
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            RESULT INFO
        ========================= */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-300">{products.length}</span>{" "}
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
              className="text-[11px] text-blue-400 transition hover:text-blue-300"
            >
              Reset
            </button>
          )}
        </div>

        {/* =========================
            PRODUCTS GRID
        ========================= */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          /* =========================
              EMPTY STATE
          ========================= */
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/40 px-5 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <Search size={20} className="text-gray-600" />
            </div>

            <h2 className="text-sm font-semibold text-gray-300">
              No products found
            </h2>

            <p className="mt-1 max-w-sm text-xs text-gray-600">
              Try changing your search or filters to find something else.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
