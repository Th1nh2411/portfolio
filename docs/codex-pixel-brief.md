# Brief: painted pixel-art PNGs for the portfolio

## Context

This is a React portfolio with a retro pixel-game theme and a muted "Dusk" palette. Every in-site sprite currently exists as a **character-grid placeholder** in `src/game/sprites.ts`. Those grids are chunky: 1 art pixel is drawn as 2–6 screen pixels.

The owner wants them replaced by **finer, hand-painted pixel art** in the style of the reference image. The reference is a market-scene sheet: plant stand, fruit cart, fish rack, vending machines, and tall slender villagers.

**Your job:** paint each asset as a PNG and drop it into `public/sprites/`. The site detects each file automatically (`src/game/art.ts`) and swaps it in at the same on-screen size. No component code changes are needed. If a PNG is missing, the old grid sprite still shows.

## Style guide (match the reference)

- **Resolution:** 1 art pixel = 1 CSS pixel. No upscaling. Detail comes from single-pixel lines: thin rails, rope, wheel spokes, window frames, cloth folds.
- **Slender proportions:** objects are tall and light, not chunky. A character would be about 7 heads tall. Props have thin legs, thin frames, delicate trim.
- **Selective, coloured outlines:**
  - Outline each shape with a **darker shade of its own colour**: brown wood gets dark-brown lines, a blue cart gets navy lines.
  - Use near-black `#16152a` only in the deepest crevices.
  - No pure `#000000`.
  - Leave lit edges unoutlined where the shape reads anyway.
- **Muted, earthy pastels:** cream, terracotta, dusty peach, sage and olive green, faded denim blue, warm greys.
  - Saturation stays low. Never use neon or fully saturated colours.
  - Use pure white sparingly, only as 1px highlights.
- **Shading:**
  - Light comes from the **top-left**.
  - Each material gets a 3–5 step ramp.
  - **Hue-shift:** shadows go cooler (toward violet/blue), highlights go warmer (toward yellow/cream).
  - Little or no dithering. No gradients, no blur.
- **Texture with restraint:** wood grain, canvas stripes, glass reflections and metal glints are drawn as a few deliberate pixels, not noise.
- **Consistency:** all assets must look like one set. Same outline rules, same light direction, same palette family.

### Palette

Anchor on these. Add shades in between them as needed, but stay in this muted family.

| role | hex |
|---|---|
| night / deepest line | `#16152a` |
| dusk violet (cool shadow) | `#423e5c` `#565170` `#6e6886` |
| warm grey | `#918aa3` `#b9afbd` `#d9cfcf` |
| cream / paper | `#f7f2ec` `#fdf9f4` |
| peach (primary accent) | `#f0a07c` `#f6ba9c` |
| terracotta | `#c46850` `#a0503e` |
| sea teal | `#6fa3a0` `#4f8582` `#a9cfc9` |
| sky / denim blue | `#7fa7c9` `#a9c4e0` `#3f6a8f` |
| gold | `#e9c46a` `#a07a1e` `#fff3c4` |
| rose | `#d98a94` |
| lilac / plum | `#a99bc9` `#7d5a8c` |
| sage / olive / moss | `#8aa86b` `#6b7f4e` `#a7b38a` |
| skin | `#e8b996` `#c98f6b` |

### Backgrounds the art sits on (check contrast against these)

| name | hex |
|---|---|
| light page | `#f6efe7` |
| dark page | `#1c1b2e` |
| HUD / panels | `#16152a` |
| hero sky | a sunset photo: pink, peach and lavender |

## Technical rules (must pass)

1. **PNG, RGBA. Every pixel's alpha is either 0 or 255.** No anti-aliasing and no soft edges.
2. **Exact sizes.** Each file is a **horizontal strip of frames**, left to right, no padding or gaps. Strip width = frame width × number of frames. Strip height = frame height. Sizes are in the table below.
3. **Frames of one asset share the same silhouette and anchor.** Only the parts listed in the spec move, so loops don't jitter.
4. **Image-generation models are allowed only as a draft.** The final file must be cleaned up so it is genuinely pixel-exact:
   - nearest-neighbour resample to the exact size;
   - quantize to the palette family above;
   - binarise alpha;
   - hand-fix stray pixels, broken outlines and mushy detail.

   Painting directly (Aseprite, or a script that draws pixels) is preferred.
5. **Do not edit any code** except, if needed, the `frames` number for an asset in `src/game/art.ts`. Leave `src/game/sprites.ts` as is: it is the fallback.
6. Keep the sources (e.g. `.aseprite` files, or the generator script) in `art/` at the repo root, so the art can be re-exported later.

## Deliverables

Put all files in `public/sprites/`. "Frame" is the size of one frame in px. The existing grid sprite with the same name in `src/game/sprites.ts` shows the current silhouette and placement. Use it as a layout reference, not a style reference.

| file | frame | frames | where it shows | notes |
|---|---|---|---|---|
| `pigeon.png` | 72×52 | 4 | flies across the whole screen over page content (light or dark) | see **Pigeon** |
| `sun.png` | 18×18 | 1 | theme button in dark mode, on `#1c1b2e` | warm gold disc with short, delicate rays |
| `moon.png` | 18×18 | 1 | theme button in light mode, on `#f6efe7` | slim crescent, 1–2 tiny stars |
| `trophy.png` | 18×18 | 1 | HUD button on `#16152a` | small gold cup on a stem and base |
| `sound-on.png` | 18×18 | 1 | HUD button on `#16152a` | speaker with 2 thin sound arcs |
| `sound-off.png` | 18×18 | 1 | HUD button on `#16152a` | same speaker with a small × instead of arcs |
| `cartridge.png` | 192×144 | 1 | centre of the project-modal "insert cartridge" intro, on `#16152a` | see **Cartridge** |
| `cloud-a.png` | 96×40 | 1 | drifts across the top of the hero photo (sunset sky) | soft, puffy pixel cloud: cream top light, lilac/peach underside. No outline, or a very light one |
| `cloud-b.png` | 96×40 | 1 | same | different shape: flatter, wispy |
| `bird.png` | 14×10 | 4 | small flock drifting across the hero sky | dark silhouette (`#423e5c`), wing-flap loop |
| `achievements/<id>.png` | 32×32 | 1 each | achievements panel and unlock toast, on `#16152a` | see **Achievement badges** (11 files; 3 still needed) |

### Pigeon (`pigeon.png`, 72×52 ×4)

- A city pigeon in flight, facing right, carrying a **sealed letter** (cream envelope, small red wax seal) in its feet. It celebrates a sent contact message.
- Grey-violet body, white-ish wing bars, teal/lilac neck sheen, small gold beak and eye ring.
- 4-frame wing cycle: up, mid, down, mid. The body bobs at most 1px. The letter stays readable in every frame.
- It must read on both light and dark page backgrounds, so give it a clean coloured outline.

### Cartridge (`cartridge.png`, 192×144)

- A retro game cartridge seen from the front, in warm grey plastic with subtle moulded ridges, screws and a grip area.
- The bottom edge has a strip of gold contacts.
- **The label area must be a blank cream rectangle at x = 24–167, y = 30–89** (inclusive, in PNG pixels). The project title is overlaid there as text. Leave it empty, though it may have a thin border and a corner fold.

### Achievement badges (`achievements/<id>.png`, 32×32)

- These are shown on a **dark** background, so each is a badge on a **filled lighter base**: a round medal or shield with a soft metallic rim, plus one central glyph.
- One consistent base design across all 11. Vary only the glyph, and optionally the rim tint (bronze, silver, gold for rarer ones).
- File names must match these ids exactly:

| id (file name) | title | glyph | status |
|---|---|---|---|
| `press_start` | Press Start | gamepad | done |
| `chiptune` | Chiptune | speaker or music note | done |
| `night_owl` | Night Owl | owl, or crescent moon | done |
| `polyglot` | Polyglot | two speech bubbles ("A" / "Ă") | done |
| `world_map` | World Map | folded map with a dotted path and an X | done |
| `curious` | Curious | game cartridge | done |
| `completionist` | Completionist | three cartridges on a shelf | done |
| `messenger` | Messenger | pigeon with a letter | done |
| `lever` | Flip the Switch | a small toggle switch, flipped on | **needed** |
| `power_cycle` | Power Cycle | power symbol ⏻ with a circular arrow | **needed** |
| `full_power` | Full Power | glowing lamp / bulb with rays | **needed** |

## Acceptance check

1. A small script (commit it under `art/`) verifies every PNG:
   - the size equals frame × frames exactly;
   - every alpha value is 0 or 255;
   - the colour count is ≤ 32 per file.
2. `npm run dev`, open `http://localhost:5173`, and check:
   - **hero:** clouds and birds drift across the sky over the photo.
   - **navbar:** the theme button shows the moon (light) and the sun (dark).
   - **HUD (bottom right):** trophy and sound icons.
   - **click a project card:** the cartridge slides in and the project title sits inside the blank label.
   - **achievements:** in devtools, run `localStorage.setItem('px.game.v1', JSON.stringify({achievements:["press_start","chiptune","night_owl","polyglot","lever","power_cycle","full_power","world_map","curious","completionist","messenger"],seenProjects:[]}))`, reload, and click 🏆.
   - **pigeon:** run `window.dispatchEvent(new CustomEvent('px:quest'))` in the console.
3. Hard-reload once after adding files (the browser may cache a 404 for a missing sprite).
