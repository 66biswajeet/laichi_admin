import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import { FiDownload, FiImage } from "react-icons/fi";

const Invoice = ({ data, currency, getNumberTwo }) => {
  const handleDownloadImage = (imageUrl, productTitle) => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${productTitle.replace(/\s+/g, "_")}_custom_sticker.jpg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 text-serif text-sm ">
        {data?.cart?.map((item, i) => (
          <TableRow key={i} className="dark:border-gray-700 dark:text-gray-400">
            <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
              {i + 1}{" "}
            </TableCell>
            <TableCell className="px-6 py-1 font-normal text-gray-500">
              <div className="flex flex-col space-y-1">
                <span
                  className={`text-gray-700 font-semibold  dark:text-gray-300 text-xs ${
                    item.title.length > 15 ? "wrap-long-title" : ""
                  }`}
                >
                  {item.title}
                </span>
                {item.customData?.isCustomProduct &&
                  item.customData?.uploadedImage && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="relative w-12 h-12 border border-gray-200 rounded overflow-hidden">
                        <img
                          src={item.customData.uploadedImage}
                          alt="Custom Sticker"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleDownloadImage(
                            item.customData.uploadedImage,
                            item.title
                          )
                        }
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
                        title="Download custom image"
                      >
                        <FiDownload className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
              </div>
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {item.quantity}{" "}
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap text-center text-gray-600 dark:text-gray-400">
              {item.customData?.selectedSize || item.selectedSize || "-"}
            </TableCell>
            <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
              {currency} {getNumberTwo(item.price)}
            </TableCell>

            <TableCell className="px-6 py-1 whitespace-nowrap text-right font-bold text-red-500 dark:text-emerald-500">
              {currency} {getNumberTwo(item.itemTotal)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default Invoice;
