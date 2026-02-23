/**
 * Utility functions for handling headings in HTML content
 * - Inject unique IDs into h1-h4 headings
 * - Generate Table of Contents from HTML
 */

/**
 * Slugify text for use as HTML id attribute
 * @param {string} text - The heading text to slugify
 * @returns {string} - Slugified text (lowercase, hyphens, no special chars)
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Inject unique IDs into all h1-h4 headings in HTML
 * Uses slugified heading text + counter for duplicates
 * @param {string} html - The HTML content to process
 * @returns {string} - HTML with injected heading IDs
 */
export const injectHeadingIds = (html) => {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = doc.querySelectorAll("h1, h2, h3, h4");

  // Track slugs to ensure uniqueness
  const slugCounts = {};

  headings.forEach((heading) => {
    const text = heading.textContent.trim();
    if (!text) return;

    let slug = slugify(text);

    // Handle duplicates by appending counter
    if (slugCounts[slug] !== undefined) {
      slugCounts[slug]++;
      slug = `${slug}-${slugCounts[slug]}`;
    } else {
      slugCounts[slug] = 0;
    }

    // Set the ID attribute
    heading.setAttribute("id", slug);
  });

  return doc.body.innerHTML;
};

/**
 * Generate Table of Contents from HTML content
 * Extracts h1-h4 headings with their IDs and text
 * @param {string} html - The HTML content to parse
 * @returns {Array<{id: string, text: string, level: number}>} - ToC entries
 */
export const generateToc = (html) => {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = doc.querySelectorAll("h1, h2, h3, h4");

  const toc = [];

  headings.forEach((heading) => {
    const text = heading.textContent.trim();
    if (!text) return;

    const id = heading.getAttribute("id");
    const level = parseInt(heading.tagName.substring(1)); // Extract number from h1, h2, etc.

    toc.push({
      id: id || slugify(text), // Fallback to slugified text if no ID
      text,
      level,
    });
  });

  return toc;
};

/**
 * Scroll to a heading by ID
 * @param {string} id - The heading ID to scroll to
 */
export const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
