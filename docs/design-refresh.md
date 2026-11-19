# Apple-inspired academic site refresh — 2026-11-19

Source: https://www.ui-skills.com/skills/emilkowalski/apple-design

## Design

- System typography, neutral surfaces, blue links, generous spacing, translucent navigation.
- Visible server-rendered content with native disclosures; no entrance animation that hides content.
- Immediate press feedback, visible keyboard focus, 44px controls, reduced-motion/transparency and higher-contrast styles.
- Shared publication cards with complete author display, uncropped source figures, venue distinctions, paper/code/project links and citations.
- Home, publications, awards and experience share one visual system. Existing URLs remain valid, including `/teaching/` for experience.
- Academic facts and original BibTeX remain unchanged. No unpublished project was added.

## Editing

- Biography: `content/bio.md`
- Papers and links: `content/publications.bib`
- Experience: `content/teaching.toml`
- Awards: `content/awards.toml`
- News: `content/news.toml`
- Identity/navigation: `content/config.toml`
- Homepage structure and introductory copy: `src/app/page.tsx`
- Design tokens and responsive layout: `src/app/globals.css`

The redesigned home is intentionally composed for this personal site rather than the original generic one-page template. The old `features.enable_one_page_mode`, `enable_likes` and `about.toml` section-order settings are not used by this homepage.

## Build on foundation_model_wyq

```bash
export PATH=/root/.local/node22/node-v22.23.4-linux-x64/bin:$PATH
cd /root/code/yeezie6.github.io
npm run build
```

The project exports static files to `out/`. Existing GitHub Actions deploys when `main` or `ci` is pushed. The design branch does not publish automatically.

## Validation

Production build, TypeScript and the build's lint checks pass. Browser checks cover all four routes, publication search, empty-state recovery, citation copy, theme cycling, 320px and 390px mobile layouts, and loaded paper/company images. Reduced-motion, reduced-transparency, contrast and print variants are implemented in CSS; OS preference emulation was not available in this browser test.
