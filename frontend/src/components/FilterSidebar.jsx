import React from "react";

const FilterSidebar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  allProducts,
}) => {
  const Categories = allProducts.map((p) => p.category);
  const UniqueCategory = ["All", ...new Set(Categories)];

  const Brand = allProducts.map((p) => p.brand);
  const UniqueBrand = ["All", ...new Set(Brand)];

  const handleCategoryClick = (val) => {
    setCategory(val);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleMinChange = (e) => {
    const value = Number(e.target.value);

    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);

    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  return (
    <div
      className="
      
        sticky top-20
        h-[calc(100vh-100px)]
        w-full max-w-sm
        overflow-y-auto
        scrollbar-hide
        rounded-lg
        border border-gray-800
        bg-gray-900
        p-5
        text-white
        shadow
      "
    >
      {/* Search */}
      <div className="mb-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="
            w-full rounded-lg
            border border-gray-700
            bg-gray-800
            px-4 py-2
            text-white
            outline-none
            placeholder:text-gray-500
            focus:border-white
          "
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <h1 className="mb-3 text-[17px] font-semibold text-white">Category</h1>

        <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
          {UniqueCategory.map((item, index) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <input
                  id={`radio-${item}`}
                  type="radio"
                  checked={category === item}
                  onChange={() => handleCategoryClick(item)}
                  className="h-4 w-4 cursor-pointer accent-white"
                />

                <label
                  htmlFor={`radio-${item}`}
                  className="cursor-pointer text-gray-400 transition hover:text-white"
                >
                  {item}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-3 ">
        <h1 className="mb-2  text-[15px] font-semibold text-white">Brand</h1>

        <div className="max-h-48 scrollbar-hide overflow-y-auto rounded-lg border border-gray-700 bg-gray-800">
          {UniqueBrand.map((item, index) => (
            <div
              key={index}
              onClick={() => handleBrandChange({ target: { value: item } })}
              className={`cursor-pointer px-3 py-2 text-white hover:bg-gray-700 ${
                brand === item ? "bg-gray-700" : ""
              }`}
            >
              {item.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h1 className="mb-3 text-lg font-semibold text-white">Price Range</h1>

        <p className="mb-2 text-sm text-gray-400">
          Price: ₹{priceRange[0]} - ₹{priceRange[1]}
        </p>

        {/* Price Inputs */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={handleMinChange}
            min="0"
            max="5000"
            className="
              w-full rounded-lg
              border border-gray-700
              bg-gray-800
              px-3 py-2
              text-white
              outline-none
              focus:border-white
            "
          />

          <span className="text-gray-500">-</span>

          <input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxChange}
            min="0"
            max="999999"
            className="
              w-full rounded-lg
              border border-gray-700
              bg-gray-800
              px-3 py-2
              text-white
              outline-none
              focus:border-white
            "
          />
        </div>

        {/* Min Range */}
        <input
          type="range"
          value={priceRange[0]}
          onChange={handleMinChange}
          min="0"
          max="5000"
          step="100"
          className="
            mt-4
            w-full
            cursor-pointer
            accent-white
          "
        />

        {/* Max Range */}
        <input
          type="range"
          value={priceRange[1]}
          onChange={handleMaxChange}
          min="0"
          max="999999"
          step="100"
          className="
            w-full
            cursor-pointer
            accent-white
          "
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="
          w-full rounded-lg
          bg-white
          px-4 py-2.5
          font-medium
          cursor-pointer
          text-black
          transition
          hover:bg-gray-200
          active:scale-95
        "
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
