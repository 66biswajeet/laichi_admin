import React from "react";
import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import {
  FiPackage,
  FiTag,
  FiDollarSign,
  FiTrendingDown,
  FiShoppingCart,
} from "react-icons/fi";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const AttributeList = ({ variants, variantTitle }) => {
  const { showingTranslateValue, currency, getNumberTwo } = useUtilsFunction();

  return (
    <>
      <TableBody>
        {variants?.map((variant, i) => {
          // Check if this is a size variant with pricing tiers
          const isSizeVariant =
            variant.variantType === "size" && variant.pricingTiers;

          if (isSizeVariant) {
            // Render size variant with beautiful card-style layout
            return (
              <React.Fragment key={i + 1}>
                <TableRow className="bg-gradient-to-r from-blue-50 to-gray-50 dark:from-blue-900 dark:to-gray-900 border-l-4 border-blue-500">
                  <TableCell
                    className="font-bold text-blue-700 dark:text-blue-300"
                    rowSpan={variant.pricingTiers.length + 1}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                      {i + 1}
                    </div>
                  </TableCell>
                  <TableCell rowSpan={variant.pricingTiers.length + 1}>
                    <div className="flex items-center">
                      {variant.image ? (
                        <Avatar
                          className="hidden md:block bg-white shadow-md ring-2 ring-blue-200 dark:ring-blue-700"
                          src={variant.image}
                          alt="product"
                        />
                      ) : (
                        <Avatar
                          src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                          alt="product"
                          className="hidden md:block bg-white shadow-md ring-2 ring-blue-200 dark:ring-blue-700"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell rowSpan={variant.pricingTiers.length + 1}>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <FiPackage className="text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-base text-blue-800 dark:text-blue-300">
                          {variant.combination}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                        Size Variant
                      </span>
                    </div>
                  </TableCell>
                  <TableCell rowSpan={variant.pricingTiers.length + 1}>
                    <div className="flex items-center gap-1.5">
                      <FiTag className="text-gray-500 text-sm" />
                      <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                        {variant.sku || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell rowSpan={variant.pricingTiers.length + 1}>
                    <div className="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {variant.barcode || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <div className="bg-gradient-to-r from-blue-100 to-gray-100 dark:from-blue-800 dark:to-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                          Pricing Tiers ({variant.pricingTiers.length})
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell rowSpan={variant.pricingTiers.length + 1}>
                    <div className="flex flex-col items-center">
                      <FiShoppingCart className="text-blue-600 dark:text-blue-400 mb-1" />
                      <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                        {variant.quantity}
                      </span>
                      <span className="text-xs text-gray-500">in stock</span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Pricing Tier Rows with Beautiful Design */}
                {variant.pricingTiers.map((tier, tIndex) => (
                  <TableRow
                    key={`${i}-tier-${tIndex}`}
                    className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors border-l-4 border-blue-300 dark:border-blue-600"
                  >
                    <TableCell colSpan={2}>
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
                          <FiPackage className="text-lg" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-base text-blue-700 dark:text-blue-300">
                            {tier.quantity} pieces
                          </span>
                          <span className="text-xs text-gray-500">
                            Quantity tier
                          </span>
                        </div>
                        {tier.discount > 0 && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full shadow-md">
                            <FiTrendingDown className="text-sm" />
                            <span className="font-bold text-sm">
                              {tier.discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1">
                          Base Price
                        </span>
                        <span className="font-bold text-base text-gray-700 dark:text-gray-300">
                          {currency} {tier.basePrice.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-900 dark:to-gray-900 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                        <span className="text-xs text-gray-500 mb-1">
                          Final Price (per piece)
                        </span>
                        <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                          {currency} {tier.finalPrice.toFixed(2)}
                        </span>
                        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Total Value:
                          </span>
                          <span className="font-bold text-base text-blue-600 dark:text-blue-400 ml-2">
                            {currency}{" "}
                            {(tier.finalPrice * tier.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            );
          }

          // Traditional variant rendering with improved styling
          return (
            <TableRow
              key={i + 1}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableCell>
                <div className="flex items-center justify-center w-8 h-8 bg-gray-600 text-white rounded-full text-sm font-bold">
                  {i + 1}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {variant.image ? (
                    <Avatar
                      className="hidden md:block bg-white shadow-md ring-2 ring-gray-200 dark:ring-gray-700"
                      src={variant.image}
                      alt="product"
                    />
                  ) : (
                    <Avatar
                      src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                      alt="product"
                      className="hidden md:block bg-white shadow-md ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
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
                  {variant.productId && (
                    <span className="text-xs text-gray-500 mt-1">
                      ({variant.productId})
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <FiTag className="text-gray-500 text-sm" />
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {variant.sku || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {variant.barcode || "N/A"}
                </div>
              </TableCell>

              <TableCell>
                <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                  {currency} {getNumberTwo(variant.originalPrice)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-base text-blue-600 dark:text-blue-400">
                  {currency} {getNumberTwo(variant.price)}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-base text-gray-700 dark:text-gray-300">
                    {variant.quantity}
                  </span>
                  <span className="text-xs text-gray-500">in stock</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default AttributeList;
