import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { Button, Input } from "@windmill/react-ui";
import { notifySuccess, notifyError } from "@/utils/toast";

const SizeVariantManager = ({
  variants = [],
  onVariantsChange,
  currency = "$",
  defaultPrice = 0,
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentSize, setCurrentSize] = useState({
    width: "",
    height: "",
    unit: "inch",
    image: "",
    sku: "",
    barcode: "",
    quantity: "",
    pricingTiers: [
      {
        quantity: 50,
        basePrice: defaultPrice,
        discount: 0,
        finalPrice: defaultPrice,
      },
    ],
  });

  // Update base price when defaultPrice changes
  useEffect(() => {
    if (defaultPrice > 0 && !editingIndex) {
      setCurrentSize((prev) => ({
        ...prev,
        pricingTiers: prev.pricingTiers.map((tier) => ({
          ...tier,
          basePrice: tier.basePrice === 0 ? defaultPrice : tier.basePrice,
          finalPrice: tier.basePrice === 0 ? defaultPrice : tier.finalPrice,
        })),
      }));
    }
  }, [defaultPrice, editingIndex]);

  const addSizeVariant = () => {
    if (!currentSize.width || !currentSize.height) {
      notifyError("Please enter both width and height");
      return;
    }

    if (currentSize.pricingTiers[0].basePrice <= 0) {
      notifyError("Please enter a valid base price");
      return;
    }

    const sizeLabel = `${currentSize.width}" x ${currentSize.height}" (${currentSize.unit})`;

    // Clean up pricing tiers - convert empty strings to numbers
    const cleanedPricingTiers = currentSize.pricingTiers.map((tier) => ({
      quantity: parseFloat(tier.quantity) || 0,
      basePrice: parseFloat(tier.basePrice) || 0,
      discount: parseFloat(tier.discount) || 0,
      finalPrice: parseFloat(tier.finalPrice) || 0,
    }));

    const newVariant = {
      ...currentSize,
      quantity: parseInt(currentSize.quantity) || 0,
      pricingTiers: cleanedPricingTiers,
      combination: sizeLabel,
      id: Date.now(),
    };

    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = newVariant;
      onVariantsChange(updated);
      notifySuccess("Size variant updated");
      setEditingIndex(null);
    } else {
      onVariantsChange([...variants, newVariant]);
      notifySuccess("Size variant added");
    }

    // Reset form
    setCurrentSize({
      width: "",
      height: "",
      unit: "inch",
      image: "",
      sku: "",
      barcode: "",
      quantity: "",
      pricingTiers: [
        {
          quantity: 50,
          basePrice: defaultPrice || 0,
          discount: 0,
          finalPrice: defaultPrice || 0,
        },
      ],
    });
  };

  const editSizeVariant = (index) => {
    setCurrentSize(variants[index]);
    setEditingIndex(index);
  };

  const deleteSizeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    onVariantsChange(updated);
    notifySuccess("Size variant deleted");
  };

  const addPricingTier = () => {
    const lastTier =
      currentSize.pricingTiers[currentSize.pricingTiers.length - 1];
    const newQuantity = lastTier.quantity + 50;
    const basePriceToUse = lastTier.basePrice || defaultPrice || 0;

    setCurrentSize({
      ...currentSize,
      pricingTiers: [
        ...currentSize.pricingTiers,
        {
          quantity: newQuantity,
          basePrice: basePriceToUse,
          discount: 0,
          finalPrice: basePriceToUse,
        },
      ],
    });
  };

  const removePricingTier = (tierIndex) => {
    if (currentSize.pricingTiers.length <= 1) {
      notifyError("At least one pricing tier is required");
      return;
    }

    const updated = currentSize.pricingTiers.filter((_, i) => i !== tierIndex);
    setCurrentSize({ ...currentSize, pricingTiers: updated });
  };

  const updatePricingTier = (tierIndex, field, value) => {
    const updated = [...currentSize.pricingTiers];

    // Allow empty string for input, convert to number only when calculating
    if (value === "" || value === null || value === undefined) {
      updated[tierIndex][field] = "";
    } else {
      updated[tierIndex][field] = value;
    }

    // Auto-calculate final price when discount or basePrice changes
    if (field === "discount" || field === "basePrice") {
      const basePrice =
        parseFloat(
          field === "basePrice" ? value : updated[tierIndex].basePrice,
        ) || 0;
      const discount =
        parseFloat(
          field === "discount" ? value : updated[tierIndex].discount,
        ) || 0;
      updated[tierIndex].finalPrice = basePrice - (basePrice * discount) / 100;
    }

    setCurrentSize({ ...currentSize, pricingTiers: updated });
  };

  const calculateTotalPrice = (tier) => {
    return (tier.finalPrice * tier.quantity).toFixed(2);
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Add/Edit Size Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          {editingIndex !== null ? "Edit Size Variant" : "Add New Size Variant"}
        </h3>

        {/* Size Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Width
            </label>
            <Input
              type="number"
              step="0.1"
              value={currentSize.width}
              onChange={(e) =>
                setCurrentSize({ ...currentSize, width: e.target.value })
              }
              placeholder="e.g., 7.5"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Height
            </label>
            <Input
              type="number"
              step="0.1"
              value={currentSize.height}
              onChange={(e) =>
                setCurrentSize({ ...currentSize, height: e.target.value })
              }
              placeholder="e.g., 3.75"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Unit
            </label>
            <select
              value={currentSize.unit}
              onChange={(e) =>
                setCurrentSize({ ...currentSize, unit: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="inch">Inch</option>
              <option value="cm">CM</option>
            </select>
          </div>
        </div>

        {/* SKU & Barcode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              SKU
            </label>
            <Input
              type="text"
              value={currentSize.sku}
              onChange={(e) =>
                setCurrentSize({ ...currentSize, sku: e.target.value })
              }
              placeholder="Product SKU"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
              Barcode
            </label>
            <Input
              type="text"
              value={currentSize.barcode}
              onChange={(e) =>
                setCurrentSize({ ...currentSize, barcode: e.target.value })
              }
              placeholder="Product Barcode"
              className="w-full"
            />
          </div>
        </div>

        {/* Pricing Tiers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">
              Quantity Pricing Tiers
            </h4>
            <Button
              onClick={addPricingTier}
              size="small"
              className="flex items-center bg-blue-500 hover:bg-blue-600"
            >
              <FiPlus className="mr-1" /> Add Tier
            </Button>
          </div>

          <div className="space-y-3">
            {currentSize.pricingTiers.map((tier, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      value={tier.quantity}
                      onChange={(e) =>
                        updatePricingTier(index, "quantity", e.target.value)
                      }
                      className="w-full"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Base Price ({currency})
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.basePrice}
                      onChange={(e) =>
                        updatePricingTier(index, "basePrice", e.target.value)
                      }
                      className="w-full"
                      placeholder="2.80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Discount (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={tier.discount === "" ? "" : tier.discount}
                      onChange={(e) =>
                        updatePricingTier(index, "discount", e.target.value)
                      }
                      className="w-full"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Final Price ({currency})
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.finalPrice.toFixed(2)}
                      disabled
                      className="w-full bg-gray-100 dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Total
                      </div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {currency} {calculateTotalPrice(tier)}
                      </div>
                    </div>
                    {currentSize.pricingTiers.length > 1 && (
                      <button
                        onClick={() => removePricingTier(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={addSizeVariant}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {editingIndex !== null ? "Update Size" : "Add Size"}
          </Button>
          {editingIndex !== null && (
            <Button
              onClick={() => {
                setEditingIndex(null);
                setCurrentSize({
                  width: "",
                  height: "",
                  unit: "inch",
                  image: "",
                  sku: "",
                  barcode: "",
                  quantity: "",
                  pricingTiers: [
                    {
                      quantity: 50,
                      basePrice: defaultPrice || 0,
                      discount: 0,
                      finalPrice: defaultPrice || 0,
                    },
                  ],
                });
              }}
              layout="outline"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>

      {/* Display Existing Variants */}
      {variants.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Size Variants ({variants.length})
          </h3>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id || index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {variant.combination}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      SKU: {variant.sku || "N/A"} | Barcode:{" "}
                      {variant.barcode || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editSizeVariant(index)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSizeVariant(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pricing Tiers Display */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pricing Tiers:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {variant.pricingTiers.map((tier, tIndex) => (
                      <div
                        key={tIndex}
                        className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {tier.quantity} pieces
                        </div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {currency} {tier.finalPrice.toFixed(2)} each
                        </div>
                        {tier.discount > 0 && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            {tier.discount}% off
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {currency} {calculateTotalPrice(tier)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeVariantManager;
