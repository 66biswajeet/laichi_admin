import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  TableBody,
  TableCell,
  TableRow,
  Input,
  Button,
} from "@windmill/react-ui";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import DesignerImageUploader from "@/components/variant/DesignerImageUploader";
import Uploader from "@/components/image-uploader/Uploader";

//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CombinationInput from "@/components/form/input/CombinationInput";
import SkuBarcodeInput from "@/components/form/selectOption/SkuBarcodeInput";
import EditDeleteButtonTwo from "@/components/table/EditDeleteButtonTwo";
import { notifySuccess, notifyError } from "@/utils/toast";

const AttributeListTable = ({
  variants,
  setTapValue,
  variantTitle,
  deleteModalShow,
  isBulkUpdate,
  handleSkuBarcode,
  handleEditVariant,
  handleRemoveVariant,
  handleQuantityPrice,
  handleSelectInlineImage,
  onUpdateSizeVariant,
  onUpdateVariant,
}) => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const [editingTier, setEditingTier] = useState(null); // { variantIndex, tierIndex }
  const [editedTierData, setEditedTierData] = useState({});
  const [expandedVariant, setExpandedVariant] = useState(null); // variantIndex being edited
  const [editedDesignerImages, setEditedDesignerImages] = useState({});
  const [editedDesignerPrices, setEditedDesignerPrices] = useState({});
  const [editedDesignerEnabledSides, setEditedDesignerEnabledSides] = useState(
    {},
  );
  const [editedPrintingOptions, setEditedPrintingOptions] = useState({});
  const [showPrinterUploader, setShowPrinterUploader] = useState(null);
  // sizeDetails: { XS: { inStock: bool, stockCount: number, price: number }, ... }
  const [editedSizeDetails, setEditedSizeDetails] = useState({});
  const [customSizeInput, setCustomSizeInput] = useState("");

  const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

  const startEditingTier = (variantIndex, tierIndex, tier) => {
    setEditingTier({ variantIndex, tierIndex });
    setEditedTierData({ ...tier });
  };

  const cancelEditingTier = () => {
    setEditingTier(null);
    setEditedTierData({});
  };

  const saveEditedTier = (variantIndex, tierIndex) => {
    const variant = variants[variantIndex];
    const updatedTiers = [...variant.pricingTiers];

    // Recalculate final price
    const discount = parseFloat(editedTierData.discount) || 0;
    const basePrice = parseFloat(editedTierData.basePrice) || 0;
    const finalPrice = basePrice - (basePrice * discount) / 100;

    updatedTiers[tierIndex] = {
      ...editedTierData,
      basePrice,
      discount,
      finalPrice,
      quantity: parseInt(editedTierData.quantity) || 0,
    };

    const updatedVariant = {
      ...variant,
      pricingTiers: updatedTiers,
    };

    if (onUpdateSizeVariant) {
      onUpdateSizeVariant(variantIndex, updatedVariant);
    }

    notifySuccess("Pricing tier updated");
    setEditingTier(null);
    setEditedTierData({});
  };

  const deletePricingTier = (variantIndex, tierIndex) => {
    const variant = variants[variantIndex];

    if (variant.pricingTiers.length <= 1) {
      notifyError("At least one pricing tier is required");
      return;
    }

    const updatedTiers = variant.pricingTiers.filter((_, i) => i !== tierIndex);
    const updatedVariant = {
      ...variant,
      pricingTiers: updatedTiers,
    };

    if (onUpdateSizeVariant) {
      onUpdateSizeVariant(variantIndex, updatedVariant);
    }

    notifySuccess("Pricing tier deleted");
  };

  const updateTierField = (field, value) => {
    setEditedTierData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addNewPricingTier = (variantIndex) => {
    const variant = variants[variantIndex];
    const lastTier = variant.pricingTiers[variant.pricingTiers.length - 1];

    // Calculate next quantity (increment by 50)
    const newQuantity = lastTier.quantity + 50;

    const newTier = {
      quantity: newQuantity,
      basePrice: lastTier.basePrice,
      discount: 0,
      finalPrice: lastTier.basePrice,
    };

    const updatedTiers = [...variant.pricingTiers, newTier];
    const updatedVariant = {
      ...variant,
      pricingTiers: updatedTiers,
    };

    if (onUpdateSizeVariant) {
      onUpdateSizeVariant(variantIndex, updatedVariant);
    }

    notifySuccess(`New tier added: ${newQuantity} pieces`);
  };

  const startEditingVariantDesigner = (variantIndex) => {
    const variant = variants[variantIndex];
    setExpandedVariant(variantIndex);
    setEditedDesignerImages(
      variant.designerImages || { front: "", back: "", left: "", right: "" },
    );
    setEditedDesignerPrices(
      variant.designerPrices || { front: 0, back: 0, left: 0, right: 0 },
    );
    setEditedDesignerEnabledSides(
      variant.designerEnabledSides || {
        front: true,
        back: true,
        left: true,
        right: true,
      },
    );
    setEditedPrintingOptions(
      variant.designerPrintingOptions || {
        dtg: { enabled: false, image: "", description: "" },
        dtf: { enabled: false, image: "", description: "" },
      },
    );

    // Build sizeDetails from existing data (includes custom sizes) or fall back to AVAILABLE_SIZES
    const existingSizeDetails = variant.sizeDetails || {};
    const fallbackAvailableSizes = variant.availableSizes || [];
    const initialSizeDetails = {};

    // Start with any existing keys (preserve custom sizes like 3XL, 4XL, etc.)
    Object.keys(existingSizeDetails).forEach((sz) => {
      const d = existingSizeDetails[sz] || {};
      initialSizeDetails[sz] = {
        inStock: d.inStock !== false,
        stockCount: d.stockCount || 0,
        price: d.price || 0,
      };
    });

    // Ensure default AVAILABLE_SIZES exist in the object
    AVAILABLE_SIZES.forEach((size) => {
      if (!initialSizeDetails[size]) {
        initialSizeDetails[size] = {
          inStock: fallbackAvailableSizes.includes(size),
          stockCount: 0,
          price: 0,
        };
      }
    });

    setEditedSizeDetails(initialSizeDetails);
    setCustomSizeInput("");
  };

  const cancelEditingVariantDesigner = () => {
    setExpandedVariant(null);
    setEditedDesignerImages({});
    setEditedDesignerPrices({});
    setEditedDesignerEnabledSides({});
    setEditedSizeDetails({});
    setCustomSizeInput("");
    setEditedPrintingOptions({});
  };

  const saveVariantDesignerChanges = (variantIndex) => {
    const variant = variants[variantIndex];
    // Derive availableSizes array for backward compatibility
    const availableSizes = Object.entries(editedSizeDetails)
      .filter(([, detail]) => detail.inStock)
      .map(([size]) => size);

    const updatedVariant = {
      ...variant,
      designerImages: editedDesignerImages,
      designerPrices: editedDesignerPrices,
      designerEnabledSides: editedDesignerEnabledSides,
      designerPrintingOptions: editedPrintingOptions,
      sizeDetails: editedSizeDetails,
      availableSizes, // kept for backward compat
    };

    console.log("[AttributeListTable] Saving variant designer changes:", {
      variantIndex,
      originalVariant: variant,
      updatedVariant,
    });

    // Call parent update handler (onUpdateVariant is universal handler)
    if (typeof onUpdateVariant === "function") {
      onUpdateVariant(variantIndex, updatedVariant);
    } else if (typeof onUpdateSizeVariant === "function") {
      // Fallback to size variant handler
      onUpdateSizeVariant(variantIndex, updatedVariant);
    }

    notifySuccess("Variant updated successfully");
    cancelEditingVariantDesigner();
  };

  // Toggle inStock flag for a size
  const toggleSizeInStock = (size) => {
    setEditedSizeDetails((prev) => ({
      ...prev,
      [size]: { ...prev[size], inStock: !prev[size].inStock },
    }));
  };

  // Update stock count for a specific size
  const updateSizeStockCount = (size, value) => {
    const count = parseInt(value) || 0;
    setEditedSizeDetails((prev) => ({
      ...prev,
      [size]: { ...prev[size], stockCount: count },
    }));
  };

  // Update price for a specific size
  const updateSizePrice = (size, value) => {
    const price = parseFloat(value) || 0;
    setEditedSizeDetails((prev) => ({
      ...prev,
      [size]: { ...prev[size], price },
    }));
  };

  // Add a custom size label (e.g., 3XL)
  const addCustomSize = () => {
    const label = String(customSizeInput || "")
      .trim()
      .toUpperCase();
    if (!label) {
      notifyError("Please enter a size label");
      return;
    }
    if (editedSizeDetails[label]) {
      notifyError("Size already exists");
      return;
    }
    const updated = {
      ...editedSizeDetails,
      [label]: { inStock: true, stockCount: 0, price: 0 },
    };
    setEditedSizeDetails(updated);
    setCustomSizeInput("");
    notifySuccess(`Added size ${label}`);
  };

  return (
    <>
      <TableBody>
        {variants?.map((variant, i) => {
          // Check if this is a size variant with pricing tiers
          const isSizeVariant =
            variant.variantType === "size" && variant.pricingTiers;

          // When editing, render sizes from editedSizeDetails (which may include custom sizes)
          const sizesToRender =
            Object.keys(editedSizeDetails).length > 0
              ? Object.keys(editedSizeDetails)
              : AVAILABLE_SIZES;

          if (isSizeVariant) {
            // Render size variant differently
            return (
              <React.Fragment key={i + 1}>
                <TableRow className="bg-blue-50 dark:bg-blue-900">
                  <TableCell>
                    <div className="flex items-center">
                      {variant.image ? (
                        <span>
                          <Avatar
                            className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                            src={variant.image}
                            alt="product"
                          />
                          <p
                            className="text-xs cursor-pointer text-blue-600"
                            onClick={() => handleSelectInlineImage(i)}
                          >
                            {t("Change")}
                          </p>
                        </span>
                      ) : (
                        <span>
                          <Avatar
                            src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                            alt="product"
                            className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                          />
                          <p
                            className="text-xs cursor-pointer text-blue-600"
                            onClick={() => handleSelectInlineImage(i)}
                          >
                            {t("Change")}
                          </p>
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {variant.combination}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Size Variant ({variant.pricingTiers.length} tiers)
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <SkuBarcodeInput
                      id={i}
                      name="sku"
                      placeholder="Sku"
                      value={variant.sku}
                      handleSkuBarcode={handleSkuBarcode}
                    />
                  </TableCell>

                  <TableCell>
                    <SkuBarcodeInput
                      id={i}
                      name="barcode"
                      placeholder="Barcode"
                      value={variant.barcode}
                      handleSkuBarcode={handleSkuBarcode}
                    />
                  </TableCell>

                  <TableCell colSpan={2}>
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Pricing Tiers Below ↓
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-sm">
                    <CombinationInput
                      id={i}
                      name="quantity"
                      placeholder="Quantity"
                      variant={variant}
                      isBulkUpdate={isBulkUpdate}
                      handleQuantityPrice={handleQuantityPrice}
                      value={variant.quantity || 0}
                    />
                  </TableCell>

                  <TableCell>
                    <EditDeleteButtonTwo
                      attribute
                      variant={variant}
                      setTapValue={setTapValue}
                      deleteModalShow={deleteModalShow}
                      handleEditVariant={handleEditVariant}
                      handleRemoveVariant={handleRemoveVariant}
                    />
                  </TableCell>
                </TableRow>

                {/* Pricing Tier Rows */}
                {variant.pricingTiers.map((tier, tIndex) => {
                  const isEditing =
                    editingTier?.variantIndex === i &&
                    editingTier?.tierIndex === tIndex;

                  return (
                    <TableRow
                      key={`${i}-tier-${tIndex}`}
                      className="bg-white dark:bg-gray-800 border-l-4 border-blue-400"
                    >
                      <TableCell colSpan={2}></TableCell>
                      <TableCell colSpan={2}>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editedTierData.quantity}
                              onChange={(e) =>
                                updateTierField("quantity", e.target.value)
                              }
                              className="w-24 text-xs"
                              placeholder="Qty"
                            />
                            <span className="text-xs">pieces</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {tier.quantity} pieces
                            </span>
                            {tier.discount > 0 && (
                              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                {tier.discount}% off
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                value={editedTierData.basePrice}
                                onChange={(e) =>
                                  updateTierField("basePrice", e.target.value)
                                }
                                className="w-20 text-xs"
                                placeholder="Base"
                              />
                            </div>
                          </div>
                        ) : (
                          <span>Base: ${tier.basePrice.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.1"
                                value={editedTierData.discount}
                                onChange={(e) =>
                                  updateTierField("discount", e.target.value)
                                }
                                className="w-16 text-xs"
                                placeholder="%"
                              />
                              <span className="text-xs">%</span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              Final: $
                              {(
                                editedTierData.basePrice -
                                (editedTierData.basePrice *
                                  editedTierData.discount) /
                                  100
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              Final: ${tier.finalPrice.toFixed(2)}
                            </span>
                            <div className="text-gray-500 text-xs">
                              Total: $
                              {(tier.finalPrice * tier.quantity).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell colSpan={2}>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEditedTier(i, tIndex)}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"
                              title="Save"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditingTier}
                              className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title="Cancel"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                            {variant.pricingTiers.length > 1 && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete the ${tier.quantity} pieces tier?`,
                                    )
                                  ) {
                                    cancelEditingTier();
                                    deletePricingTier(i, tIndex);
                                  }
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                                title="Delete Tier"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingTier(i, tIndex, tier)}
                              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                              title="Edit Tier"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            {variant.pricingTiers.length > 1 && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete the ${tier.quantity} pieces tier?`,
                                    )
                                  ) {
                                    deletePricingTier(i, tIndex);
                                  }
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                                title="Delete Tier"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Add New Tier Button Row */}
                <TableRow className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-300">
                  <TableCell colSpan={8}>
                    <div className="flex justify-center py-2">
                      <Button
                        onClick={() => addNewPricingTier(i)}
                        size="small"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add New Tier for {variant.combination}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          }

          // Traditional variant rendering
          return (
            <React.Fragment key={i + 1}>
              <TableRow>
                <TableCell>
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center">
                      {variant.image ? (
                        <span>
                          <Avatar
                            className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                            src={variant.image}
                            alt="product"
                          />
                          <p
                            className="text-xs cursor-pointer"
                            onClick={() => handleSelectInlineImage(i)}
                          >
                            {t("Change")}
                          </p>
                        </span>
                      ) : (
                        <span>
                          <Avatar
                            src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                            alt="product"
                            className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                          />
                          <p
                            className="text-xs cursor-pointer"
                            onClick={() => handleSelectInlineImage(i)}
                          >
                            {t("Change")}
                          </p>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => startEditingVariantDesigner(i)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                    >
                      <FiEdit2 className="w-3 h-3" />
                      Edit Designer
                    </button>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col text-sm">
                    {variantTitle?.length > 0 && (
                      <span>
                        {variantTitle
                          ?.map((att) => {
                            const attributeData = att?.variants?.filter(
                              (val) => val?.name !== "All",
                            );

                            const attributeName = attributeData?.find(
                              (v) => v._id === variant[att?._id],
                            )?.name;
                            if (attributeName === undefined) {
                              return attributeName?.en;
                            } else {
                              return showingTranslateValue(attributeName);
                            }
                          })
                          ?.filter(Boolean)
                          .join(" ")}
                      </span>
                    )}

                    {variant.productId && (
                      <span className="text-xs productId text-gray-500">
                        ({variant.productId})
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <SkuBarcodeInput
                    id={i}
                    name="sku"
                    placeholder="Sku"
                    value={variant.sku}
                    handleSkuBarcode={handleSkuBarcode}
                  />
                </TableCell>

                <TableCell>
                  <SkuBarcodeInput
                    id={i}
                    name="barcode"
                    placeholder="Barcode"
                    value={variant.barcode}
                    handleSkuBarcode={handleSkuBarcode}
                  />
                </TableCell>

                <TableCell className="font-medium text-sm">
                  <CombinationInput
                    id={i}
                    // readOnly
                    name="originalPrice"
                    placeholder="Original Price"
                    variant={variant}
                    isBulkUpdate={isBulkUpdate}
                    value={variant.originalPrice || ""}
                    handleQuantityPrice={handleQuantityPrice}
                  />
                </TableCell>

                <TableCell className="font-medium text-sm">
                  <CombinationInput
                    id={i}
                    name="price"
                    placeholder="Sale price"
                    variant={variant}
                    isBulkUpdate={isBulkUpdate}
                    value={variant.price || ""}
                    handleQuantityPrice={handleQuantityPrice}
                  />
                </TableCell>

                <TableCell className="font-medium text-sm">
                  <CombinationInput
                    id={i}
                    name="quantity"
                    placeholder="Quantity"
                    variant={variant}
                    isBulkUpdate={isBulkUpdate}
                    handleQuantityPrice={handleQuantityPrice}
                    value={variant.quantity || 0}
                  />
                </TableCell>

                <TableCell>
                  <EditDeleteButtonTwo
                    attribute
                    variant={variant}
                    setTapValue={setTapValue}
                    deleteModalShow={deleteModalShow}
                    handleEditVariant={handleEditVariant}
                    handleRemoveVariant={handleRemoveVariant}
                  />
                </TableCell>
              </TableRow>

              {/* Expanded Designer Section */}
              {expandedVariant === i && (
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableCell colSpan={8}>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Designer Settings for {variant.combination}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveVariantDesignerChanges(i)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                          >
                            <FiCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEditingVariantDesigner}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Designer Images Upload */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Upload Designer Mockup Images
                        </h4>
                        <DesignerImageUploader
                          variantId={variant._id || `variant-${i}`}
                          designerImages={editedDesignerImages}
                          onImagesChange={setEditedDesignerImages}
                          designerPrices={editedDesignerPrices}
                          onPricesChange={setEditedDesignerPrices}
                          designerEnabledSides={editedDesignerEnabledSides}
                          onEnabledSidesChange={setEditedDesignerEnabledSides}
                        />
                        {/* Uploader modal for printing options */}
                        {showPrinterUploader && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                  Upload Image for{" "}
                                  {showPrinterUploader.toUpperCase()}
                                </h3>
                                <button
                                  onClick={() => setShowPrinterUploader(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                  type="button"
                                >
                                  Close
                                </button>
                              </div>

                              <Uploader
                                folder="printing-options"
                                imageUrl={
                                  editedPrintingOptions?.[showPrinterUploader]
                                    ?.image || ""
                                }
                                setImageUrl={(result) => {
                                  let url = "";
                                  if (!result) return;
                                  if (Array.isArray(result))
                                    url = result[0] || "";
                                  else if (typeof result === "string")
                                    url = result;
                                  if (url) {
                                    setEditedPrintingOptions((prev) => ({
                                      ...prev,
                                      [showPrinterUploader]: {
                                        ...(prev[showPrinterUploader] || {}),
                                        image: url,
                                      },
                                    }));
                                  }
                                  setShowPrinterUploader(null);
                                }}
                              />

                              <div className="mt-4 flex justify-end gap-2">
                                <button
                                  onClick={() => setShowPrinterUploader(null)}
                                  className="px-3 py-1 text-sm bg-gray-200 rounded"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Available Sizes */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Available Sizes — Stock Count &amp; Price per Size
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            placeholder="Add size (e.g. 3XL)"
                            className="text-xs border rounded px-2 py-1 w-32"
                          />
                          <button
                            onClick={addCustomSize}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                            type="button"
                          >
                            <FiPlus className="inline-block mr-1" /> Add Size
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {sizesToRender.map((size) => {
                            const detail = editedSizeDetails[size] || {
                              inStock: false,
                              stockCount: 0,
                              price: 0,
                            };
                            return (
                              <div
                                key={size}
                                className={`flex flex-col gap-2 p-3 border-2 rounded transition-all ${
                                  detail.inStock
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                                    : "border-gray-300 bg-white dark:bg-gray-800 opacity-70"
                                }`}
                              >
                                {/* Row 1: Checkbox + Size label + stock badge */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={detail.inStock}
                                    onChange={() => toggleSizeInStock(size)}
                                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                                  />
                                  <span
                                    className={`text-sm font-bold ${
                                      detail.inStock
                                        ? "text-green-700 dark:text-green-300"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  >
                                    {size}
                                  </span>
                                  <span
                                    className={`ml-auto text-xs px-1.5 py-0.5 rounded font-medium ${
                                      detail.inStock
                                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                                        : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                    }`}
                                  >
                                    {detail.inStock ? "In Stock" : "Out"}
                                  </span>
                                </label>

                                {/* Row 2: Stock Count */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500 w-14 shrink-0">
                                    Stock:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={detail.stockCount}
                                    onChange={(e) =>
                                      updateSizeStockCount(size, e.target.value)
                                    }
                                    disabled={!detail.inStock}
                                    className="w-full text-xs border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:opacity-50"
                                    placeholder="0"
                                  />
                                </div>

                                {/* Row 3: Specific Price */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500 w-14 shrink-0">
                                    Price:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={detail.price}
                                    onChange={(e) =>
                                      updateSizePrice(size, e.target.value)
                                    }
                                    disabled={!detail.inStock}
                                    className="w-full text-xs border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:opacity-50"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Printing Techniques */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Printing Techniques
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { key: "dtg", label: "DTG" },
                            { key: "dtf", label: "DTF" },
                          ].map((opt) => {
                            const data = editedPrintingOptions[opt.key] || {
                              enabled: false,
                              image: "",
                              description: "",
                            };
                            return (
                              <div
                                key={opt.key}
                                className={`p-3 border rounded ${data.enabled ? "bg-white" : "bg-gray-50 opacity-75"}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium text-sm">
                                    {opt.label}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditedPrintingOptions((prev) => ({
                                        ...prev,
                                        [opt.key]: {
                                          ...(prev[opt.key] || {}),
                                          enabled: !prev[opt.key]?.enabled,
                                        },
                                      }))
                                    }
                                    className={`inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                                      data.enabled
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    <span
                                      className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform ${data.enabled ? "translate-x-4" : "translate-x-1"}`}
                                    />
                                  </button>
                                </div>
                                {!data.enabled && (
                                  <div className="text-xs text-red-500 mb-2">
                                    Disabled
                                  </div>
                                )}

                                <div className="mb-2">
                                  <label className="text-xs text-gray-500 block mb-1">
                                    Image
                                  </label>
                                  {data.image ? (
                                    <div className="relative group">
                                      <div className="w-full h-24 bg-gray-100 rounded border overflow-hidden flex items-center justify-center">
                                        <img
                                          src={data.image}
                                          alt={opt.label}
                                          className="max-w-full max-h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setShowPrinterUploader(opt.key)
                                          }
                                          className="px-2 py-1 text-xs bg-gray-200 rounded"
                                        >
                                          Change
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditedPrintingOptions(
                                              (prev) => ({
                                                ...prev,
                                                [opt.key]: {
                                                  ...(prev[opt.key] || {}),
                                                  image: "",
                                                },
                                              }),
                                            )
                                          }
                                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowPrinterUploader(opt.key)
                                        }
                                        className="px-3 py-2 text-xs bg-gray-100 rounded"
                                      >
                                        Upload
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={data.description || ""}
                                    onChange={(e) =>
                                      setEditedPrintingOptions((prev) => ({
                                        ...prev,
                                        [opt.key]: {
                                          ...(prev[opt.key] || {}),
                                          description: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-full p-2 text-xs border rounded h-20"
                                    placeholder={`Describe ${opt.label} use-cases...`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </>
  );
};

export default AttributeListTable;
