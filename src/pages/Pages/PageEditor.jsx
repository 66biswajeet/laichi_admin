import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardBody } from "@windmill/react-ui";
import { notifySuccess, notifyError } from "@/utils/toast";
import PageTitle from "@/components/Typography/PageTitle";
import JoditEditorWrapper from "@/components/pages/JoditEditorWrapper";
import PageSettings from "@/components/pages/PageSettings";
import EditorToolbar from "@/components/pages/EditorToolbar";
import VersionHistory from "@/components/pages/VersionHistory";
import useAutosave from "@/hooks/useAutosave";
import pagesApi from "@/services/pagesApi";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

/**
 * Full-page editor for creating and editing custom pages.
 * Route: /pages/new  (create)  and  /pages/:id/edit  (edit)
 *
 * Two-column layout:
 *   Left  — JoditEditor WYSIWYG canvas with title input
 *   Right — sticky PageSettings sidebar
 *
 * Features: autosave every 10 s on change, Ctrl+S save, Ctrl+P preview,
 * version history, publish / unpublish / delete with confirmation modals.
 */
const PageEditor = () => {
  const history = useHistory();
  const { id } = useParams(); // undefined for /pages/new
  const isNew = !id || id === "new";

  // ── Core content ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [contentHTML, setContentHTML] = useState("");
  const [pageId, setPageId] = useState(!isNew ? id : null);

  // ── Settings sidebar state ────────────────────────────────────────────────
  const [slug, setSlugRaw] = useState("");
  const [slugError, setSlugError] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [status, setStatus] = useState("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [layoutTemplate, setLayoutTemplate] = useState("default");

  const setSlug = (val) => {
    setSlugManual(true);
    setSlugRaw(val);
    setSlugError("");
  };

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(!isNew);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Load existing page ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isNew && pageId) {
      setIsLoading(true);
      pagesApi
        .getPageById(pageId)
        .then((page) => {
          setTitle(page.title || "");
          setContentHTML(page.contentHTML || "");
          setSlugRaw(page.slug || "");
          setStatus(page.status || "draft");
          setMetaTitle(page.metaTitle || "");
          setMetaDescription(page.metaDescription || "");
          setCanonicalUrl(page.canonicalUrl || "");
          setPublishedAt(page.publishedAt || "");
          setTags(page.tags || []);
          setLayoutTemplate(page.layoutTemplate || "default");
        })
        .catch(() => {
          notifyError("Failed to load page");
          history.push("/pages");
        })
        .finally(() => setIsLoading(false));
    }
  }, [pageId, isNew]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-derive slug from title for new pages before user touches it manually
  useEffect(() => {
    if (isNew && !slugManual && title) setSlugRaw(slugify(title));
  }, [title, isNew, slugManual]);

  // ── Build save payload ────────────────────────────────────────────────────
  const buildPayload = useCallback(
    () => ({
      title,
      slug,
      contentHTML,
      metaTitle,
      metaDescription,
      canonicalUrl,
      tags,
      layoutTemplate,
      ...(publishedAt ? { publishedAt } : {}),
    }),
    [
      title,
      slug,
      contentHTML,
      metaTitle,
      metaDescription,
      canonicalUrl,
      tags,
      layoutTemplate,
      publishedAt,
    ],
  );

  // ── Save draft ────────────────────────────────────────────────────────────
  const handleSaveDraft = useCallback(
    async (showToast = true) => {
      if (!title.trim()) {
        notifyError("Title is required");
        return false;
      }
      if (!slug.trim()) {
        notifyError("Slug is required");
        return false;
      }
      try {
        setIsSaving(true);
        const payload = buildPayload();
        if (isNew && !pageId) {
          const res = await pagesApi.createPage({
            ...payload,
            status: "draft",
          });
          setPageId(res.page._id);
          setSlugRaw(res.page.slug);
          history.replace(`/pages/${res.page._id}/edit`);
          if (showToast) notifySuccess("Page created as draft!");
        } else {
          await pagesApi.updatePage(pageId, payload);
          if (showToast) notifySuccess("Draft saved!");
        }
        setStatus("draft");
        return true;
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to save";
        if (msg.toLowerCase().includes("slug")) setSlugError(msg);
        notifyError(msg);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [title, slug, buildPayload, isNew, pageId, history],
  );

  // ── Autosave (on change, debounced 10 s) ─────────────────────────────────
  const autosaveFn = useCallback(async () => {
    if (isNew || !pageId || !title.trim()) return;
    setAutosaveStatus("saving");
    try {
      await pagesApi.updatePage(pageId, buildPayload());
      setAutosaveStatus("saved");
    } catch {
      setAutosaveStatus("error");
    }
    setTimeout(() => setAutosaveStatus("idle"), 3000);
  }, [isNew, pageId, title, buildPayload]);

  useAutosave(autosaveFn, contentHTML, 10000, !isNew && !!pageId);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePreview();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleSaveDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Preview ───────────────────────────────────────────────────────────────
  const handlePreview = async () => {
    if (!pageId) {
      notifyError("Save the page first before previewing");
      return;
    }
    try {
      const { previewToken } = await pagesApi.createPreviewToken(pageId);
      const clientUrl =
        import.meta.env.VITE_APP_CLIENT_URL || "http://localhost:3000";
      window.open(
        `${clientUrl}/pages/${slug}?preview_token=${previewToken}`,
        "_blank",
        "noopener,noreferrer",
      );
    } catch {
      notifyError("Failed to generate preview link");
    }
  };

  // ── Publish ───────────────────────────────────────────────────────────────
  const handlePublishConfirm = async () => {
    setShowPublishModal(false);
    const saved = await handleSaveDraft(false);
    if (!saved) return;
    try {
      setIsPublishing(true);
      await pagesApi.publishPage(pageId);
      setStatus("published");
      notifySuccess("Page published successfully!");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsPublishing(true);
      await pagesApi.unpublishPage(pageId);
      setStatus("draft");
      notifySuccess("Page unpublished");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to unpublish");
    } finally {
      setIsPublishing(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    if (!pageId) {
      history.push("/pages");
      return;
    }
    try {
      await pagesApi.deletePage(pageId);
      notifySuccess("Page deleted");
      history.push("/pages");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to delete");
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-64"
        role="status"
        aria-label="Loading page"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <PageTitle>{isNew ? "Create Custom Page" : "Edit Page"}</PageTitle>

      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        isSaving={isSaving}
        autosaveStatus={autosaveStatus}
        isNew={isNew && !pageId}
        onBack={() => history.push("/pages")}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Editor column ─────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="shadow-xs bg-white dark:bg-gray-800">
            <CardBody>
              {/* Title */}
              <div className="mb-5">
                <label
                  htmlFor="page-title-input"
                  className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1"
                >
                  Page Title{" "}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="page-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title…"
                  className="w-full text-xl font-semibold border-0 border-b border-gray-200 dark:border-gray-600 pb-2 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
                  aria-required="true"
                />
              </div>

              {/* Version history toggle */}
              {!isNew && pageId && (
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setShowVersionHistory((v) => !v)}
                    className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                    aria-expanded={showVersionHistory}
                  >
                    {showVersionHistory ? "Hide" : "View"} Version History
                  </button>
                </div>
              )}

              {/* WYSIWYG editor */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Content
                </label>
                <div className="rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <JoditEditorWrapper
                    value={contentHTML}
                    onChange={setContentHTML}
                    onBlur={autosaveFn}
                    height={600}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  ⚠ Raw HTML content is sanitized on the server before saving —
                  inline scripts are always stripped.
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Version history panel */}
          {showVersionHistory && !isNew && pageId && (
            <VersionHistory
              pageId={pageId}
              onRestore={() => {
                pagesApi.getPageById(pageId).then((page) => {
                  setContentHTML(page.contentHTML || "");
                  setTitle(page.title || "");
                  setShowVersionHistory(false);
                  notifySuccess("Version restored successfully!");
                });
              }}
            />
          )}
        </div>

        {/* ── Settings sidebar ──────────────────────────────────────────── */}
        <div className="xl:col-span-1">
          <PageSettings
            slug={slug}
            setSlug={setSlug}
            slugError={slugError}
            status={status}
            setStatus={setStatus}
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            canonicalUrl={canonicalUrl}
            setCanonicalUrl={setCanonicalUrl}
            publishedAt={publishedAt}
            setPublishedAt={setPublishedAt}
            tags={tags}
            setTags={setTags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            layoutTemplate={layoutTemplate}
            setLayoutTemplate={setLayoutTemplate}
            onPublish={() => setShowPublishModal(true)}
            onUnpublish={handleUnpublish}
            onDelete={() => setShowDeleteModal(true)}
            isSaving={isSaving}
            isPublishing={isPublishing}
            isNew={isNew && !pageId}
          />
        </div>
      </div>

      {/* ── Publish confirmation modal ─────────────────────────────────── */}
      {showPublishModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2
              id="publish-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              Publish Page
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Publishing will make this page publicly visible. Please review
              before continuing.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc ml-5 mb-5 space-y-1">
              <li>
                Accessible at{" "}
                <code className="text-blue-500 text-xs">/pages/{slug}</code>
              </li>
              <li>Search engines may index this page</li>
              <li>Unsaved changes will be saved automatically</li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishConfirm}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ──────────────────────────────────── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2
              id="delete-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              Delete Page
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800 dark:text-gray-200">
                "{title}"
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageEditor;
