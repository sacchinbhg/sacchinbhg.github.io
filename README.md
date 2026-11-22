# Sacchin Sundar’s personal website

Static HTML, CSS, and JavaScript. No package installation or build step is needed.

## Preview

Serve this folder with any static HTTP server, then open index.html. For example, with Python installed:

    python -m http.server 8000 --bind 127.0.0.1

## Pages and entry points

- index.html is Small infinities: a minimal interactive ASCII aquarium with the name, Sangam poetry & art, and About navigation.
- landing.css supplies the quiet dark layout and shared typography for Home, About, and Sangam poetry.
- landing.mjs loads the original ASCII aquarium and preserves legacy section redirects.
- ascii-world.mjs manages aquarium composition, creature motion, anchored habitat, camera controls, and the animation lifecycle. ascii-world.css provides the quiet full-screen canvas layout.
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

Small infinities begins with an empty dark canvas. After a 0.9-second pause, a burst of characters resolves into a colourful aquarium: 24 aquatic creatures and eight reef habitat forms on desktop, or 15 creatures and six habitat forms on mobile. The active catalog contains 44 original aquatic creatures and eight habitat models: branching coral, sea fan, tube sponge, sea anemone, kelp, eelgrass, brain coral, and clam. Glass, a waterline, rising bubbles, and a seabed establish the aquarium around them. Random colours wash gradually across the geometry. Click to reshuffle the aquarium. Drag or use arrow keys to look around; Home resets the view.

The homepage has no Forms 40 or collection-picker interface. Pause and Clear remain quiet text controls. Every creature and habitat is an original surface model, with articulated motion where appropriate; there are no imported images, meshes, or runtime dependencies. The earlier 40-model collection remains in the project but is not the active homepage experience. Its constellation models are authored star-chart silhouettes with illustrative depth, not distance-to-scale astronomical reconstructions; Orion's characteristic arrangement was checked against [NASA's Orion overview](https://science.nasa.gov/asset/hubble/orion-constellation/).

All 52 active models include tailored surface detail: fish scales, fin rays, gill contours and patterned bands; turtle scutes and flipper veins; jellyfish bell canals; sucker rims, shell growth lines and crustacean seams; coral polyps, sponge pores, plant veins and clam mantle folds. These are sampled geometry and baked surface shading, so they follow the articulated model. Material contrast survives the shifting rainbow palette, with pale accents and darker markings. The finer character grid reveals the detail while a cached glyph-pixel layer batches character painting into one upload per frame.

`models/composition.mjs` starts with two larger focal creatures on opposing thirds, then places the remaining animals into open water using their projected silhouettes and the reef's footprint. Tall plants frame the sides; smaller central habitat leaves pockets for bottom dwellers. Depth, colours, and small placement variations stay random. Portrait screens stagger the focal animals vertically, and bottom dwellers' starting height follows their silhouette and the viewport's proportions.

`models/flow.mjs` gives each visible creature independent destinations that change over time, smooth steering, separation, subtle local alignment, and perspective-aware soft confinement. Swimming builds gently over the first seven seconds, beginning in the direction each creature already faces. Creatures then travel through depth rather than following a circular field. Fish face their swimming direction, jellyfish and other drifters move slowly, and bottom dwellers remain near their initial reef band. Habitat remains anchored to the seabed, with subtle movement in fronds and tentacles. A fixed 60Hz simulation makes paths independent of display refresh rate; the renderer paints at up to 30fps. Seeded randomness determines initial positions, sizes, colours, phases, and destination choices. Depth changes both perspective and illumination. Desktop-only creatures do not influence the mobile simulation while hidden.

Pause freezes the simulation, colour changes, and unfolding while manual camera controls remain available. Clear returns to a blank canvas and waits for a new interaction. Keyboard Enter and Space create a settled aquarium immediately. Reduced-motion visitors receive a still aquarium and may explicitly resume motion. Hidden tabs suspend the animation clock. Pixel ratio is capped at 2, and the geometry cache at 64 model/detail variants. A small text-art fallback and normal navigation work without JavaScript. Direct previews support `?specimen=green-sea-turtle&paused=1` (use an aquatic creature ID), and `?seed=42` reproduces an aquarium's initial conditions.

## Adding subjects

Add a definition to the appropriate aquatic module: `{id, name, category, orientation: [x, y, z], build(seed, quality)}`. Return `ModelBuilder.finish()` from the builder. Coordinates are x right, y down, z toward the viewer; the builder normalizes the geometry. Materials, normals, and joint indices are carried in the point buffer. Keep the default silhouette recognizable, use geometry rather than image conversion, and inspect the initial view and its rotated profile. Register creatures through models/aquarium-catalog.mjs with the appropriate swim, glide, drift, or bottom profile and size limits. Rooted habitat belongs in models/reef-habitat.mjs, with its floor attachment toward positive y. Update the catalog assertions and documentation when expanding the collection.

Run `node --test tests/aquarium.test.mjs` for the current aquarium integration suite: 58 checks covering all 52 models at qualities 0.65 and 1.05, finite normalized geometry, materials, joint integrity, deterministic generation, and four seeded three-minute simulations with the full creature catalog. The simulations check finite motion, bounded velocity, changing independent destinations, depth travel, reef-band bottom dwellers, and slower drift than swimming.

Run `node --test tests/composition.test.mjs` for 56 composition checks across five canvas sizes and multiple initial and reshuffled seeds. These cover reproducibility, viewport fit, reduced projected overlap, focal separation, the gentle opening, and continued bounded motion with hidden creatures excluded.

`tests/models.test.mjs` and `tests/flow.test.mjs` retain checks for the earlier collections and motion work; they do not replace the current aquarium integration suite.

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
