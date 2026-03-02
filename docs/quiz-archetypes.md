# Quiz Archetype System

> All archetypes were **created from scratch** for Haul of Fame. None came from the ThreadBeast reference site (which had no quiz flow).

## How It Works

The archetype is determined by combining **2 quiz answers**:
- **Q1** (Step 1): Motivation — 4 options
- **Q2** (Step 2): Primary Style — 3 options

**3 styles x 4 motivations = 12 unique archetypes**

---

## Archetype Matrix

| | Saving Time | Dressing Better | Finding Brands | Confidence |
|---|---|---|---|---|
| **Streetwear** | The Architect | The Curator | The Connoisseur | The Maverick |
| **Contemporary** | The Minimalist | The Strategist | The Tastemaker | The Gentleman |
| **Heritage** | The Original | The Collector | The Purist | The Icon |

---

## Full Archetype Details

### Streetwear Row

| Archetype | Motivation | Description |
|-----------|-----------|-------------|
| **The Architect** | Saving Time | Clean fits. Simple choices. Always looks good. |
| **The Curator** | Dressing Better | Strategic style. Maximum impact per dollar. |
| **The Connoisseur** | Finding Brands | Brand-conscious. Quality-driven. Always ahead. |
| **The Maverick** | Confidence | Bold moves. Loud presence. Unapologetic style. |

### Contemporary Row

| Archetype | Motivation | Description |
|-----------|-----------|-------------|
| **The Minimalist** | Saving Time | Less noise. More substance. Effortlessly sharp. |
| **The Strategist** | Dressing Better | Every piece has purpose. Nothing wasted. |
| **The Tastemaker** | Finding Brands | Refined taste. Premium picks. Sets the standard. |
| **The Gentleman** | Confidence | Classic energy. Modern confidence. Always polished. |

### Heritage Row

| Archetype | Motivation | Description |
|-----------|-----------|-------------|
| **The Original** | Saving Time | Timeless pieces. Zero effort. Maximum respect. |
| **The Collector** | Dressing Better | Curated closet. Vintage soul. Smart spending. |
| **The Purist** | Finding Brands | Heritage brands. Authentic quality. No shortcuts. |
| **The Icon** | Confidence | Retro swagger. Creative edge. Stand-out energy. |

---

## Traits Generation

Traits are built dynamically from 3 quiz answers:

### By Primary Style (Q2)
| Style | Traits |
|-------|--------|
| Streetwear | "Minimal but fresh", "Sticks to what works" |
| Contemporary | "Refined instinct", "Effortless vibes" |
| Heritage | "Vintage soul", "Creative flair" |

### By Color Preference (Q4)
| Color | Trait |
|-------|-------|
| Neutral | "Neutral colors on lock" |
| Bold | "Bold color energy" |
| Both | "Balanced palette" |

### By Design Preference (Q5)
| Design | Trait |
|--------|-------|
| Clean | "Details matter" |
| Graphic | "Statement pieces" |
| Both | "Open to anything" |

**Result**: Each user gets 4 trait pills on their summary card.

---

## StyleDNA Stats

Three percentage bars calculated from quiz answers:

| Stat | Base | Modifiers |
|------|------|-----------|
| **Creative Expression** | 50% | +10-20 (style), +5-15 (design), +3-10 (color) |
| **Trend Awareness** | 50% | +15 (streetwear), +5 (graphic/bold), -5 (heritage) |
| **Wardrobe Flexibility** | 50% | +15 (contemporary), +10 (clean/neutral), +3-5 (both) |

All stats capped at 95%.

---

## Summary Card Tags

4 colored tags shown on the summary card:
1. Primary Style (red) — e.g., "Contemporary"
2. Color Preference (blue) — e.g., "Bold Colors"
3. Design Preference (green) — e.g., "Graphic Designs"
4. Bottoms Fit (orange) — e.g., "Straight Fit"

---

## File Reference

- Archetype definitions: `js/quiz.js` lines 462-474
- Trait generation: `js/quiz.js` lines 528-547
- Stat calculation: `js/quiz.js` lines 549-573
- Summary rendering: `js/quiz.js` lines 484-526

---

_Created: March 3, 2026_
