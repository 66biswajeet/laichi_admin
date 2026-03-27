import React from "react";
import { Button, Input, Label } from "@windmill/react-ui";
import { FiGlobe, FiTag, FiLayout, FiCalendar } from "react-icons/fi";

const TEMPLATE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "full-width", label: "Full Width" },
  { value: "landing", label: "Landing Page" },
  { value: "blog", label: "Blog Post" },
  { value: "docs", label: "Documentation" },
];

/**
 * Right-hand sticky settings panel for the page editor.
 * Contains: status/publish controls, slug, SEO meta, publish date, tags, layout template.
 */
const PageSettings = ({
  slug,
  setSlug,
  slugError,
  status,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  canonicalUrl,
  setCanonicalUrl,
  publishedAt,
  setPublishedAt,
  tags,
  setTags,
  tagInput,
  setTagInput,
  layoutTemplate,
  setLayoutTemplate,
  onPublish,
  onUnpublish,
  onDelete,
  isSaving,
  isPublishing,
  isNew,
}) => {
  const isDraft = !status || status === "draft";

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  return (
    <aside className="sticky top-4 space-y-4" aria-label="Page settings">
      {/* ── Status card ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <FiGlobe className="w-3.5 h-3.5" />
          Publish
        </h2>
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              isDraft
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>
        <div className="space-y-2">
          {isDraft ? (
            <Button
              onClick={onPublish}
              disabled={isPublishing || isNew}
              title={
                isNew
                  ? "Save the page first before publishing"
                  : "Publish this page"
              }
              className="w-full rounded-md text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50"
              aria-label="Publish page"
            >
              {isPublishing ? "Publishing…" : "Publish"}
            </Button>
          ) : (
            <Button
              onClick={onUnpublish}
              disabled={isPublishing}
              layout="outline"
              className="w-full rounded-md text-sm"
              aria-label="Unpublish page"
            >
              {isPublishing ? "Saving…" : "Unpublish"}
            </Button>
          )}
          {!isNew && (
            <Button
              onClick={onDelete}
              className="w-full rounded-md text-sm bg-red-500 hover:bg-red-600 text-white"
              aria-label="Delete page"
            >
              Delete Page
            </Button>
          )}
        </div>
      </section>

      {/* ── Slug ────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          URL Slug
        </h2>
        <Input
          type="text"
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
          }
          placeholder="page-url-slug"
          className={slugError ? "border-red-500" : ""}
          aria-label="Page URL slug"
          aria-describedby={slugError ? "slug-error" : undefined}
          aria-invalid={!!slugError}
        />
        {slugError && (
          <p id="slug-error" className="mt-1 text-xs text-red-500" role="alert">
            {slugError}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">
          /pages/{slug || "…"}
        </p>
      </section>

      {/* ── SEO ─────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          SEO
        </h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="seo-meta-title">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Meta Title
              </span>
            </Label>
            <Input
              id="seo-meta-title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta title (50–60 chars)"
              className="mt-1"
            />
            <p
              className={`text-xs mt-0.5 ${metaTitle.length > 60 ? "text-red-400" : "text-gray-400"}`}
            >
              {metaTitle.length}/60
            </p>
          </div>
          <div>
            <Label htmlFor="seo-meta-description">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Meta Description
              </span>
            </Label>
            <textarea
              id="seo-meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta description (150–160 chars)"
              rows={3}
              className="mt-1 w-full text-sm border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
            <p
              className={`text-xs mt-0.5 ${metaDescription.length > 160 ? "text-red-400" : "text-gray-400"}`}
            >
              {metaDescription.length}/160
            </p>
          </div>
          <div>
            <Label htmlFor="seo-canonical">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Canonical URL
              </span>
            </Label>
            <Input
              id="seo-canonical"
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1"
            />
          </div>
        </div>
      </section>

      {/* ── Publish date ────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
          <FiCalendar className="w-3.5 h-3.5" />
          Publish Date
        </h2>
        <Input
          type="datetime-local"
          value={publishedAt ? publishedAt.slice(0, 16) : ""}
          onChange={(e) =>
            setPublishedAt(
              e.target.value ? new Date(e.target.value).toISOString() : "",
            )
          }
          className="text-sm"
          aria-label="Scheduled publish date and time"
        />
      </section>

      {/* ── Tags ────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
          <FiTag className="w-3.5 h-3.5" />
          Tags
        </h2>
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type and press Enter"
          aria-label="Add tag"
        />
        {tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1 mt-2"
            role="list"
            aria-label="Tags"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                role="listitem"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-400 hover:text-blue-700 dark:hover:text-blue-100 ml-0.5 leading-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Layout template ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
          <FiLayout className="w-3.5 h-3.5" />
          Layout Template
        </h2>
        <select
          value={layoutTemplate}
          onChange={(e) => setLayoutTemplate(e.target.value)}
          className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Layout template"
        >
          {TEMPLATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>
    </aside>
  );
};

export default PageSettings;
