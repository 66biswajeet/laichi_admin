import React from "react";

const ActiveButton = ({ tapValue, activeValue, handleProductTap }) => {
  return (
    <button
      className={`inline-block px-4 py-2 text-base ${
        tapValue === activeValue &&
        "text-blue-700 border-blue-700 dark:text-blue-500 dark:border-blue-500 rounded-t-lg border-b-2 font-semibold"
      } focus:outline-none transition-all duration-200`}
      aria-current="page"
      onClick={() => handleProductTap(activeValue, false, tapValue)}
    >
      {activeValue}
    </button>
  );
};

export default ActiveButton;
