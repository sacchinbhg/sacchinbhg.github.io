# Sacchin Sundar’s personal website

Static HTML, CSS, and JavaScript. No package installation or build step is needed.

## Preview

Serve this folder with any static HTTP server, then open index.html. For example, with Python installed:

    python -m http.server 8000 --bind 127.0.0.1

## Pages and entry points

- index.html is a single-screen Bharatanatyam eye study with a name, Sangam poetry & art / About links, and automatic story playback.
- landing.css supplies the quiet dark layout and shared typography for Home, About, and Sangam poetry.
- landing.mjs starts the approved eye artwork and redirects legacy section links.
- sangam.html and sangam.css present the Aintinai artwork link and three complete Kuruntokai poems in Tamil and English.
- about.html is a short personal introduction with profile links, including Twitter / X at https://x.com/sacchin_robots.
- studio.html and studio.mjs retain the full eyes, courtyard, and experimental gallery for legacy URLs; Studio is no longer linked from the main pages.
- site.js manages the six-image gallery in Studio.
- bharatanatyam-eyes.mjs and eye-story.mjs render the 144-second eye story, preserving the approved character and drawing style.
- story-stage.mjs and eye-story.css add synchronized narrative captions, an animated lamp, footsteps, doorway, rain, jasmine, to the homepage. The timeline and playback buttons have been removed at the user’s request.
- courtyard.mjs and courtyard-model.mjs provide the original interactive Three.js scene.
- vendor/three/ contains pinned Three.js 0.186.1 modules and the MIT license.
- tinai/index.html and tinai/viewer.css provide the full standalone Aintinai painting and its controls.
- fonts/ contains self-hosted Cormorant Garamond, DM Sans, and Noto Serif Tamil, with licenses.

## Homepage behavior

Every homepage visit shows the Bharatanatyam eyes. The random scene selection, scene switcher, embedded landscape, tagline, and extra homepage links were removed at the user's request for a minimal front page. The landscape lives behind Sangam poetry & art; research, contact, and social links remain available through About. Studio links were removed from About and Sangam to keep navigation minimal. Reduced-motion preferences start the eyes paused.

Old ?scene=eyes and ?scene=madurai parameters no longer change the homepage. Without JavaScript, the eye poster and normal navigation remain usable.

The homepage uses the viewport height and has no stacked sections or scroll interaction at normal desktop and phone sizes. Very short viewports may expand naturally so the story remains accessible. About also fits a normal desktop or phone viewport and can expand under extreme zoom. The reference for the minimal one-screen composition is https://andrewhunter.lol/; no code or visual assets were copied from it.

The Sangam page links to Madurai at the existing seed panai and center -21165, drifting at 32 world units per second. Dragging interrupts travel, which resumes after 3.5 seconds. The viewer keeps Pause motion visible and puts seed, pan distance, auto-scroll, and SVG download inside Explore options. Painting parameters include seed, center (or x), embed, paused, and drift.

## Sangam poetry

sangam.html pairs Kuruntokai 40 (Sempulap Peyaneerar), 3 (Devakulattar), and 6 (Patumanar) with fresh interpretive English renderings. The Tamil texts and attributions were checked against Project Madurai: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0110.html. English headings are editorial, and the page labels the translations as newly prepared renderings rather than attributing them to a published translator. The source link and artwork engine credit are visible below the poems. No contemporary translation was reproduced. Self-hosted Noto Serif Tamil renders the original text; the bilingual columns stack below 900px. The page works without JavaScript.

## Eyes: A late arrival — 2 minutes, 24 seconds

The homepage's original story follows a late arrival through six 24-second scenes: Waiting, A sound in the distance, You are late, What the rain kept, Trying not to smile, and Stay a little longer. It has 24 short narrative captions and 43 distinct expression labels. The 30-second version has been replaced by newly authored choreography with fast glances, held reactions, independent brows and eyelids, natural blinks, pupil changes, and small inclinations. A lamp flickers while she waits; approaching footsteps lead to the doorway; rain explains the delay; jasmine unfolds as she softens. The approved eye drawing, pendant, bindi, warm inner corners, and beauty mark remain.

One active-time clock drives the eyes, motifs, and captions automatically. The homepage has no timeline, timestamps, scene counter, Replay, Next scene, or Pause buttons. The story ends at 144 seconds and holds its final expression. Reloading the page starts it again. `?t=84&paused=1` opens a specific still moment; values are clamped to 0–144 seconds. Legacy Studio URLs retain the extended eye choreography without the homepage's narrative interface.

The drawing is made directly with Canvas paths and sampled into ASCII glyphs, without a photograph or generated image. A cached glyph atlas avoids text shaping on each frame. Painting is capped at 60fps; unchanged held poses reuse the previous drawing. Phones use a smaller grid. Supporting SVG artwork uses transform and opacity, sampled from the same clock. Caption changes use a 220ms ease-out; direct seeking and scene changes are immediate. The clock and caption transitions stop offscreen, when paused, and in hidden tabs. Reduced-motion visitors see a still pose; the homepage follows that preference without displaying playback controls. Enabling reduced motion during playback pauses in place. The eye study is an original interpretation, not a teaching demonstration of named classical movements.

Movement references: The Raadha Kalpa Method's Drishti Bheda introduction (https://www.theraadhakalpamethod.com/natyashastra-abhinaya-darpana/videos/dishibedha) and Sridevi Dance Academy's guide (https://www.sridevidanceacademy.com/blog/bharatanatyam-eye-movements-drishti-bheda-guide). These informed the emphasis on deliberate focus, held and sidelong glances, upward and lowered gaze, and expression in context. No photographs or video are copied into the website.

The character-based shading is inspired by stackedlol/ascii-sharks (https://github.com/stackedlol/ascii-sharks), by drewdi, MIT-licensed. No dependency or shark simulation is installed in the site. The previous kolam playground is retained in the task's backup, and its old URL fragment redirects to the eyes in Studio. Legacy #ascii-study, #courtyard, and #accidents homepage links also redirect to the matching Studio study.

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
