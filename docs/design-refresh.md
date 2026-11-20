# Apple-inspired academic site refresh — 2026-11-19

Source: https://www.ui-skills.com/skills/emilkowalski/apple-design

## Design

- System typography, neutral surfaces, blue links, generous spacing, translucent navigation.
- Server-rendered content with native disclosures. Motion is opt-in before paint, with no-JavaScript and failed-hydration visibility fallbacks.
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

The redesigned home is intentionally composed for this personal site rather than the original generic one-page template. Research interests are read from `content/about.toml`. The old `features.enable_one_page_mode`, `enable_likes` and `about.toml` section-order settings are not used by this homepage.

## Upstream baseline

The initial cluster checkout was stale. GitHub main `742ba0456a35cee9ffa9c9b613334a6e4adc19c4` was subsequently merged in full. Biography, interests, news, internship details and publication metadata use that latest upstream content. Before future changes, fetch GitHub and compare the working branch with the deployed site; do not assume the cluster checkout is current.

## Build on foundation_model_wyq

```bash
export PATH=/root/.local/node22/node-v22.23.4-linux-x64/bin:$PATH
cd /root/code/yeezie6.github.io
npm run build
```

The project exports static files to `out/`. Existing GitHub Actions deploys when `main` or `ci` is pushed. The design branch does not publish automatically.

## Validation

Production build, TypeScript and the build's lint checks pass. Browser checks cover all four routes, publication search, empty-state recovery, citation copy, theme cycling, 320px and 390px mobile layouts, and loaded paper/company images. Reduced-motion, reduced-transparency, contrast and print variants are implemented in CSS; OS preference emulation was not available in this browser test.

## Interaction update — 2026-11-21

Inspired by the horizontal highlights and focused figure exploration at https://supermimic.github.io/.

- Homepage research uses a native scroll-snap gallery in the order ArtHOI, Being-H0.5, XPolicyLab. Buttons, touch scrolling and keyboard arrows/Home/End share the same position.
- Figures open in a native modal dialog with Escape, close button and backdrop dismissal, and focus restoration. The full publication list remains on `/publications/`.
- The initial Web Animations API entrance implementation was replaced by the first-paint reveal system described below. Reduced-motion settings disable entrance transitions and smooth scrolling.
- Scroll progress and hover feedback; no autoplay, wheel interception or new dependencies.
- Verified production build, desktop and 390px layout, gallery switching, modal close/focus restoration, filtered publication previews and an empty browser error/warning log. OS reduced motion was not emulated by the browser API.

## First-paint and scroll reveal correction — 2026-11-21

Observed SuperMimic's initial render and scroll states: 900 ms opacity/28 px translation with cubic-bezier(.28,.11,.32,1), triggered above the bottom 8% of the viewport. The earlier post-hydration WAAPI approach was easy to miss, and its global focus listener cancelled unrelated animations.

- A head bootstrap now opts into reveal styles before paint. Hero content arrives in 80 ms steps; explicitly marked section headings, biography paragraphs, the complete research gallery, experience cards, news and contact reveal once on entry. Interior pages use the same system.
- A 4 second watchdog restores visible content if hydration fails. With JavaScript disabled, the normal CSS is visible. Focus reveals only the focused branch. Reduced motion and print show every element immediately; reduced-motion changes and back/forward restoration settle animations.
- Native Explore chapter navigation, current-section indication, scroll progress and back-to-top; sliding publication selector, contextual image hover, modal enter/exit and native disclosure transitions. Native touch/keyboard scrolling remains available; no autoplay or dependency added.
- Preserved publication order: ArtHOI, Being-H0.5, XPolicyLab, and all academic content.
- Browser measurements confirmed intermediate hero opacities (0.22, 0.08, 0.005), section opacity 0.58 during scroll, and below-fold content waiting at opacity 0. Production build, types/lint and static resource checks pass. Modal Escape restores focus and body scrolling; failed hydration restores all content. Desktop, 390 px and 320 px layouts are checked. OS reduced-motion emulation is unavailable in this browser tool; its CSS and bootstrap guards are inspected separately.
