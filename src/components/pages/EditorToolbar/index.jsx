import React from "react";
import { Button } from "@windmill/react-ui";
import {
  FiSave,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

/**
 * Editor top toolbar: back link, autosave status indicator, Save Draft and Preview buttons.
 * Keyboard shortcuts are handled by PageEditor (Ctrl+S / Ctrl+P).
 */
const EditorToolbar = ({
  onSaveDraft,
  onPreview,
  isSaving,
  autosaveStatus, // "idle" | "saving" | "saved" | "error"
  isNew,
  onBack,
}) => (
  <div
    className="flex items-center justify-between flex-wrap gap-3 mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700"
    role="toolbar"
    aria-label="Page editor toolbar"
  >
    {/* Left: back + autosave status */}
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label="Back to pages list"
      >
        ← Back to Pages
      </button>

      {!isNew && (
        <span
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {autosaveStatus === "saving" && (
            <>
              <FiClock className="w-3 h-3 animate-spin" />
              <span>Saving…</span>
            </>
          )}
          {autosaveStatus === "saved" && (
            <>
              <FiCheckCircle className="w-3 h-3 text-green-400" />
              <span>Draft saved</span>
            </>
          )}
          {autosaveStatus === "error" && (
            <>
              <FiAlertCircle className="w-3 h-3 text-red-400" />
              <span>Save failed — retry with Ctrl+S</span>
            </>
          )}
        </span>
      )}
    </div>

    {/* Right: action buttons */}
    <div className="flex items-center gap-2">
      <Button
        onClick={onSaveDraft}
        disabled={isSaving}
        layout="outline"
        className="text-sm rounded-md h-9 px-4"
        aria-label="Save draft (Ctrl+S)"
        title="Save draft (Ctrl+S)"
      >
        <FiSave className="w-3.5 h-3.5 mr-1.5" />
        {isSaving ? "Saving…" : "Save Draft"}
      </Button>

      {!isNew && (
        <Button
          onClick={onPreview}
          layout="outline"
          className="text-sm rounded-md h-9 px-4"
          aria-label="Preview page in new tab (Ctrl+P)"
          title="Preview page (Ctrl+P)"
        >
          <FiEye className="w-3.5 h-3.5 mr-1.5" />
          Preview
        </Button>
      )}
    </div>
  </div>
);

export default EditorToolbar;
