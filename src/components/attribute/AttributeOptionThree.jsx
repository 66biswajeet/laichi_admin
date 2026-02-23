import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { FiPlus } from "react-icons/fi";
import { notifySuccess, notifyError } from "@/utils/toast";

// This component handles Color attribute selection (unchanged from original)
const AttributeOptionThree = ({
  attributes,
  values,
  setValues,
  selectedValueClear,
}) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");

  const { showingTranslateValue } = useUtilsFunction();

  // Color mapping for common colors
  const colorMap = {
    red: "#EF4444",
    green: "#10B981",
    blue: "#3B82F6",
    yellow: "#F59E0B",
    purple: "#8B5CF6",
    pink: "#EC4899",
    orange: "#F97316",
    cyan: "#06B6D4",
    black: "#000000",
    white: "#FFFFFF",
    gray: "#6B7280",
    grey: "#6B7280",
    brown: "#92400E",
    lime: "#84CC16",
    indigo: "#6366F1",
    teal: "#14B8A6",
    amber: "#F59E0B",
    emerald: "#10B981",
    sky: "#0EA5E9",
    violet: "#7C3AED",
    fuchsia: "#D946EF",
    rose: "#F43F5E",
  };

  const getColorForOption = (optionName) => {
    if (!optionName || typeof optionName !== "string") return null;
    const lowerName = optionName.toLowerCase();
    for (const [colorName, colorValue] of Object.entries(colorMap)) {
      if (lowerName.includes(colorName)) {
        return colorValue;
      }
    }
    return null;
  };

  const handleSelectValue = (items) => {
    setSelected(items);
    setValues({
      ...values,
      [attributes._id]: items?.map((el) => el._id),
    });
  };

  const handleAddNewOption = () => {
    if (!newOptionName.trim()) {
      notifyError("Please enter a valid option name");
      return;
    }

    const newOption = {
      _id: `temp_${Date.now()}`,
      name: { en: newOptionName.trim() },
      label: newOptionName.trim(),
      value: `temp_${Date.now()}`,
    };

    setAttributeOptions([...attributeOptions, newOption]);
    setSelected([...selected, newOption]);
    setValues({
      ...values,
      [attributes._id]: [...(values[attributes._id] || []), newOption._id],
    });

    notifySuccess(`Added "${newOptionName}" successfully`);
    setNewOptionName("");
    setShowAddNew(false);
  };

  const ItemRenderer = ({ checked, option, onClick, disabled }) => {
    const color = getColorForOption(showingTranslateValue(option?.name));

    return (
      <div
        className={`item-renderer ${disabled ? "disabled" : ""}`}
        onClick={onClick}
      >
        <input
          type="checkbox"
          onChange={onClick}
          checked={checked}
          tabIndex={-1}
          disabled={disabled}
        />
        <div className="flex items-center ml-2">
          {color && (
            <span
              className="inline-block w-4 h-4 rounded-full mr-2 border border-gray-300"
              style={{ backgroundColor: color }}
            ></span>
          )}
          <span>{showingTranslateValue(option?.name)}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const options = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: showingTranslateValue(val?.name),
        value: val?._id,
      };
    });
    setAttributeOptions(options || []);
  }, [attributes?.variants]);

  useEffect(() => {
    if (selectedValueClear) {
      setSelected([]);
    }
  }, [selectedValueClear]);

  // Check if this is a color-related attribute
  const isColorAttribute =
    (typeof attributes?.title?.en === "string" &&
      attributes?.title?.en?.toLowerCase().includes("color")) ||
    (typeof attributes?.title === "string" &&
      attributes?.title?.toLowerCase()?.includes("color"));

  return (
    <div>
      <MultiSelect
        options={attributeOptions}
        value={selected}
        onChange={(v) => handleSelectValue(v)}
        labelledBy="Select"
        ItemRenderer={isColorAttribute ? ItemRenderer : undefined}
      />

      {/* Add New Option Button */}
      <div className="mt-2">
        {!showAddNew ? (
          <button
            type="button"
            onClick={() => setShowAddNew(true)}
            className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <FiPlus className="mr-1" /> Add New Option
          </button>
        ) : (
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mt-2 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-2">
              <input
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="Enter option name (e.g., Red, Blue)"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewOption();
                  }
                }}
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleAddNewOption}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewOptionName("");
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeOptionThree;
