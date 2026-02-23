# WYSIWYG Page Editor - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd laichi_admin
npm install react-quill quill
```

### Step 2: Verify Files

Check that these files exist:

- ✅ `src/pages/CreatePage.jsx`
- ✅ `src/utils/headingUtils.js`
- ✅ `src/routes/index.js` (should include CreatePage route)

### Step 3: Start the Dev Server

```bash
npm run dev
```

### Step 4: Test the Feature

1. Navigate to **http://localhost:4100/pages** (or your admin URL)
2. Click **"Add Page"** button
3. You should see the WYSIWYG editor!

---

## 📝 Creating Your First Page

### Basic Example

1. **Enter Title**: "Welcome to Our Store"
2. **Add Headings**:
   - Click H1 button, type: "Introduction"
   - Click H2 button, type: "Our Mission"
   - Click H2 button, type: "Contact Us"
3. **Add Content**: Write paragraphs between headings
4. **Check ToC**: See your headings appear in the right sidebar
5. **Preview**: Click "Preview" to see final result
6. **Save**: Click "Save Page"

### Advanced Example with All Features

```
Title: "Complete Guide"

Content:
---------
[H1] Getting Started
This is the introduction paragraph.

[H2] Prerequisites
You will need:
• Node.js 16+
• npm or yarn

[H2] Installation
Follow these steps carefully.

[H3] Clone Repository
Use git clone command.

[H3] Install Dependencies
Run npm install.

[H2] Configuration
Set up your environment variables.

[H4] Development Mode
For local testing.

[H4] Production Mode
For deployment.
```

**Result**: Table of Contents will show:

```
└─ Getting Started (H1)
   ├─ Prerequisites (H2)
   ├─ Installation (H2)
   │  ├─ Clone Repository (H3)
   │  └─ Install Dependencies (H3)
   └─ Configuration (H2)
      ├─ Development Mode (H4)
      └─ Production Mode (H4)
```

---

## 🎨 Toolbar Guide

| Button           | Function           | Keyboard Shortcut |
| ---------------- | ------------------ | ----------------- |
| **H1-H4**        | Headings (for ToC) | Ctrl+Alt+1-4      |
| **B**            | Bold text          | Ctrl+B            |
| **I**            | Italic text        | Ctrl+I            |
| **U**            | Underline          | Ctrl+U            |
| **S**            | Strikethrough      | -                 |
| **Ordered List** | 1. 2. 3.           | -                 |
| **Bullet List**  | • • •              | -                 |
| **Color**        | Text color         | -                 |
| **Background**   | Highlight          | -                 |
| **Align**        | Left/Center/Right  | -                 |
| **Link**         | Insert hyperlink   | Ctrl+K            |
| **Image**        | Insert image URL   | -                 |
| **Clean**        | Remove formatting  | -                 |

---

## 🧪 Testing Checklist

### Quick Test (2 minutes)

- [ ] Navigate to `/pages/create`
- [ ] Type a title
- [ ] Add 3 headings (H1, H2, H3)
- [ ] Verify ToC shows all 3 headings
- [ ] Click Preview → headings visible
- [ ] Click Save → success message

### Full Test (5 minutes)

- [ ] Add duplicate heading "Features" twice → IDs are unique
- [ ] Add special chars heading "API & SDK!" → converts to "api-sdk"
- [ ] Toggle Edit/Preview multiple times → no errors
- [ ] Click ToC item in preview → scrolls to heading
- [ ] Save page → redirects to `/pages` list
- [ ] Check new page appears in list

---

## 🐛 Common Issues & Fixes

### Issue: Editor not showing

**Solution**: Clear browser cache, restart dev server

### Issue: ToC not updating

**Solution**: Make sure you're using H1-H4 buttons (not manual HTML)

### Issue: Save button disabled

**Solution**: Enter both title and some content

### Issue: Dark mode looks broken

**Solution**: Custom styles are included, try toggling theme

### Issue: Images not uploading

**Note**: Current version uses image URLs, not file upload

---

## 📊 Real-World Examples

### FAQ Page Template

```
[Title] Frequently Asked Questions

[H1] General Questions
[H2] What is this service?
Our service provides...

[H2] How much does it cost?
Pricing starts at...

[H1] Technical Questions
[H2] What browsers are supported?
We support Chrome, Firefox...

[H2] Is there an API?
Yes, documentation is at...
```

### Terms & Conditions Template

```
[Title] Terms & Conditions

[H1] Agreement to Terms
By accessing our website...

[H2] Intellectual Property
All content is protected...

[H2] User Responsibilities
You agree to...

[H1] Privacy Policy
[H2] Data Collection
We collect...

[H2] Data Usage
Your data is used for...
```

### About Us Template

```
[Title] About Our Company

[H1] Our Story
Founded in 2020...

[H2] Mission Statement
We strive to...

[H2] Vision
We envision a world where...

[H1] Our Team
[H2] Leadership
[H3] CEO
[H3] CTO

[H2] Developers
[H3] Frontend Team
[H3] Backend Team
```

---

## 🔗 API Reference

### Save Page Endpoint

```javascript
POST /pages/add

Body:
{
  "title": "Page Title",
  "html": "<h1 id=\"intro\">Introduction</h1><p>Content</p>"
}

Response:
{
  "success": true,
  "data": { /* page object */ }
}
```

### Heading ID Format

- Original: `<h2>My Feature Name</h2>`
- After Save: `<h2 id="my-feature-name">My Feature Name</h2>`
- Duplicate: `<h2 id="my-feature-name-1">My Feature Name</h2>`

---

## 🎓 Best Practices

### Do's ✅

- Use H1 for main page title/introduction
- Use H2 for major sections
- Use H3 for subsections
- Use H4 for minor details
- Keep heading text concise (< 10 words)
- Preview before saving

### Don'ts ❌

- Don't skip heading levels (H1 → H3)
- Don't use headings for styling (use bold instead)
- Don't create very long headings
- Don't use special characters excessively
- Don't forget to add content between headings

### Heading Hierarchy Example

```
✅ Correct:
H1 → H2 → H3 → H4

❌ Incorrect:
H1 → H3 (skipped H2)
H2 → H1 (reversed)
```

---

## 🚀 Next Steps

After creating your first page:

1. **View it on the client**: Pages appear on your website
2. **Edit existing pages**: Click edit icon in Pages list
3. **SEO optimization**: Add meta descriptions (future feature)
4. **Analytics**: Track page views (future feature)

---

## 📚 Additional Resources

- **Full Documentation**: See `WYSIWYG_EDITOR_README.md`
- **Test Examples**: See `src/utils/__tests__/headingUtils.test.js`
- **Quill Docs**: https://quilljs.com/docs/
- **React Quill**: https://github.com/zenoamaro/react-quill

---

## 💡 Tips & Tricks

### Keyboard Shortcuts

- `Ctrl+S`: Save page (browser default, not implemented)
- `Ctrl+B`: Bold text
- `Ctrl+I`: Italic text
- `Tab`: Indent in lists

### Formatting Tips

- Use **Bold** for emphasis
- Use _Italic_ for citations or definitions
- Use bullet lists for unordered items
- Use numbered lists for sequential steps

### Performance Tips

- Don't paste huge images (use links instead)
- Keep pages under 10,000 words for best performance
- Use headings to break up long content

---

**Happy Page Creating! 🎉**

Need help? Check the troubleshooting section in the full README.
