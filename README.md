# Sacchin Sundar’s personal website

Static HTML, CSS, and JavaScript. No package installation or build step is needed.

## Preview

Serve this folder with any static HTTP server, then open index.html. For example, with Python installed:

    python -m http.server 8000 --bind 127.0.0.1

## Pages and entry points

- index.html is Small infinities: a minimal interactive ASCII aquarium with the name, Sangam poetry & art, and About navigation.
- landing.css supplies the quiet dark layout and shared typography for Home, About, and Sangam poetry.
- landing.mjs loads the Three.js ASCII aquarium and preserves legacy section redirects.
- aquarium/ contains the full-page Three.js aquarium, original mesh creatures, GPU ASCII pass, and the centered identity layout. See aquarium/README.md for its architecture and controls.
- ascii-world.mjs and ascii-world.css retain the earlier surface-sampled aquarium for legacy work; the homepage no longer loads them.
- models/aquarium-catalog.mjs supplies 44 aquatic creature models from ocean.mjs, wildlife.mjs, and reef-fish.mjs, plus eight rooted habitat models from reef-habitat.mjs. It assigns creature motion profiles and size limits.
- models/geometry.mjs supplies surface sampling and articulated joints; models/renderer.mjs provides perspective, normal-based lighting, depth testing, the cached character atlas, and aquarium details.
- models/composition.mjs arranges the opening from projected creature silhouettes and reef footprints, with two focal animals and responsive seabed placement.
- models/catalog.mjs retains the earlier 40-subject Ocean, Sky, Land, and Space collection for legacy work. models/sculptures.mjs retains the earlier abstract forms. Neither collection supplies the current homepage composition.
- sangam.html and sangam.css present the Aintinai artwork link and three complete Kuruntokai poems in Tamil and English.
- about.html is a short personal introduction with profile links, including Twitter / X at https://x.com/sacchin_robots.
- studio.html and studio.mjs retain the full eyes, courtyard, and experimental gallery for legacy URLs; Studio is no longer linked from the main pages.
- site.js manages the six-image gallery in Studio.
- bharatanatyam-eyes.mjs and eye-story.mjs render the 144-second eye story, preserving the approved character and drawing style.
- story-stage.mjs, eye-story.css, and story-reader.mjs retain the previous eye-story implementation; the new homepage does not load them.
- courtyard.mjs and courtyard-model.mjs provide the original interactive Three.js scene.
- vendor/three/ contains pinned Three.js 0.186.1 modules and the MIT license.
- tinai/index.html and tinai/viewer.css provide the full standalone Aintinai painting and its controls.
- fonts/ contains self-hosted Cormorant Garamond, DM Sans, and Noto Serif Tamil, with licenses.

## Homepage behavior

Small infinities fills the entire viewport with a colourful Three.js scene rendered entirely as ASCII. Original mesh fish, a sea turtle, a manta ray, jellyfish, kelp, coral, particles, and moving light on the seabed create a shared underwater space. The scene contains 18 creatures on desktop and 12 in a vertically staggered phone composition. The name and Sangam / About links sit in the middle, with a soft falloff in the artwork behind the text to keep them readable. There is no solid-rendering switch or framed canvas.

The GPU ASCII pass samples a WebGL render target and a cached character atlas. It does not read pixels back to JavaScript or create per-character DOM nodes. Three.js r186 is already pinned locally in vendor/three. The scene runs a fixed 60Hz steering simulation and paints at up to 30fps; device pixel ratio is capped at 1.5. Visible creatures seek independent, changing destinations through depth. Hidden phone-only creatures do not influence their motion.

Drag or use arrow keys to look around; Home resets the camera. Pause freezes creatures, lighting, particles, and plants. Reshuffle changes the arrangement and colours. Reduced-motion visitors start with a still scene and can explicitly resume it. Hidden tabs suspend rendering and the animation clock. The homepage keeps normal navigation usable if WebGL or JavaScript is unavailable. Direct previews support `?seed=82&paused=1` for a repeatable still.

The full-page background and central identity take layout inspiration from [Andrew Hunter's portfolio](https://andrewhunter.lol/). The earlier character-art references were Mukund Kapoor's [ASCII Chrome Theme](https://github.com/Mukundkapoor26/ascii-chrome-theme) and [Devault's ASCII generator](https://devault-ascii.pages.dev/ascii-generator/). The mesh artwork, ASCII shader, and aquarium composition are original. No artwork or source code from these references was copied.

The earlier local preview at experiments/three-aquarium/index.html redirects to the homepage. Existing legacy section links still redirect to About, Studio, or Sangam as appropriate.

## Earlier aquarium collection


Add a definition to the appropriate aquatic module: `{id, name, category, orientation: [x, y, z], build(seed, quality)}`. Return `ModelBuilder.finish()` from the builder. Coordinates are x right, y down, z toward the viewer; the builder normalizes the geometry. Materials, normals, and joint indices are carried in the point buffer. Keep the default silhouette recognizable, use geometry rather than image conversion, and inspect the initial view and its rotated profile. Register creatures through models/aquarium-catalog.mjs with the appropriate swim, glide, drift, or bottom profile and size limits. Rooted habitat belongs in models/reef-habitat.mjs, with its floor attachment toward positive y. Update the catalog assertions and documentation when expanding the collection.

Run `node --test tests/aquarium.test.mjs` for the earlier surface-model aquarium integration suite: 58 checks covering all 52 models at qualities 0.65 and 1.05, finite normalized geometry, materials, joint integrity, deterministic generation, and four seeded three-minute simulations with the full creature catalog. The simulations check finite motion, bounded velocity, changing independent destinations, depth travel, reef-band bottom dwellers, and slower drift than swimming.

Run `node --test tests/composition.test.mjs` for 56 composition checks across five canvas sizes and multiple initial and reshuffled seeds. These cover reproducibility, viewport fit, reduced projected overlap, focal separation, the gentle opening, and continued bounded motion with hidden creatures excluded.

`tests/models.test.mjs` and `tests/flow.test.mjs` retain checks for the earlier collections and motion work; they cover the earlier collections rather than the current Three.js mesh artwork.

The artistic references were Mukund Kapoor’s [ASCII Chrome Theme](https://github.com/Mukundkapoor26/ascii-chrome-theme) for living character art and [Devault’s ASCII generator](https://devault-ascii.pages.dev/ascii-generator/) for fine character shading. The sculpture geometry, composition, renderer, and burst interaction are original; no source code or art was copied from either reference.

The homepage no longer loads the Bharatanatyam story, transcripts, or eye artwork. The landscape remains behind Sangam poetry & art, with research, contact, and social links on About. Existing scene and time query parameters do not change the new canvas. Legacy section links still redirect to the appropriate page.

The Sangam page links to Madurai at the existing seed panai and center -21165, drifting at 32 world units per second. Dragging interrupts travel, which resumes after 3.5 seconds. The viewer keeps Pause motion visible and puts seed, pan distance, auto-scroll, and SVG download inside Explore options.

## Sangam poetry

sangam.html pairs Kuruntokai 40 (Sempulap Peyaneerar), 3 (Devakulattar), and 6 (Patumanar) with fresh interpretive English renderings. The Tamil texts and attributions were checked against Project Madurai: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0110.html. English headings are editorial, and the page labels the translations as newly prepared renderings rather than attributing them to a published translator. The source link and artwork engine credit are visible below the poems. No contemporary translation was reproduced. Self-hosted Noto Serif Tamil renders the original text; the bilingual columns stack below 900px. The page works without JavaScript.

## Legacy eye study

The original 144-second Bharatanatyam-inspired eye choreography remains in bharatanatyam-eyes.mjs and eye-story.mjs for Studio and old URLs. Its earlier homepage reader files remain in the project but are no longer loaded by index.html. The previous complete homepage is backed up in the task workspace. The eye study is an original interpretation, not a teaching demonstration of named classical movements.

Movement references: The Raadha Kalpa Method’s Drishti Bheda introduction and Sridevi Dance Academy’s eye-movement guide. The character shading was inspired by stackedlol/ascii-sharks, by drewdi. No photographs or video were copied into the drawing.

## Courtyard and supporting motion

Studio → The courtyard is an imagined miniature inspired by Madurai's colourful temple architecture, colonnades, palms, and stepped tanks. It is an original model, not a reconstruction of a specific temple. Drag horizontally to rotate it, or use the arrow buttons / arrow keys on the focused canvas. Morning, Golden hour, and Night change the light. Tap the water or use Float a flower to add a flower, up to eight at a time. Reset view restores the starting angle. Pause motion freezes the ambient movement while keeping view, lighting, and flower controls usable.

The 3D modules load within 300 pixels of the section. Static ornament is merged by material, pixel density is capped at 1.5, and the clock stops when offscreen or in a hidden tab. Reduced-motion starts paused. A screenshot of the original model remains when scripts or WebGL are unavailable. All dependencies are local; no CDN or build step is required. The pinned npm archive's SHA-512 integrity was verified before extracting its modules and license.

Landscape prints are aligned, still previews. General page entrances and pointer-driven tilt have been removed so motion stays in the artwork. The research-art gallery preloads the next image and crossfades it, including rapid repeated clicks. Keyboard changes are immediate, and reduced-motion removes spatial transitions.

Architecture reference: Madurai District's official temple photographs (https://madurai.nic.in/tourist-place/sri-meenakshi-sundareswarar-temple/). No photographs or third-party 3D models are incorporated into the courtyard. Three.js documentation: https://threejs.org/manual/pages/installation.html.

## Credits

Aintinai is Sacchin Sundar’s hand-authored generative art, built on the chunk engine of {Shan, Shui}* by Lingdong Huang (https://github.com/LingDong-/shan-shui-inf). Earlier portfolio template: Jon Barron (https://github.com/jonbarron/jonbarron_website). The portrait poster is a frame from the existing SacchinSundar.mp4. Publication sections were removed at the user’s request; Google Scholar is the research destination.

Public URL listed in the original project: https://sacchinbhg.github.io. Local edits do not publish the site.

## Legacy links

Old homepage #about, #work, and #contact links redirect to About. #studio, #ascii-study, #kolam, #courtyard, and #accidents redirect to the relevant Studio view. #aintinai opens the Sangam poetry & art page. The eye drawing and courtyard model remain unchanged; the eye story now runs for 144 seconds.
