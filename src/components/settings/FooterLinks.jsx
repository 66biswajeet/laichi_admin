import React, { useState } from "react";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";

import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";

const FooterLinks = ({
  errors,
  register,
  isSave,
  isSubmitting,
  footerLinks,
  setFooterLinks,
}) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddLink = () => {
    setFooterLinks([...footerLinks, { title: "", url: "" }]);
    setEditingIndex(footerLinks.length);
  };

  const handleRemoveLink = (index) => {
    const newLinks = footerLinks.filter((_, i) => i !== index);
    setFooterLinks(newLinks);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleEditLink = (index) => {
    setEditingIndex(index);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...footerLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooterLinks(newLinks);
  };

  return (
    <div className="grid grid-cols-12 font-sans">
      <div className="col-span-12 md:col-span-12 lg:col-span-12 mr-3">
        <div className="lg:px-6 pt-4 lg:pl-40 lg:pr-40 md:pl-5 md:pr-5 flex-grow scrollbar-hide w-full max-h-full pb-0">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Footer Page Links
              </h3>
              <Button
                type="button"
                onClick={handleAddLink}
                className="h-10 px-4"
              >
                <FiPlus className="mr-2" />
                Add Link
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add custom page links to appear in the footer. These can link to
              your custom pages or external URLs.
            </p>

            {footerLinks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No footer links added yet. Click "Add Link" to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {footerLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Link {index + 1}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditLink(index)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                          Link Title
                        </label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) =>
                            handleLinkChange(index, "title", e.target.value)
                          }
                          placeholder="e.g., About Us, Terms & Conditions"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            handleLinkChange(index, "url", e.target.value)
                          }
                          placeholder="e.g., /pages/about-us or https://example.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-gray-700 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-row-reverse pb-6">
            {isSubmitting ? (
              <Button disabled={true} type="button" className="h-12">
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={20}
                  height={10}
                />
                <span className="font-serif ml-2 font-light">Processing</span>
              </Button>
            ) : (
              <Button type="submit" className="h-12 px-8">
                {isSave ? "Save" : "Update"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterLinks;
