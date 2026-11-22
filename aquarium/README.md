# Full-page Three.js ASCII aquarium

This is the homepage artwork, loaded by `/index.html` through `landing.mjs`. The earlier `/experiments/three-aquarium/index.html` preview address redirects to the homepage.

The scene uses the project's pinned Three.js r186 modules, original triangle-mesh fish, a turtle, a ray, translucent jellyfish, plants, coral, floating particles, and a procedural caustic seabed. The existing seeded steering simulation supplies independent swimming destinations. The ASCII pass samples a WebGL render target and a cached glyph atlas entirely on the GPU; it does not read framebuffer pixels back to JavaScript or create a DOM element per character.

The aquarium fills the viewport edge to edge, with a centered name and Sangam / About links over the artwork. A soft attenuation of the characters behind the measured text bounds keeps the identity legible as creatures pass. The composition moves the focal animals around that space, including a separate portrait arrangement. The full-page background and minimal central identity take layout inspiration from [Andrew Hunter's portfolio](https://andrewhunter.lol/); the aquarium, typography, colours, and artwork remain this site's own.

Rendering is ASCII-only; the former solid 3D comparison switch and path have been removed. Drag or use arrow keys to orbit; Home resets the view. Pause freezes creature movement, light, particles, and plant motion. Reshuffle changes colours and the initial arrangement. Reduced motion starts paused; hidden tabs suspend rendering and the animation clock. `?seed=82&paused=1` gives a repeatable still for review. The phone composition displays 12 creatures instead of 18, staggered vertically through the water.

This scene uses a smaller selection of mesh creatures than the earlier 44-creature surface-sampled catalog, which remains in `models/` for legacy work. No external artwork, new package installation, or remote runtime assets are required.

References consulted: [Three.js ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html), [WebGLRenderTarget](https://threejs.org/docs/pages/WebGLRenderTarget.html), and the official [ASCII effect example](https://threejs.org/examples/webgl_effects_ascii.html). The shader, mesh artwork, and scene composition here are original.
