# WYSIWYG Page Editor - Implementation Guide

## Overview

This document describes the implementation of a WYSIWYG (What You See Is What You Get) page editor for the Laichi Admin Panel. The editor allows administrators to create rich content pages with automatic Table of Contents generation and heading anchor links.

## Features

- ✅ **Rich Text Editing**: Full-featured WYSIWYG editor powered by React Quill
- ✅ **Live Table of Contents**: Automatically generated ToC sidebar that updates as you type
- ✅ **Heading Anchors**: Automatic ID injection for h1-h4 headings with deterministic slugification
- ✅ **Preview Mode**: Toggle between edit and preview modes
- ✅ **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- ✅ **Dark Mode Support**: Fully compatible with light/dark theme switching

## Installation

### 1. Install Dependencies

```bash
cd laichi_admin
npm install react-quill quill
```

### 2. Files Created/Modified

#### New Files:

- `src/pages/CreatePage.jsx` - Main editor component
- `src/utils/headingUtils.js` - Utility functions for heading processing
- `WYSIWYG_EDITOR_README.md` - This documentation

#### Modified Files:

- `src/routes/index.js` - Added route for `/pages/create`
- `src/pages/Pages.jsx` - Modified "Add Page" button to navigate to CreatePage

## Architecture

### Component Structure

```
CreatePage.jsx
├── Title Input
├── Mode Toggle (Edit/Preview)
├── Main Editor Area (75% width)
│   ├── ReactQuill Editor (Edit mode)
│   └── HTML Preview (Preview mode)
└── Table of Contents Sidebar (25% width)
    └── Dynamic ToC List
```

### Utility Functions

#### `headingUtils.js`

**1. `slugify(text, counter = null)`**

- Converts heading text to URL-friendly slug
- Parameters:
  - `text` (string): The heading text
  - `counter` (number|null): Optional counter for uniqueness
- Returns: kebab-case slug (e.g., "My Heading" → "my-heading")

**2. `injectHeadingIds(html)`**

- Parses HTML and injects unique IDs into h1-h4 headings
- Handles duplicate heading texts by adding counters
- Parameters:
  - `html` (string): HTML content from the editor
- Returns: HTML with IDs injected (e.g., `<h2 id="features">Features</h2>`)

**3. `generateToc(html)`**

- Extracts all headings and generates ToC data structure
- Parameters:
  - `html` (string): HTML content
- Returns: Array of objects `[{ id, text, level }]`

**4. `scrollToHeading(headingId)`**

- Smoothly scrolls to a heading by ID
- Parameters:
  - `headingId` (string): The heading's ID attribute
- Uses browser's native smooth scrolling

## Usage

### Creating a New Page

1. Navigate to **Pages** in the admin panel
2. Click the **"Add Page"** button
3. Enter a page title
4. Write content using the WYSIWYG editor
5. Use the heading buttons (H1-H4) to add structured headings
6. Preview your content by clicking the **"Preview"** button
7. Click **"Save Page"** to publish

### Editor Toolbar Features

- **Headings**: H1, H2, H3, H4 for hierarchical structure
- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Lists**: Ordered and unordered lists
- **Colors**: Text color and background color pickers
- **Alignment**: Left, center, right, justify
- **Media**: Link and image insertion
- **Clean**: Remove all formatting

### Table of Contents

The ToC sidebar automatically:

- Updates in real-time as you add/edit headings
- Indents based on heading level (H1-H4)
- Provides clickable links to jump to sections (in preview mode)
- Shows "No headings yet" when content has no headings

## API Integration

### Endpoint: `POST /pages/add`

**Request Body:**

```json
{
  "title": "My Page Title",
  "html": "<h1 id=\"introduction\">Introduction</h1><p>Content here...</p>"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "_id": "...",
    "title": "My Page Title",
    "slug": "my-page-title",
    ...
  }
}
```

## Testing Guide

### Manual Testing Checklist

#### Basic Functionality

- [ ] Can navigate to `/pages/create`
- [ ] Can enter a page title
- [ ] Editor loads without errors
- [ ] Can type and format text
- [ ] Save button is clickable

#### Heading ID Injection

- [ ] Add heading "Features" → verify ID is `features`
- [ ] Add duplicate heading "Features" → verify ID is `features-1`
- [ ] Add heading with special chars "API & Setup" → verify ID is `api-setup`
- [ ] Add 4 levels of headings → all get unique IDs

#### Table of Contents

- [ ] ToC shows "No headings yet" when empty
- [ ] Add H1 → appears in ToC
- [ ] Add H2 → appears indented
- [ ] Add H3 and H4 → proper indentation hierarchy
- [ ] Click ToC item in preview mode → scrolls to heading

#### Preview Mode

- [ ] Toggle to preview mode → content displays correctly
- [ ] Headings render with proper styling
- [ ] ToC clicks navigate to headings
- [ ] Toggle back to edit mode → editor state preserved

#### Save Functionality

- [ ] Click Save without title → shows error toast
- [ ] Click Save without content → shows error toast
- [ ] Click Save with valid data → success toast appears
- [ ] After save → redirects to `/pages` list
- [ ] Saved page appears in the Pages list

### Unit Test Examples

#### Test: `slugify` Function

```javascript
import { slugify } from "@/utils/headingUtils";

test("converts text to kebab-case", () => {
  expect(slugify("Hello World")).toBe("hello-world");
});

test("removes special characters", () => {
  expect(slugify("API & SDK Setup!")).toBe("api-sdk-setup");
});

test("handles multiple spaces", () => {
  expect(slugify("Multiple   Spaces")).toBe("multiple-spaces");
});

test("adds counter when provided", () => {
  expect(slugify("Features", 2)).toBe("features-2");
});
```

#### Test: `injectHeadingIds` Function

```javascript
import { injectHeadingIds } from "@/utils/headingUtils";

test("injects ID into single heading", () => {
  const input = "<h1>Introduction</h1>";
  const output = injectHeadingIds(input);
  expect(output).toContain('id="introduction"');
});

test("handles duplicate headings", () => {
  const input = "<h1>Features</h1><h2>Features</h2>";
  const output = injectHeadingIds(input);
  expect(output).toContain('id="features"');
  expect(output).toContain('id="features-1"');
});

test("preserves existing content", () => {
  const input = "<p>Text</p><h1>Heading</h1><p>More text</p>";
  const output = injectHeadingIds(input);
  expect(output).toContain("<p>Text</p>");
  expect(output).toContain("<p>More text</p>");
});
```

#### Test: `generateToc` Function

```javascript
import { generateToc } from "@/utils/headingUtils";

test("extracts headings correctly", () => {
  const html = '<h1 id="intro">Introduction</h1><h2 id="setup">Setup</h2>';
  const toc = generateToc(html);

  expect(toc).toHaveLength(2);
  expect(toc[0]).toEqual({ id: "intro", text: "Introduction", level: 1 });
  expect(toc[1]).toEqual({ id: "setup", text: "Setup", level: 2 });
});

test("returns empty array for no headings", () => {
  const html = "<p>Just a paragraph</p>";
  const toc = generateToc(html);
  expect(toc).toEqual([]);
});

test("handles headings without IDs", () => {
  const html = "<h1>No ID</h1>";
  const toc = generateToc(html);
  expect(toc).toHaveLength(1);
  expect(toc[0].id).toBe("");
});
```

## Troubleshooting

### Common Issues

#### 1. Editor Not Loading

**Symptom**: Blank page or console errors about Quill  
**Solution**:

- Ensure `react-quill` and `quill` are installed
- Check imports in `CreatePage.jsx`
- Verify `import 'react-quill/dist/quill.snow.css';` is present

#### 2. Dark Mode Styling Issues

**Symptom**: Editor toolbar not visible in dark mode  
**Solution**:

- The component includes custom styles for dark mode
- Check if `<style jsx global>` block is present in `CreatePage.jsx`

#### 3. ToC Not Updating

**Symptom**: Table of Contents doesn't update when adding headings  
**Solution**:

- Verify `useMemo` is correctly wrapping `generateToc(content)`
- Check React DevTools to ensure `content` state is updating

#### 4. IDs Not Injected on Save

**Symptom**: Saved HTML doesn't have heading IDs  
**Solution**:

- Confirm `injectHeadingIds(content)` is called in `handleSave`
- Check network tab to verify HTML in POST request has IDs

#### 5. Route Not Found

**Symptom**: 404 error when navigating to `/pages/create`  
**Solution**:

- Verify route is added to `routes/index.js`
- Check lazy import is correct: `lazy(() => import("@/pages/CreatePage"))`
- Restart dev server

## Performance Considerations

### Optimization Strategies

1. **Debounced ToC Generation**: For very large documents, consider debouncing the ToC generation:

```javascript
import { debounce } from "lodash";

const debouncedGenerateToc = useMemo(
  () => debounce((html) => generateToc(html), 300),
  [],
);
```

2. **Lazy Load Quill**: Reduce initial bundle size:

```javascript
const ReactQuill = lazy(() => import("react-quill"));
```

3. **Memoize Heading Utils**: Cache results for identical inputs using memoization libraries like `memoizee`.

## Security Notes

### XSS Prevention

The editor uses `dangerouslySetInnerHTML` for preview rendering. Ensure:

- Backend sanitizes HTML before saving to database
- Use libraries like `DOMPurify` on the server side
- Validate and escape user input

### Content Security Policy

If CSP is enabled, allow inline styles for Quill editor:

```
style-src 'self' 'unsafe-inline';
```

## Future Enhancements

Potential improvements for future versions:

- [ ] **Auto-save Draft**: Save content to localStorage every 30 seconds
- [ ] **Image Upload**: Integrate with image hosting service
- [ ] **SEO Metadata**: Add fields for meta title, description, keywords
- [ ] **Revision History**: Track and restore previous versions
- [ ] **Collaborative Editing**: Real-time multi-user editing with Socket.IO
- [ ] **Export Options**: Export as PDF, Markdown, or Word document
- [ ] **Custom Templates**: Pre-built page templates (FAQ, About Us, etc.)
- [ ] **Accessibility Checker**: Validate content against WCAG guidelines

## Contributing

When contributing to this feature:

1. Follow the existing code style (Tailwind classes, React hooks patterns)
2. Add tests for new utility functions
3. Update this README with any new features or changes
4. Ensure dark mode compatibility
5. Test on mobile devices before submitting PR

## License

This component is part of the Laichi Admin Panel project. Refer to the main project license.

## Support

For issues or questions:

- Check the troubleshooting section above
- Review the test examples for expected behavior
- Contact the development team

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Version**: 1.0.0  
**Maintainer**: Laichi Development Team
