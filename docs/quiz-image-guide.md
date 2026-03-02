# Quiz Image Guide

> 2 images already placed (logos), **11 placeholder slots** need images

---

## Already Placed (Real Images)

| # | Step | Element | Current Source | Notes |
|---|------|---------|---------------|-------|
| A | Step 0 (Carousel) | `.qz-logo img` | `imgs/Logo_PNG_Colored_HOF.png` | 250px wide, auto height |
| B | Step 18 (Plans) | `.qz-logo img` | `imgs/Logo_PNG_Colored_HOF.png` | Same logo, repeated |

---

## Placeholders Needing Images (11 total)

### Carousel Slides (Step 0) — 6 images

All carousel images use `.qz-img-placeholder` at **1:1 square** aspect ratio, max 360px wide.

| # | ID | Placeholder Text | Suggested Image | AI Prompt Suggestion |
|---|-----|-----------------|-----------------|---------------------|
| 1 | `#qz-slide-img-1` | "Brand Network Image" | Grid/collage of brand logos (Nike, Adidas, Champion, etc.) on dark bg | "Flat lay grid of premium streetwear brand logos on a dark background, clean modern design, yellow accent highlights" |
| 2 | `#qz-slide-img-2` | "Clothing Options Image" | Phone screen showing clothing picks / swipe-to-choose UI | "Mobile phone mockup showing a clothing selection interface with streetwear items, dark UI, swipe cards" |
| 3 | `#qz-slide-img-3` | "Feedback Loop Image" | Illustration of style learning loop / AI matching graphic | "Abstract illustration of a style feedback loop, arrows connecting clothing items to a user profile, dark theme, yellow accents" |
| 4 | `#qz-slide-img-4` | "Membership Value Image" | Price tags showing retail vs. member pricing, or open box with clothing | "Open subscription box with premium streetwear clothing spilling out, dark moody lighting, price tags showing savings" |
| 5 | `#qz-slide-img-5` | "Before/After Image" | Side-by-side transformation: messy closet vs. curated wardrobe | "Split image showing messy wardrobe on left vs organized curated streetwear closet on right, dramatic lighting" |
| 6 | `#qz-slide-img-6` | "StyleDNA Image" | Abstract DNA helix made of clothing / fabric patterns | "Abstract DNA double helix made from fabric swatches and clothing patterns, dark background with golden yellow glow" |

### Compliment Screen (Step 3) — 3 images

These are **conditionally shown** based on the user's primary style answer (Q2). Only 1 displays at a time. Uses `4:3 landscape` aspect ratio.

| # | Style | Placeholder Text | Suggested Image | AI Prompt Suggestion |
|---|-------|-----------------|-----------------|---------------------|
| 7 | Streetwear | "Streetwear Models Image" | Male model(s) in streetwear — hoodies, joggers, sneakers, graphic tees | "Young man wearing streetwear outfit — hoodie, joggers, fresh sneakers — urban city background, confident pose, moody lighting" |
| 8 | Contemporary | "Contemporary Models Image" | Male model(s) in contemporary — clean layering, neutral tones, minimal | "Young man in contemporary minimalist outfit — fitted chinos, clean sneakers, layered basics — clean studio background" |
| 9 | Heritage | "Heritage Models Image" | Male model(s) in heritage — retro fits, vintage jackets, bold patterns | "Young man in retro heritage outfit — vintage jacket, classic denim, bold patterns — urban setting with warm vintage tones" |

### Tip Screens — 2 images

Both use `3:4 portrait` aspect ratio, max 300px wide. These are mid-quiz breathers.

| # | Step | Placeholder Text | Suggested Image | AI Prompt Suggestion |
|---|------|-----------------|-----------------|---------------------|
| 10 | Step 7 (Tip 1) | "Tip Photo 1" | Guy looking confident in a well-fitted outfit — shows the "fit matters" message | "Stylish young man in a perfectly fitted streetwear outfit looking confident, full body portrait, dark moody background, 3:4 ratio" |
| 11 | Step 12 (Tip 2) | "Tip Photo 2" | Hands measuring / tailor measuring tape on fabric — shows "custom fit" message | "Close-up of hands with measuring tape on premium fabric, tailoring streetwear, dark background, golden warm lighting, 3:4 ratio" |

### Summary Hero (Step 17) — 1 background

The `.qz-summary-hero` div is **240px tall** with a dark bg. Currently has no image.

| # | Step | Element | Suggested Image | AI Prompt Suggestion |
|---|------|---------|-----------------|---------------------|
| 12 | Step 17 (Summary) | `.qz-summary-hero` | Abstract gradient/texture background or lifestyle shot | "Abstract dark gradient with subtle golden yellow light streaks, luxury streetwear mood, wide banner format 16:5 ratio" |

---

## Summary Table

| Category | Count | Aspect Ratio | Size Target |
|----------|-------|-------------|-------------|
| Carousel slides | 6 | 1:1 square | 720x720px |
| Compliment variants | 3 | 4:3 landscape | 960x720px |
| Tip photos | 2 | 3:4 portrait | 600x800px |
| Summary hero bg | 1 | ~16:5 wide | 1000x240px |
| **Total needed** | **12** | | |

---

## File Naming Suggestion

Save to `imgs/quiz/` folder:

```
imgs/quiz/slide-1-brands.jpg
imgs/quiz/slide-2-options.jpg
imgs/quiz/slide-3-feedback.jpg
imgs/quiz/slide-4-value.jpg
imgs/quiz/slide-5-transformation.jpg
imgs/quiz/slide-6-styledna.jpg
imgs/quiz/compliment-streetwear.jpg
imgs/quiz/compliment-contemporary.jpg
imgs/quiz/compliment-heritage.jpg
imgs/quiz/tip-1-fit.jpg
imgs/quiz/tip-2-measure.jpg
imgs/quiz/summary-hero-bg.jpg
```

---

## How to Plug In

Once images are ready, each placeholder `<div class="qz-img-placeholder">` gets replaced with:

```html
<!-- Before (placeholder) -->
<div class="qz-img-placeholder" id="qz-slide-img-1">
  <span>Brand Network Image</span>
</div>

<!-- After (real image) -->
<div class="qz-img-placeholder" id="qz-slide-img-1">
  <img src="imgs/quiz/slide-1-brands.jpg" alt="Brand Network" />
</div>
```

The CSS already handles `img` inside `.qz-img-placeholder` with `object-fit: contain` and rounded corners.

---

_Created: March 3, 2026_
