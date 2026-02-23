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
  const [editedAvailableSizes, setEditedAvailableSizes] = useState([]);

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
    setEditedAvailableSizes(variant.availableSizes || []);
  };

  const cancelEditingVariantDesigner = () => {
    setExpandedVariant(null);
    setEditedDesignerImages({});
    setEditedDesignerPrices({});
    setEditedAvailableSizes([]);
  };

  const saveVariantDesignerChanges = (variantIndex) => {
    const variant = variants[variantIndex];
    const updatedVariant = {
      ...variant,
      designerImages: editedDesignerImages,
      designerPrices: editedDesignerPrices,
      availableSizes: editedAvailableSizes,
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

  const toggleSize = (size) => {
    setEditedAvailableSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  return (
    <>
      <TableBody>
        {variants?.map((variant, i) => {
          // Check if this is a size variant with pricing tiers
          const isSizeVariant =
            variant.variantType === "size" && variant.pricingTiers;

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
                        />
                      </div>

                      {/* Available Sizes */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Available Sizes (Check for In Stock, Uncheck for Out
                          of Stock)
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {AVAILABLE_SIZES.map((size) => {
                            const isChecked =
                              editedAvailableSizes.includes(size);
                            return (
                              <label
                                key={size}
                                className={`flex items-center gap-2 px-4 py-2 border-2 rounded cursor-pointer transition-all ${
                                  isChecked
                                    ? "border-green-500 bg-green-50 dark:bg-green-900"
                                    : "border-gray-300 bg-white dark:bg-gray-800"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSize(size)}
                                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    isChecked
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {size}
                                </span>
                                {isChecked && (
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    (In Stock)
                                  </span>
                                )}
                                {!isChecked && (
                                  <span className="text-xs text-red-600 dark:text-red-400">
                                    (Out of Stock)
                                  </span>
                                )}
                              </label>
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
