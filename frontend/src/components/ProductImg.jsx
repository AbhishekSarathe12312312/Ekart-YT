import React, { useState } from "react";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url);
  return (
    <div className="flex gap-5">
      {/* Thumbnail Images */}
      <div className="flex flex-col gap-3">
        {images.map((img, index) => {
          return (
            <div
              key={index}
              onClick={() => setMainImg(img.url)}
              className="h-20 w-20 cursor-pointer overflow-hidden rounded-lg border border-gray-300 hover:border-blue-500"
            >
              <img
                src={img.url}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Main Image */}
      <div className="h-[400px] w-[400px] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={mainImg}
          alt="Product"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default ProductImg;
