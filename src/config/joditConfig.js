import Cookies from "js-cookie";

const BASE_URL = `${import.meta.env.VITE_APP_API_BASE_URL}`;

/** Lazily read the auth token from the admin cookie for JoditEditor's uploader. */
const getToken = () => {
  try {
    const info = Cookies.get("adminInfo");
    return info ? JSON.parse(info).token : "";
  } catch {
    return "";
  }
};

/**
 * Central JoditEditor configuration.
 * Called as a function so the auth token is always fresh.
 */
export const getJoditConfig = () => ({
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  defaultActionOnPaste: "insert_clear_html",
  height: 600,
  minHeight: 400,

  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "video",
    "table",
    "link",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "symbol",
    "fullsize",
    "preview",
    "print",
  ],

  uploader: {
    url: `${BASE_URL}/pages/upload-image`,
    format: "json",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    prepareData(formData) {
      formData.append("source", "jodit-editor");
      return formData;
    },
    isSuccess: (resp) => resp.success,
    getMessage: (resp) => resp.message,
    process(resp) {
      return {
        files: resp.data ? [resp.data.url] : [],
        path: "",
        baseurl: "",
        error: resp.success ? 0 : 1,
        message: resp.message,
      };
    },
    error(e) {
      console.error("JoditEditor upload error:", e);
    },
  },

  // Allowed HTML tags — dangerous tags (script, iframe, object, embed) are NOT listed
  allowHTML: true,

  // JoditEditor built-in sanitization (server always re-sanitizes regardless)
  sanitizeHTML: true,

  events: {
    afterPaste() {
      // Hook for additional paste-time sanitization logic if needed
    },
  },
});
