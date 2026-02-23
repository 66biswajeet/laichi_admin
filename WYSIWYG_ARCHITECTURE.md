# WYSIWYG Page Editor - Architecture Diagram

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Pages.jsx                                  │
│                     (Pages List View)                               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Bulk Actions │  │   Delete     │  │  Add Page    │─────┐       │
│  └──────────────┘  └──────────────┘  └──────────────┘     │       │
│                                                             │       │
│  ┌───────────────────────────────────────────────────┐     │       │
│  │           Pages Table                             │     │       │
│  │  • Title | Slug | Status | Actions                │     │       │
│  └───────────────────────────────────────────────────┘     │       │
└─────────────────────────────────────────────────────────────│───────┘
                                                              │
                                        history.push('/pages/create')
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CreatePage.jsx                                │
│                   (WYSIWYG Editor Component)                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  Title Input: [_____________________________]          │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
│  ┌──────────┐  ┌──────────┐                                        │
│  │   Edit   │  │ Preview  │  ◄── Mode Toggle                       │
│  └──────────┘  └──────────┘                                        │
│                                                                     │
│  ┌───────────────────────────┬──────────────────────────┐          │
│  │                           │                          │          │
│  │   Editor Area (75%)       │  ToC Sidebar (25%)      │          │
│  │                           │                          │          │
│  │  ┌─────────────────────┐  │  ┌────────────────────┐ │          │
│  │  │   Toolbar           │  │  │  Table of Contents │ │          │
│  │  │  H1 H2 B I U ...    │  │  │                    │ │          │
│  │  └─────────────────────┘  │  │  • Introduction   │ │          │
│  │                           │  │    • Features     │ │          │
│  │  ┌─────────────────────┐  │  │      • Install  │ │          │
│  │  │                     │  │  │    • Usage       │ │          │
│  │  │  React Quill        │  │  │  • FAQ          │ │          │
│  │  │  Editor             │──┼──┼─▶ (auto-update) │ │          │
│  │  │                     │  │  │                    │ │          │
│  │  │  (Edit Mode)        │  │  │  (clickable in    │ │          │
│  │  │                     │  │  │   preview mode)   │ │          │
│  │  └─────────────────────┘  │  └────────────────────┘ │          │
│  │                           │                          │          │
│  │  OR                       │                          │          │
│  │                           │                          │          │
│  │  ┌─────────────────────┐  │                          │          │
│  │  │                     │  │                          │          │
│  │  │  HTML Preview       │  │                          │          │
│  │  │                     │  │                          │          │
│  │  │  (Preview Mode)     │  │                          │          │
│  │  │                     │  │                          │          │
│  │  └─────────────────────┘  │                          │          │
│  │                           │                          │          │
│  └───────────────────────────┴──────────────────────────┘          │
│                                                                     │
│  ┌──────────┐  ┌──────────┐                                        │
│  │   Save   │  │  Cancel  │                                        │
│  └────┬─────┘  └──────────┘                                        │
│       │                                                             │
└───────│─────────────────────────────────────────────────────────────┘
        │
        │ handleSave()
        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    headingUtils.js                                  │
│                 (Utility Functions)                                 │
│                                                                     │
│  injectHeadingIds(content)                                          │
│  ┌───────────────────────────────────────┐                         │
│  │  Input: <h1>Features</h1>             │                         │
│  │         <h2>Features</h2>             │                         │
│  │                                       │                         │
│  │  1. Parse HTML                        │                         │
│  │  2. Extract headings                  │                         │
│  │  3. Slugify text → "features"         │                         │
│  │  4. Track duplicates → "features-1"   │                         │
│  │  5. Inject IDs                        │                         │
│  │                                       │                         │
│  │  Output: <h1 id="features">...</h1>   │                         │
│  │          <h2 id="features-1">...</h2> │                         │
│  └───────────────────────────────────────┘                         │
│                                                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │  PageServices.js    │
                     │                     │
                     │  POST /pages/add    │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   API Server        │
                     │                     │
                     │  Save to MongoDB    │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Success!          │
                     │                     │
                     │  Redirect to        │
                     │  /pages             │
                     └─────────────────────┘
```

## Data Flow Diagram

```
User Action                 Component State              Utility Functions
─────────────              ─────────────────            ─────────────────

Type in editor ──────▶  content state updated ──────▶  generateToc(content)
                                │                             │
                                │                             ▼
                                │                      Extract headings
                                │                      Return ToC array
                                │                             │
                                ▼                             ▼
                        Re-render component ◀─────── useMemo dependency
                                │
                                ▼
                        ToC sidebar updates


Click Save ───────────▶  handleSave() called
                                │
                                ▼
                        Validate title & content
                                │
                                ▼
                        injectHeadingIds(content) ──▶  Parse HTML
                                │                      Slugify headings
                                │                      Add unique IDs
                                │                             │
                                ▼◀────────────────────────────┘
                        htmlWithIds
                                │
                                ▼
                        PageServices.addPage({
                          title,
                          html: htmlWithIds
                        })
                                │
                                ▼
                        POST request to API
                                │
                                ▼
                        Success ────────▶ Redirect to /pages
                                │
                        Error ──────────▶ Show error toast
```

## File Structure

```
laichi_admin/
│
├── src/
│   ├── pages/
│   │   ├── Pages.jsx ──────────────────┐ (List view)
│   │   └── CreatePage.jsx ─────────────┤ (Editor)
│   │                                    │
│   ├── utils/                           │
│   │   ├── headingUtils.js ─────────────┤ (Core logic)
│   │   └── __tests__/                   │
│   │       └── headingUtils.test.js ────┤ (Tests)
│   │                                    │
│   ├── routes/                          │
│   │   └── index.js ────────────────────┤ (Route config)
│   │                                    │
│   ├── services/                        │
│   │   └── PageServices.js ─────────────┤ (API calls)
│   │                                    │
│   └── components/                      │
│       └── page/                        │
│           └── PageTable.jsx            │
│                                        │
├── WYSIWYG_EDITOR_README.md ────────────┤ (Full docs)
├── WYSIWYG_QUICK_START.md ──────────────┤ (Quick guide)
└── package.json ────────────────────────┘ (Dependencies)
```

## Component Lifecycle

```
Mount Phase
───────────
1. CreatePage mounts
2. Initialize state (title='', content='')
3. useMemo creates empty ToC
4. Render editor with empty content

Editing Phase
─────────────
1. User types → ReactQuill onChange fires
2. setContent(newContent) updates state
3. useMemo recalculates ToC
4. Component re-renders with new ToC

Save Phase
──────────
1. User clicks "Save Page"
2. Validate title and content
3. Call injectHeadingIds(content)
4. POST to API with processed HTML
5. On success → redirect
6. On error → show toast

Unmount Phase
─────────────
1. User navigates away
2. Component cleanup
3. State is lost (no autosave yet)
```

## Heading ID Generation Flow

```
Input HTML
──────────
<h1>Getting Started</h1>
<h2>Installation</h2>
<h2>Installation</h2>  ← Duplicate!
<h3>FAQ & Help</h3>

        │
        ▼

Parse with DOMParser
────────────────────
HTMLDocument {
  h1[0]: "Getting Started"
  h2[0]: "Installation"
  h2[1]: "Installation"
  h3[0]: "FAQ & Help"
}

        │
        ▼

Slugify + Track Duplicates
───────────────────────────
seenIds = {}

h1: "Getting Started" → "getting-started" → seenIds["getting-started"] = 1
h2: "Installation"    → "installation"     → seenIds["installation"] = 1
h2: "Installation"    → "installation-1"   → seenIds["installation"] = 2 ✓
h3: "FAQ & Help"      → "faq-help"        → seenIds["faq-help"] = 1

        │
        ▼

Inject IDs
──────────
<h1 id="getting-started">Getting Started</h1>
<h2 id="installation">Installation</h2>
<h2 id="installation-1">Installation</h2>
<h3 id="faq-help">FAQ & Help</h3>

        │
        ▼

Output to API
─────────────
{
  "title": "My Guide",
  "html": "<h1 id=\"getting-started\">..."
}
```

## ToC Generation Flow

```
HTML with IDs
─────────────
<h1 id="intro">Introduction</h1>
<p>Some text...</p>
<h2 id="features">Features</h2>
<h3 id="feature-a">Feature A</h3>
<h2 id="usage">Usage</h2>

        │
        ▼

querySelectorAll('h1,h2,h3,h4')
───────────────────────────────
NodeList[4] {
  0: <h1 id="intro">,
  1: <h2 id="features">,
  2: <h3 id="feature-a">,
  3: <h2 id="usage">
}

        │
        ▼

Extract Data
────────────
[
  { id: "intro",     text: "Introduction", level: 1 },
  { id: "features",  text: "Features",     level: 2 },
  { id: "feature-a", text: "Feature A",    level: 3 },
  { id: "usage",     text: "Usage",        level: 2 }
]

        │
        ▼

Render in Sidebar
─────────────────
└─ Introduction (H1)
   ├─ Features (H2)
   │  └─ Feature A (H3)
   └─ Usage (H2)
```

## React Hooks Flow

```
useState
────────
const [title, setTitle] = useState('')
const [content, setContent] = useState('')
const [isSaving, setIsSaving] = useState(false)
const [showPreview, setShowPreview] = useState(false)

        │
        ▼

useMemo (Performance Optimization)
──────────────────────────────────
const toc = useMemo(() => {
  return generateToc(content);
}, [content]);

Only recalculates when 'content' changes
Prevents unnecessary re-renders

        │
        ▼

useHistory (Navigation)
───────────────────────
const history = useHistory();

// After save success:
history.push('/pages');

// On cancel:
history.push('/pages');
```

## Error Handling Flow

```
User Action: Click Save
        │
        ▼
    Validations
    ───────────
    ├─ No title? ──────▶ notifyError('Please enter title')
    │                    return early
    │
    ├─ No content? ────▶ notifyError('Please add content')
    │                    return early
    │
    └─ Valid ──────────▶ Continue
                         │
                         ▼
                    try {
                      Process HTML
                      Call API
                    }
                         │
                         ├─ Success ────▶ notifySuccess()
                         │                setTimeout(redirect, 1s)
                         │
                         └─ Error ──────▶ catch {
                                            notifyError(message)
                                            console.error(error)
                                          }
                         │
                         ▼
                    finally {
                      setIsSaving(false)
                    }
```

---

This architecture ensures:
✅ Separation of concerns (UI vs Logic)
✅ Performance optimization (useMemo)
✅ User-friendly error handling
✅ Clean data flow
✅ Testable utility functions
