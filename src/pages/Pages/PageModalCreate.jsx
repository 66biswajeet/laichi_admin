import React, { useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import { notifyError, notifySuccess } from "@/utils/toast";
import pagesApi from "@/services/pagesApi";

const TEMPLATES = [
  { value: "default", label: "Default" },
  { value: "full-width", label: "Full Width" },
  { value: "landing", label: "Landing Page" },
  { value: "blog", label: "Blog Post" },
  { value: "docs", label: "Documentation" },
];

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
 * Quick-create modal: captures title + slug + template, creates the page as a draft,
 * and optionally navigates straight to the full editor.
 */
const PageModalCreate = ({ isOpen, onClose }) => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("default");
  const [isCreating, setIsCreating] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  const derivedSlug = slugManual ? slug : slugify(title);

  const reset = () => {
    setTitle("");
    setSlug("");
    setTemplate("default");
    setIsCreating(false);
    setSlugManual(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (!slugManual) setSlug(slugify(e.target.value));
  };

  const handleSlugChange = (e) => {
    setSlugManual(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, ""),
    );
  };

  const doCreate = async (andContinue = false) => {
    if (!title.trim()) {
      notifyError("Title is required");
      return;
    }
    if (!derivedSlug) {
      notifyError("Unable to generate a valid slug");
      return;
    }
    try {
      setIsCreating(true);
      const res = await pagesApi.createPage({
        title: title.trim(),
        slug: derivedSlug,
        layoutTemplate: template,
        status: "draft",
      });
      notifySuccess("Page created as draft!");
      handleClose();
      if (andContinue && res?.page?._id) {
        history.push(`/pages/${res.page._id}/edit`);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to create page");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <span className="text-lg font-semibold">Create Custom Page</span>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="modal-page-title">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Title{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </span>
            </Label>
            <Input
              id="modal-page-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. About Us"
              className="mt-1"
              autoFocus
              aria-required="true"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="modal-page-slug">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </span>
            </Label>
            <Input
              id="modal-page-slug"
              type="text"
              value={derivedSlug}
              onChange={handleSlugChange}
              placeholder="about-us"
              className="mt-1"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              /pages/{derivedSlug || "…"}
            </p>
          </div>

          {/* Template */}
          <div>
            <Label htmlFor="modal-page-template">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Template
              </span>
            </Label>
            <select
              id="modal-page-template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="mt-1 w-full text-sm border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-400 italic">
            The page will be saved as a draft. Use "Continue to editor" to add
            content now.
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <Button layout="outline" onClick={handleClose} aria-label="Cancel">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => doCreate(false)}
              disabled={isCreating}
              layout="outline"
              className="text-sm"
            >
              {isCreating ? "Creating…" : "Create Draft"}
            </Button>
            <Button
              onClick={() => doCreate(true)}
              disabled={isCreating}
              className="text-sm bg-blue-600 hover:bg-blue-700"
              aria-label="Create page and open in full editor"
            >
              {isCreating ? "Opening…" : "Continue to editor →"}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PageModalCreate;
