import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Collapsible = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 focus:outline-none bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          {title}
        </span>
        {isOpen ? (
          <FiChevronUp className="text-gray-500 w-5 h-5" />
        ) : (
          <FiChevronDown className="text-gray-500 w-5 h-5" />
        )}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-100 dark:border-gray-600">{children}</div>}
    </div>
  );
};

export default Collapsible;
