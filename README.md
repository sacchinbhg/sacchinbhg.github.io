# Sacchin Sundar’s personal website

Static HTML, CSS, and JavaScript. No package installation or build step is needed.

## Preview

Serve this folder with any static HTTP server, then open index.html. For example, with Python installed:

    python -m http.server 8000 --bind 127.0.0.1

## Main files

- index.html: portfolio, Aintinai story and gallery, research, and contact links.
- mural.css: shared visual design and responsive layouts.
- site.js: landscape selection, motion controls, portrait, and artwork gallery.
- kolam.mjs and kolam-pattern.mjs: accessible kolam-inspired tile playground, symmetry, undo, palettes, and SVG export.
- blog.html: writing page with the same visual language.
- tinai/index.html: the original generative SVG painting with accessible controls and a centered-view parameter.
- tinai/viewer.css: standalone painting controls.
- fonts/: self-hosted Cormorant Garamond, DM Sans, and Noto Serif Tamil; each includes its SIL Open Font License.

## Painting parameters

seed fixes the generated world; x sets its left edge; center sets the visible center independently of viewport width. embed=1 hides standalone controls. paused=1 starts with animation paused. drift sets automatic travel speed.

The homepage starts at Madurai using seed panai, travelling continuously at 32 world units per second. The Pace slider ranges from a gentle drift to a faster walk. Dragging interrupts travel; it resumes after 3.5 seconds. Named landscape links are reproducible; New world chooses a fresh seed. The caption follows the landscape, and Enter the painting opens the current location. Reduced-motion preferences and offscreen visibility pause the embedded painting. Generated drawing data is kept within a bounded window and rebuilt from its seed when revisited. The six-image research-art gallery advances only when requested.

## Pattern playground

Play in the navigation opens a kolam-inspired geometric sketch. Turn tiles with a tap, Enter, or Space; arrow keys move between them. Four-way symmetry mirrors each edit. Visitors can choose Terracotta, Indigo, or Leaf, generate a new pattern, undo up to 40 changes, or download their current drawing as a self-contained SVG. This is a playful geometric interpretation, not a catalogue of traditional kolam designs. It runs entirely in the browser, with no added packages or server storage.

## Credits

Aintinai is Sacchin Sundar’s hand-authored generative art, built on the chunk engine of {Shan, Shui}* by Lingdong Huang (https://github.com/LingDong-/shan-shui-inf). Earlier portfolio template: Jon Barron (https://github.com/jonbarron/jonbarron_website). The portrait poster is a frame from the existing SacchinSundar.mp4. Existing research claims, authors, and abstracts are retained.

Public URL listed in the original project: https://sacchinbhg.github.io. Local edits do not publish the site.
