import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, CardBody, Button, Input, Label } from "@windmill/react-ui";
import { FiSave, FiEye, FiCode } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { notifySuccess, notifyError } from "@/utils/toast";
import PageTitle from "@/components/Typography/PageTitle";
import PageServices from "@/services/PageServices";
import { injectHeadingIds, generateToc, slugify } from "@/utils/headingUtils";

const CreatePage = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [htmlSourceValue, setHtmlSourceValue] = useState("");

  const handleToggleHtmlSource = () => {
    if (!showHtmlSource) {
      // Entering HTML source mode — populate textarea with current content
      setHtmlSourceValue(content);
    } else {
      // Leaving HTML source mode — sync textarea back to content
      setContent(htmlSourceValue);
    }
    setShowHtmlSource((prev) => !prev);
  };

  // Generate ToC whenever content changes
  const toc = useMemo(() => {
    return generateToc(content);
  }, [content]);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ script: "super" }, { script: "sub" }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["blockquote"],
      ["link", "image", "video"],
      ["clean"],
    ],
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "blockquote",
    "list",
    "bullet",
    "check",
    "indent",
    "align",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      notifyError("Please enter a page title");
      return;
    }

    if (!content.trim()) {
      notifyError("Please add some content to the page");
      return;
    }

    try {
      setIsSaving(true);

      // Inject heading IDs before saving
      const htmlWithIds = injectHeadingIds(content);

      // Build payload matching API model: title and description objects, plus slug
      const payload = {
        title: { en: title.trim() },
        description: { en: htmlWithIds },
        slug: slugify(title.trim()),
      };

      await PageServices.addPage(payload);
      notifySuccess("Page created successfully!");

      // Redirect to pages list
      setTimeout(() => {
        history.push("/pages");
      }, 1000);
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to create page");
      console.error("Error creating page:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const generatedSlug = useMemo(() => slugify(title || ""), [title]);

  const handleTocClick = (id) => {
    // Find the heading in the preview if shown
    if (showPreview) {
      const element = document.getElementById(`preview-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <PageTitle>Create New Page</PageTitle>

      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => setShowPreview(false)}
          className={!showPreview ? "bg-blue-600" : "bg-gray-300"}
        >
          <FiEye className="mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => setShowPreview(true)}
          className={showPreview ? "bg-blue-600" : "bg-gray-300"}
        >
          <FiEye className="mr-2" />
          Preview
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Editor Area */}
        <div className="lg:col-span-3">
          <Card className="shadow-xs bg-white dark:bg-gray-800">
            <CardBody>
              <div className="mb-4">
                <Label>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                    Page Title
                  </span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter page title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Slug: </span>
                  <span className="ml-1 truncate">{generatedSlug || "—"}</span>
                </div>
              </div>

              {!showPreview ? (
                <div className="editor-wrapper">
                  <div className="flex items-center justify-between mb-2">
                    <Label>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                        Page Content
                      </span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleToggleHtmlSource}
                      title={showHtmlSource ? "Switch to Visual Editor" : "View/Edit HTML Source"}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                        showHtmlSource
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <FiCode className="w-3.5 h-3.5" />
                      {showHtmlSource ? "Visual Editor" : "HTML Source"}
                    </button>
                  </div>

                  {showHtmlSource ? (
                    <textarea
                      value={htmlSourceValue}
                      onChange={(e) => setHtmlSourceValue(e.target.value)}
                      className="w-full font-mono text-sm bg-gray-900 text-green-400 border border-gray-600 rounded p-4 min-h-[500px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                      spellCheck={false}
                      placeholder="<p>Your HTML content here...</p>"
                    />
                  ) : (
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      className="bg-white dark:bg-gray-900 min-h-[500px]"
                      placeholder="Start writing your page content..."
                    />
                  )}
                </div>
              ) : (
                <div className="preview-wrapper">
                  <Label>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2 block">
                      Preview
                    </span>
                  </Label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded p-4 min-h-[500px] bg-white dark:bg-gray-900">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                      {title || "Untitled Page"}
                    </h1>
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: content.replace(
                          /<(h[1-4])[^>]*id="([^"]*)"[^>]*>/g,
                          '<$1 id="preview-$2">',
                        ),
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FiSave className="mr-2" />
                  {isSaving ? "Saving..." : "Save Page"}
                </Button>
                <Button onClick={() => history.push("/pages")} layout="outline">
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Table of Contents Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-xs bg-white dark:bg-gray-800 sticky top-4">
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Table of Contents
              </h3>

              {toc.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No headings yet. Add headings (H1-H4) to your content to see
                  them here.
                </p>
              ) : (
                <nav className="space-y-1">
                  {toc.map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      onClick={() => handleTocClick(item.id)}
                      className={`
                        block w-full text-left py-2 px-3 rounded
                        text-sm text-gray-700 dark:text-gray-300
                        hover:bg-blue-50 dark:hover:bg-gray-700
                        transition-colors
                        ${item.level === 1 ? "font-semibold" : ""}
                        ${item.level === 2 ? "pl-5" : ""}
                        ${item.level === 3 ? "pl-7" : ""}
                        ${item.level === 4 ? "pl-9 text-xs" : ""}
                      `}
                      title={item.text}
                    >
                      <span className="truncate block">{item.text}</span>
                    </button>
                  ))}
                </nav>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .ql-editor {
          min-height: 400px;
          font-size: 16px;
        }

        .ql-container {
          font-family: inherit;
        }

        .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }

        .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }

        .dark .ql-toolbar {
          background: #374151;
          border-color: #4b5563;
        }

        .dark .ql-container {
          border-color: #4b5563;
        }

        .dark .ql-editor {
          color: #e5e7eb;
        }

        .dark .ql-stroke {
          stroke: #e5e7eb;
        }

        .dark .ql-fill {
          fill: #e5e7eb;
        }

        .dark .ql-picker-label {
          color: #e5e7eb;
        }
      `}</style>
    </>
  );
};

export default CreatePage;
