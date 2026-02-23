/**
 * Unit Tests for headingUtils.js
 *
 * These tests demonstrate the expected behavior of the utility functions.
 * To run these tests, you'll need to set up a testing framework like Jest.
 *
 * Installation:
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom
 *
 * Run tests:
 * npm test
 */

import {
  slugify,
  injectHeadingIds,
  generateToc,
  scrollToHeading,
} from "../headingUtils";

describe("headingUtils", () => {
  describe("slugify", () => {
    test("converts text to lowercase kebab-case", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("My Great Feature")).toBe("my-great-feature");
    });

    test("removes special characters", () => {
      expect(slugify("API & SDK Setup!")).toBe("api-sdk-setup");
      expect(slugify("Question? Answer!")).toBe("question-answer");
      expect(slugify("100% Success")).toBe("100-success");
    });

    test("handles multiple spaces and dashes", () => {
      expect(slugify("Multiple   Spaces")).toBe("multiple-spaces");
      expect(slugify("Already-Dashed-Text")).toBe("already-dashed-text");
    });

    test("adds counter suffix when provided", () => {
      expect(slugify("Features", 1)).toBe("features-1");
      expect(slugify("Introduction", 2)).toBe("introduction-2");
    });

    test("handles empty strings", () => {
      expect(slugify("")).toBe("");
      expect(slugify("   ")).toBe("");
    });

    test("handles non-English characters", () => {
      expect(slugify("Café")).toBe("caf");
      expect(slugify("naïve")).toBe("nave");
    });
  });

  describe("injectHeadingIds", () => {
    test("injects ID into single heading", () => {
      const input = "<h1>Introduction</h1>";
      const output = injectHeadingIds(input);
      expect(output).toContain('id="introduction"');
      expect(output).toMatch(
        /<h1[^>]*id="introduction"[^>]*>Introduction<\/h1>/,
      );
    });

    test("handles multiple different headings", () => {
      const input = `
        <h1>Introduction</h1>
        <h2>Features</h2>
        <h3>Installation</h3>
      `;
      const output = injectHeadingIds(input);

      expect(output).toContain('id="introduction"');
      expect(output).toContain('id="features"');
      expect(output).toContain('id="installation"');
    });

    test("handles duplicate headings with counter", () => {
      const input = `
        <h1>Features</h1>
        <h2>Features</h2>
        <h3>Features</h3>
      `;
      const output = injectHeadingIds(input);

      expect(output).toContain('id="features"');
      expect(output).toContain('id="features-1"');
      expect(output).toContain('id="features-2"');
    });

    test("preserves existing HTML structure", () => {
      const input = "<p>Intro text</p><h1>Heading</h1><p>More text</p>";
      const output = injectHeadingIds(input);

      expect(output).toContain("<p>Intro text</p>");
      expect(output).toContain("<p>More text</p>");
      expect(output).toContain('id="heading"');
    });

    test("handles headings with HTML tags inside", () => {
      const input = "<h1><strong>Bold</strong> Heading</h1>";
      const output = injectHeadingIds(input);

      expect(output).toContain('id="bold-heading"');
    });

    test("handles all heading levels (h1-h4)", () => {
      const input = `
        <h1>Level 1</h1>
        <h2>Level 2</h2>
        <h3>Level 3</h3>
        <h4>Level 4</h4>
      `;
      const output = injectHeadingIds(input);

      expect(output).toContain('id="level-1"');
      expect(output).toContain('id="level-2"');
      expect(output).toContain('id="level-3"');
      expect(output).toContain('id="level-4"');
    });

    test("ignores h5 and h6 headings", () => {
      const input = "<h5>Level 5</h5><h6>Level 6</h6>";
      const output = injectHeadingIds(input);

      // Should not contain IDs for h5 and h6
      expect(output).not.toContain('id="level-5"');
      expect(output).not.toContain('id="level-6"');
    });

    test("is idempotent (calling twice produces same result)", () => {
      const input = "<h1>Test</h1>";
      const output1 = injectHeadingIds(input);
      const output2 = injectHeadingIds(output1);

      // Should have same number of id attributes
      const idCount1 = (output1.match(/id="/g) || []).length;
      const idCount2 = (output2.match(/id="/g) || []).length;
      expect(idCount1).toBe(idCount2);
    });
  });

  describe("generateToc", () => {
    test("extracts headings with IDs correctly", () => {
      const html = `
        <h1 id="intro">Introduction</h1>
        <h2 id="setup">Setup</h2>
      `;
      const toc = generateToc(html);

      expect(toc).toHaveLength(2);
      expect(toc[0]).toEqual({
        id: "intro",
        text: "Introduction",
        level: 1,
      });
      expect(toc[1]).toEqual({
        id: "setup",
        text: "Setup",
        level: 2,
      });
    });

    test("returns empty array when no headings present", () => {
      const html = "<p>Just a paragraph</p><div>Some content</div>";
      const toc = generateToc(html);

      expect(toc).toEqual([]);
    });

    test("handles headings without IDs", () => {
      const html = "<h1>No ID Heading</h1>";
      const toc = generateToc(html);

      expect(toc).toHaveLength(1);
      expect(toc[0]).toEqual({
        id: "",
        text: "No ID Heading",
        level: 1,
      });
    });

    test("preserves heading order", () => {
      const html = `
        <h1 id="first">First</h1>
        <h3 id="third">Third</h3>
        <h2 id="second">Second</h2>
      `;
      const toc = generateToc(html);

      expect(toc[0].text).toBe("First");
      expect(toc[1].text).toBe("Third");
      expect(toc[2].text).toBe("Second");
    });

    test("handles nested HTML inside headings", () => {
      const html = '<h1 id="test"><strong>Bold</strong> Text</h1>';
      const toc = generateToc(html);

      expect(toc[0].text).toBe("Bold Text");
    });

    test("ignores h5 and h6 headings", () => {
      const html = `
        <h1 id="h1">H1</h1>
        <h5 id="h5">H5</h5>
        <h6 id="h6">H6</h6>
      `;
      const toc = generateToc(html);

      expect(toc).toHaveLength(1);
      expect(toc[0].text).toBe("H1");
    });

    test("handles all supported levels (h1-h4)", () => {
      const html = `
        <h1 id="l1">Level 1</h1>
        <h2 id="l2">Level 2</h2>
        <h3 id="l3">Level 3</h3>
        <h4 id="l4">Level 4</h4>
      `;
      const toc = generateToc(html);

      expect(toc).toHaveLength(4);
      expect(toc.map((item) => item.level)).toEqual([1, 2, 3, 4]);
    });
  });

  describe("scrollToHeading", () => {
    test("scrolls to element when ID exists", () => {
      // Create a mock element
      const mockElement = document.createElement("h1");
      mockElement.id = "test-heading";
      mockElement.scrollIntoView = jest.fn();
      document.body.appendChild(mockElement);

      scrollToHeading("test-heading");

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });

      // Cleanup
      document.body.removeChild(mockElement);
    });

    test("does nothing when ID does not exist", () => {
      // Should not throw error
      expect(() => {
        scrollToHeading("non-existent-id");
      }).not.toThrow();
    });

    test("handles empty string ID", () => {
      expect(() => {
        scrollToHeading("");
      }).not.toThrow();
    });
  });

  describe("Integration Tests", () => {
    test("inject IDs and generate ToC workflow", () => {
      const originalHtml = `
        <h1>Introduction</h1>
        <h2>Features</h2>
        <h2>Features</h2>
        <h3>Installation</h3>
      `;

      // Step 1: Inject IDs
      const htmlWithIds = injectHeadingIds(originalHtml);

      // Step 2: Generate ToC
      const toc = generateToc(htmlWithIds);

      // Verify ToC structure
      expect(toc).toHaveLength(4);
      expect(toc[0].id).toBe("introduction");
      expect(toc[1].id).toBe("features");
      expect(toc[2].id).toBe("features-1");
      expect(toc[3].id).toBe("installation");
    });

    test("real-world content example", () => {
      const content = `
        <h1>Getting Started Guide</h1>
        <p>Welcome to our application.</p>
        
        <h2>Installation</h2>
        <p>Follow these steps:</p>
        <ol>
          <li>Download the package</li>
          <li>Run npm install</li>
        </ol>
        
        <h2>Configuration</h2>
        <h3>Basic Setup</h3>
        <p>Configure your settings.</p>
        
        <h3>Advanced Options</h3>
        <p>For advanced users.</p>
        
        <h2>FAQ</h2>
        <h3>How do I start?</h3>
        <p>Just follow the installation steps.</p>
      `;

      const processed = injectHeadingIds(content);
      const toc = generateToc(processed);

      expect(toc).toHaveLength(6);

      // Verify hierarchy
      const levels = toc.map((item) => item.level);
      expect(levels).toEqual([1, 2, 2, 3, 3, 2, 3]);

      // Verify IDs are unique
      const ids = toc.map((item) => item.id);
      const uniqueIds = new Set(ids.filter((id) => id !== ""));
      expect(uniqueIds.size).toBe(ids.filter((id) => id !== "").length);
    });
  });
});
