# 📄 Next.js & Shadcn Resume Builder (Vercel Ready 🚀)

A modern, **100% client-side** Next.js (App Router) & Shadcn UI resume builder with **live multi-template preview (all 4 simultaneously)**, in-browser data editor, JSON import/export, and single-page A4 PDF printing.

---

## ⚡ Key Highlights for Vercel Deployment

- **100% Client-Side Architecture:** Zero server dependencies or database requirements.
- **`localStorage` Persistence:** Edits, template selections, font preferences, and custom data are automatically preserved in the browser.
- **📥 Import & 📤 Export JSON:** Export your customized resume as a `.json` backup file or import any existing JSON.
- **🔄 Instant Reset:** Restore initial default data with 1-click.
- **⚡ Multi-Preview Comparison View:** View all 4 templates side-by-side with live synchronized real-time data.
- **🖨️ Pixel-Perfect PDF Export:** Uses native browser print engine with A4 page rules, vector graphics, and active hyperlinks.

---

## 🚀 How to Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Next.js Shadcn Resume Builder"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**. Your resume builder will be live immediately!

---

### Option 2: Deploy directly via Vercel CLI
```bash
bunx vercel
```

---

## 💻 Local Development

```bash
bun dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🏗️ Production Build

```bash
bun run build
```
Generates an optimized static production build in `.next/`.
