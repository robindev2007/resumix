# Resumix

A **100% client-side** resume builder built with Next.js (App Router), React 19, Tailwind CSS v4, and Shadcn UI. Edit your resume in the browser, compare all four templates side-by-side with live data, and export a pixel-perfect A4/Letter PDF — no backend, no database, no account.

---

## ✨ Features

### Editor
- **Structured, drag-and-drop editor** — reorder sections and entries with `@dnd-kit`.
- **Four section types** — `text`, `key_value`, `items`, and `list`, so you can model anything from a summary to a work history.
- **Rich Markdown editor** for prose sections.
- **Action Verb Picker** — one-click bullet rewrites to stronger verbs.
- **AI Copilot** — an MCP-style tool surface (`add_custom_section`, `update_section`, `delete_section`, `reorder_sections`, `update_personal_info`, `add_experience_or_project`, `polish_bullet_points`, `set_styling`) that edits the document directly.
- **Social links** for LinkedIn, GitHub, LeetCode, Play Store, App Store, Medium, Substack, YouTube, Discord, GitLab, Kaggle, Dribbble, and custom URLs.

### Design
- **4 Templates** — `modern-tech`, `classic-latex`, `two-column`, `compact-minimal`.
- **Multi-template comparison view** — render all four at once against the same live data.
- **8 color themes** (Obsidian Slate, Royal Navy, Emerald Forest, Electric Indigo, Ruby Crimson, Cyber Teal, Amber Bronze, Pure Charcoal) plus custom primary/secondary/accent hex values.
- **4 font pairings** — Modern Sans, Geist Clean, Inter Corporate, and Editorial Serif.

### Precision
- **Micro-styling** — exact `fontSize` (pt), `lineHeight`, `sectionSpacing`, `pageMargin` (mm), and divider style (`solid`, `dashed`, `dots`, `gradient`, `none`).
- **Paper options** — A4 or Letter, with compact / normal / spacious density.
- **Zoom canvas + page thumbnail nav** for pixel-level review.
- **PDF export** — native browser print for instant A4 output, plus a Puppeteer script for headless batch export.

### Data
- **Local-first** — every edit, template pick, font, and color persists to `localStorage`.
- **JSON import/export** — save a `.json` backup or import an existing one.
- **One-click reset** back to the default document.

---

## 🛠 Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Shadcn UI, Radix UI |
| Icons | lucide-react |
| Drag & drop | @dnd-kit |
| PDF | Browser print engine + puppeteer-core |
| Runtime | Bun (npm also works) |

---

## 🚀 Getting Started

```bash
git clone https://github.com/robindev2007/resumix.git
cd resumix
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

<details>
<summary>Using npm instead of Bun</summary>

```bash
npm install
npm run dev
```
</details>

---

## 📜 Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the dev server on port 3000 |
| `bun run build` | Production build into `.next/` |
| `bun start` | Serve the production build |
| `bun lint` | Run Next.js ESLint |
| `bun run export:pdf` | Headless PDF export to `cv.pdf` via Puppeteer |

> `export:pdf` looks for a local Chrome or Edge install on Windows. Run `bun dev` first so there is a server to hit.

---

## 📁 Project Structure

```
src/
  app/                       # App Router entry (layout, page, not-found)
  components/
    templates/               # The 4 resume templates
    ui/                      # Shadcn UI primitives
  features/
    resume/                  # Editor, preview, micro-styling, zoom, thumbnails
    ai-agent/                # Copilot drawer + tool definitions & executor
  lib/                       # Theme/font presets, action verbs, text & social helpers
  scripts/export-pdf.ts      # Puppeteer headless export
  styles/globals.css
  types/resume.ts            # ResumeDocument + section type definitions
plan/PRODUCT_ROADMAP.md
```

---

## ☁️ Deploying to Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset is auto-detected as **Next.js**.
3. Deploy — no environment variables or external services required.

Or use the CLI:

```bash
bunx vercel
```

---

## 📄 Data Format

Resumes are stored as a `ResumeDocument`:

```jsonc
{
  "version": "2.0",
  "meta": {
    "template": "modern-tech",
    "font": "inter",
    "theme": "navy",
    "themeConfig": { "fontSize": 10, "lineHeight": 1.4, "pageMargin": 12 }
  },
  "personal": { "name": "…", "title": "…", "email": "…", "links": [] },
  "sections": [
    { "id": "summary", "title": "SUMMARY", "type": "text", "content": "…" },
    {
      "id": "experiences",
      "title": "EXPERIENCE",
      "type": "items",
      "entries": [
        { "id": "…", "title": "…", "subtitle": "…", "period": "…", "highlights": ["…"] }
      ]
    }
  ]
}
```

---

## License

No license file has been added yet. Add one before publishing or reusing this code.
