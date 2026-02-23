import React, { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { Button } from "@windmill/react-ui";
import Uploader from "../image-uploader/Uploader";

const DesignerImageUploader = ({
  variantId,
  designerImages = {},
  onImagesChange,
  designerPrices = {},
  onPricesChange,
}) => {
  const [showUploader, setShowUploader] = useState(null);

  // Initialize with proper structure
  const initialImages = {
    front: designerImages?.front || "",
    back: designerImages?.back || "",
    left: designerImages?.left || "",
    right: designerImages?.right || "",
  };

  const initialPrices = {
    front: designerPrices?.front || 0,
    back: designerPrices?.back || 0,
    left: designerPrices?.left || 0,
    right: designerPrices?.right || 0,
  };

  const [imageUrls, setImageUrls] = useState(initialImages);
  const [sidePrices, setSidePrices] = useState(initialPrices);

  // keep local state in sync if parent provides new designerImages
  useEffect(() => {
    console.log(
      "[DesignerImageUploader] designerImages prop changed:",
      designerImages,
    );
    const updatedImages = {
      front: designerImages?.front || "",
      back: designerImages?.back || "",
      left: designerImages?.left || "",
      right: designerImages?.right || "",
    };
    console.log("[DesignerImageUploader] Setting imageUrls to:", updatedImages);
    setImageUrls(updatedImages);
  }, [designerImages]);

  // keep local prices in sync if parent provides new designerPrices
  useEffect(() => {
    const updatedPrices = {
      front: designerPrices?.front || 0,
      back: designerPrices?.back || 0,
      left: designerPrices?.left || 0,
      right: designerPrices?.right || 0,
    };
    setSidePrices(updatedPrices);
  }, [designerPrices]);

  const views = [
    { key: "front", label: "Front View" },
    { key: "back", label: "Back View" },
    { key: "left", label: "Left Side" },
    { key: "right", label: "Right Side" },
  ];

  const handleImageUpload = (view, url) => {
    console.log("[DesignerImageUploader] handleImageUpload called:", {
      view,
      url,
    });
    const updated = { ...imageUrls, [view]: url };
    console.log("[DesignerImageUploader] updated images:", updated);
    setImageUrls(updated);
    if (typeof onImagesChange === "function") onImagesChange(updated);
    setShowUploader(null);
  };

  const handleRemoveImage = (view) => {
    const updated = { ...imageUrls, [view]: "" };
    setImageUrls(updated);
    if (typeof onImagesChange === "function") onImagesChange(updated);
  };

  const handlePriceChange = (view, value) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...sidePrices, [view]: numValue };
    setSidePrices(updated);
    if (typeof onPricesChange === "function") onPricesChange(updated);
  };

  console.log("[DesignerImageUploader] Render - imageUrls:", imageUrls);
  console.log("[DesignerImageUploader] Render - each view check:", {
    front: !!imageUrls.front,
    back: !!imageUrls.back,
    left: !!imageUrls.left,
    right: !!imageUrls.right,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {views.map((view) => {
        const hasImage =
          imageUrls && imageUrls[view.key] && imageUrls[view.key].trim() !== "";
        console.log(`[DesignerImageUploader] Rendering ${view.key}:`, {
          hasImage,
          url: imageUrls[view.key],
        });

        return (
          <div key={view.key} className="relative">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {view.label}
            </label>

            {/* Extra Price Input */}
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Extra Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sidePrices[view.key] || 0}
                onChange={(e) => handlePriceChange(view.key, e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
                placeholder="0.00"
              />
            </div>

            {hasImage ? (
              <div className="relative group">
                <div className="w-full h-24 bg-gray-100 rounded border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                  <img
                    src={imageUrls[view.key]}
                    alt={view.label}
                    className="max-w-full max-h-full object-contain"
                    onError={() => {
                      // remove broken image so user can re-upload
                      console.warn(
                        `Designer image failed to load for ${view.key}`,
                        imageUrls[view.key],
                      );
                      handleRemoveImage(view.key);
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(view.key)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <FiX size={12} />
                </button>
                <button
                  onClick={() => setShowUploader(view.key)}
                  className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
                  type="button"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowUploader(view.key)}
                className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                type="button"
              >
                <FiUpload className="mb-1" />
                <span className="text-xs">Upload</span>
              </button>
            )}

            {/* Inline Uploader Modal */}
            {showUploader === view.key && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Upload {view.label}
                    </h3>
                    <button
                      onClick={() => setShowUploader(null)}
                      className="text-gray-500 hover:text-gray-700"
                      type="button"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <Uploader
                    folder="designer-images"
                    // Uploader expects single string for non-product mode; pass current url as string
                    imageUrl={imageUrls[view.key] || ""}
                    setImageUrl={(result) => {
                      // Uploader may call setImageUrl with a string (single upload) or with an array when used in product mode.
                      let url = "";
                      if (!result) {
                        console.warn(
                          "[DesignerImageUploader] Uploader returned empty result for",
                          view.key,
                          result,
                        );
                        return;
                      }
                      if (Array.isArray(result)) {
                        url = result[0] || "";
                      } else if (typeof result === "string") {
                        url = result;
                      } else {
                        // unexpected shape
                        console.warn(
                          "[DesignerImageUploader] Unexpected uploader result shape:",
                          result,
                        );
                        return;
                      }

                      if (url && url.trim().length > 0) {
                        handleImageUpload(view.key, url.trim());
                      } else {
                        console.warn(
                          "[DesignerImageUploader] Resolved url is empty for",
                          view.key,
                          result,
                        );
                      }
                    }}
                  />

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => setShowUploader(null)}
                      layout="outline"
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesignerImageUploader;
