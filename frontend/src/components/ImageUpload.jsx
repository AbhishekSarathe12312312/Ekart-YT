import React, { useEffect } from "react";
import { X } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files],
      }));
    }
    // Reset the target value so users can upload the same file again if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    // If the image is an ObjectURL, revoke it to free memory
    const fileToRemove = productData.productImg[index];
    if (fileToRemove && fileToRemove._previewUrl) {
      URL.revokeObjectURL(fileToRemove._previewUrl);
    }

    setProductData((prev) => {
      const updatedImages = prev.productImg.filter((_, i) => i !== index);
      return { ...prev, productImg: updatedImages };
    });
  };

  // Clean up object URLs when the component unmounts to prevent leaks
  useEffect(() => {
    return () => {
      productData.productImg.forEach((file) => {
        if (file && file._previewUrl) {
          URL.revokeObjectURL(file._previewUrl);
        }
      });
    };
  }, [productData.productImg]);

  return (
    <div className="mt-4">
      {/* Label */}
      <label
        htmlFor="file-upload"
        className="block mb-2 text-sm font-semibold text-gray-400"
      >
        Product Images
      </label>

      {/* File Input */}
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {/* Upload Button */}
      <label
        htmlFor="file-upload"
        className="inline-flex items-center justify-center px-2 py-1
                 border border-gray-300 rounded-lg
                 bg-gray-50 text-gray-700 font-medium
                 cursor-pointer
                 hover:bg-gray-100 hover:border-gray-400
                 transition duration-200"
      >
        Upload Images
      </label>

      {/* Image Preview */}
      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
          {productData.productImg.map((file, idx) => {
            let preview;

            if (file instanceof File) {
              if (!file._previewUrl) {
                file._previewUrl = URL.createObjectURL(file);
              }

              preview = file._previewUrl;
            } else if (typeof file === "string") {
              preview = file;
            } else if (file?.url) {
              preview = file.url;
            } else {
              return null;
            }

            return (
              <div
                key={file.id || file.name || idx}
                className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
              >
                <img
                  src={preview}
                  alt={`preview-${idx}`}
                  className="h-full w-full object-cover"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-2 top-2
                           flex h-7 w-7 items-center justify-center
                           rounded-full bg-red-500
                           text-white shadow
                           hover:bg-red-600
                           transition duration-200"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
