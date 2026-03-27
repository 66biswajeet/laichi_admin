import React, { useState, useEffect } from "react";
import { Button } from "@windmill/react-ui";
import { FiRotateCcw } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { notifyError, notifySuccess } from "@/utils/toast";
import pagesApi from "@/services/pagesApi";

dayjs.extend(relativeTime);

/**
 * Version history panel — shows saved snapshots with preview and restore controls.
 */
const VersionHistory = ({ pageId, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    pagesApi
      .getVersionHistory(pageId)
      .then((res) => setVersions(res.versions || []))
      .catch(() => notifyError("Failed to load version history"))
      .finally(() => setLoading(false));
  }, [pageId]);

  const handleRestore = async (versionNumber) => {
    setRestoring(versionNumber);
    try {
      await pagesApi.restoreVersion(pageId, versionNumber);
      notifySuccess("Version restored!");
      if (onRestore) onRestore();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to restore version");
    } finally {
      setRestoring(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm text-gray-400 animate-pulse">
          Loading version history…
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <FiRotateCcw className="w-4 h-4" />
        Version History ({versions.length})
      </h3>

      {versions.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No versions saved yet. Edit and save to create snapshots.
        </p>
      ) : (
        <ol
          className="space-y-2 max-h-72 overflow-y-auto"
          aria-label="Version history list"
        >
          {versions.map((v) => (
            <li
              key={v.versionNumber}
              className="flex items-start justify-between p-2 rounded border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-sm"
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    v{v.versionNumber}
                  </span>
                  {v.savedBy && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      by {v.savedBy}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {v.savedAt ? dayjs(v.savedAt).fromNow() : "Unknown time"}
                </div>
                {expanded === v.versionNumber && (
                  <div className="mt-1 text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-1 font-mono max-h-20 overflow-y-auto">
                    {v.contentHTML
                      ? v.contentHTML.substring(0, 300) + "…"
                      : "(empty)"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(
                      expanded === v.versionNumber ? null : v.versionNumber,
                    )
                  }
                  className="text-xs text-blue-400 hover:text-blue-600 mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                  aria-label={`${expanded === v.versionNumber ? "Hide" : "Preview"} version ${v.versionNumber}`}
                >
                  {expanded === v.versionNumber ? "Hide preview" : "Preview"}
                </button>
              </div>
              <Button
                size="small"
                layout="outline"
                onClick={() => handleRestore(v.versionNumber)}
                disabled={restoring === v.versionNumber}
                className="text-xs shrink-0"
                aria-label={`Restore version ${v.versionNumber}`}
              >
                {restoring === v.versionNumber ? "Restoring…" : "Restore"}
              </Button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default VersionHistory;
