# Synapse Neurobar — Asset Placement Guide

This folder holds all media assets for the landing page.
Place the files exactly as named below — the code already references them.

---

## Video Assets

| File | Description | Specs |
|------|-------------|-------|
| `video/hero.mp4` | 3D cocktail boomerang video for the hero section | MP4/H.264, 1920×1080, < 8 MB recommended |
| `video/molecule.mp4` | Floating molecule / liquid blob loop (optional background) | MP4/H.264, 1920×1080, < 5 MB |

**Boomerang note:** The JS code (`js/main.js → startBoomerang()`) automatically
plays the video forward then reverses it frame-by-frame — no special encoding needed.
Just provide a standard MP4. The code handles the boomerang effect.

---

## Cocktail Images

Place 8 images, one per cocktail. Use transparent-background PNG or WebP for best results.

| File | Cocktail |
|------|----------|
| `images/cocktail-1.webp` | SYNAPSE CÍTRICA |
| `images/cocktail-2.webp` | LEMON PIE |
| `images/cocktail-3.webp` | TROPICAL 'RAT' |
| `images/cocktail-4.webp` | BREEZE-HEAT |
| `images/cocktail-5.webp` | SUMMER PARADISE |
| `images/cocktail-6.webp` | AROUND THE WORLD |
| `images/cocktail-7.webp` | BRUMA DEL PACÍFICO |
| `images/cocktail-8.webp` | MISTERY COCKTAIL |

**To activate photos:** In `index.html`, find each `.cf-card__photo` element and set the `src` attribute.
The CSS will automatically show the photo and hide the illustrated glass behind it.

---

## Brand Assets

| File | Description |
|------|-------------|
| `images/logo.svg` | Full Synapse logo SVG (for use in nav/footer) |
| `images/logo-dark.svg` | Dark variant if needed on light backgrounds |
| `images/og-image.jpg` | Open Graph share image, 1200×630px |

---

## Recommended Tools

- **Video compression:** HandBrake (free) — use H.264 preset, CRF 28
- **Image optimization:** Squoosh (squoosh.app) — WebP format, quality 80
- **SVG optimization:** SVGOMG (jakearchibald.github.io/svgomg)
