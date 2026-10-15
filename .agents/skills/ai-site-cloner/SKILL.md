---
name: ai-site-cloner
description: Comprehensive toolkit and pipeline for AI Site Cloner. Includes tools to crawl, extract, spec, clone, and restyle modern websites into Next.js. Use when the user wants to clone a website, replicate web UI, or rebrand a cloned site.
---

# AI Site Cloner Toolkit

AI Site Cloner provides an automated, end-to-end pipeline to reverse-engineer and clone websites into a pixel-accurate Next.js application, and rebrand them.

## Available Skills & Workflows
1. **`clone-website`**: Crawls target URL, extracts tokens, computed styles, assets, responsive layouts (PC, iPad, Phone), generates specs, dispatches builders, and runs scored pixel-diff QA.
2. **`restyle`**: Rebrands the cloned site using `BRAND.md`, swapping colors, typography, logos, and copy while preserving all layout structures and animations.

## Location of Pipeline & Scripts
The working repository is located at:
`c:\Users\khangmc\Desktop\phantrongkhangg\skills\ai-site-cloner`

To execute scripts:
```bash
cd c:\Users\khangmc\Desktop\phantrongkhangg\skills\ai-site-cloner
node scripts/manifest.mjs resume
node scripts/extract/page.mjs <url>
```
