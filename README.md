# Post-Processing with R3F — Three.js Journey

Quick recap of what I learned in the **Post-Processing** lesson from [Three.js Journey](https://threejsjourney.com/) by Bruno Simon, implemented with **React Three Fiber**.

Post-processing applies full-screen shader passes *after* the scene is rendered, so you can add bloom, color grading, distortion, and other cinematic effects without changing the underlying geometry.

## What this project covers

This project is a small scene used to practice the post-processing pipeline in R3F: built-in effects from `@react-three/postprocessing`, composing passes, blend modes, tone mapping, and a custom effect written with GLSL.

- **`EffectComposer`** from `@react-three/postprocessing` to run a chain of passes on the rendered frame.
- **Built-in effects** (explored in code, some commented out): `Vignette`, `Noise`, `Bloom`, and `ToneMapping`.
- **`BlendFunction`** from `postprocessing` to control how each pass is composited onto the previous result.
- **Custom effect** by extending `Effect` from `postprocessing` with a fragment shader (`mainUv`, `mainImage`).
- **Uniforms and `update()`** to animate shader values over time (wave offset for the drunk distortion).
- **`leva`** for live tweaking of effect parameters (`frequency`, `amplitude`).
- **`r3f-perf`** to monitor performance while stacking effects.

## What I built

- A simple lit scene (sphere, cube, ground plane) with shadows and `OrbitControls`.
- An **`EffectComposer`** wrapping the scene output and applying effects in order.
- A **custom “drunk” effect** (`DrunkEffect` + `Drunk` component) that:
  - Distorts UVs with a sine wave in `mainUv` (`frequency`, `amplitude`, animated `offset`).
  - Tints the image in `mainImage` (greenish output color while preserving alpha).
  - Uses **`BlendFunction.DARKEN`** so the pass blends with the scene in a controlled way.
- **`ToneMapping`** with `ToneMappingMode.ACES_FILMIC` at the end of the pipeline for filmic color response.
- **Leva controls** to adjust drunk effect `frequency` and `amplitude` at runtime.

Commented-out passes in `experience.tsx` show where **Vignette**, **Noise** (with `premultiply` and `SOFT_LIGHT` blend), and **Bloom** (`luminanceThreshold`, `mipmapBlur`) fit into the same composer when enabled.

## What I learned

### 1) Why post-processing exists

- By default, Three.js draws the scene straight to the screen.
- With post-processing, the renderer first draws the scene into an **off-screen render target** (a texture), then runs one or more **full-screen passes** that read that texture and write a new result.
- Each pass is typically a **plane facing the camera** with a fragment shader—cheap to run, powerful for look development.

### 2) The effect pipeline and `EffectComposer`

- Passes run **in order**: the output of pass *n* becomes the input of pass *n + 1*.
- **`EffectComposer`** (from `postprocessing`, exposed in R3F via `@react-three/postprocessing`) manages render targets and swaps buffers between passes.
- In R3F, you wrap effects as children of `<EffectComposer>`; the library hooks into the render loop automatically.

### 3) Built-in effects vs custom effects

- **`postprocessing`** ships many ready-made effects (bloom, noise, vignette, depth of field, etc.).
- **`@react-three/postprocessing`** exposes them as React components with props matching the underlying effect API.
- For anything bespoke, you subclass **`Effect`**, pass a **fragment shader**, and register **uniforms** in the constructor.

### 4) Custom shader hooks: `mainUv` and `mainImage`

- In a custom `Effect` fragment shader, **`mainUv(inout vec2 uv)`** runs before the input color is sampled—you can distort, scale, or offset coordinates (here: vertical sine wobble for a “drunk” look).
- **`mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)`** receives the sampled color and writes the final pixel—useful for tints, grading, or stylized color shifts.
- Uniforms declared in the shader must be added to the `uniforms` map in the effect constructor (`Uniform` from Three.js).

### 5) Animating effects with `update()`

- Override **`update(renderer, inputBuffer, deltaTime)`** on your `Effect` subclass to change uniforms every frame.
- Here, **`offset`** increases with `deltaTime` so the sine wave scrolls and the distortion feels alive without touching React state.

### 6) Blend functions and tone mapping

- Each effect can specify a **`blendFunction`** (e.g. `DARKEN`, `SOFT_LIGHT`, `NORMAL`) that defines how its output is merged with the previous pass—same idea as layer blend modes in image editors.
- **Tone mapping** is often placed **last** in the chain so HDR-style values are compressed to displayable range with a chosen curve (e.g. ACES Filmic).

### 7) Wiring a custom effect in R3F

- Instantiate the effect class (`new DrunkEffect({ ... })`) and expose it with **`<primitive object={effect} />`** so it participates in the R3F tree like any other Three.js object.
- Pass props (`frequency`, `amplitude`, `blendFunction`) from React; for a production setup you might sync prop changes into uniforms or memoize the effect instance—here the focus is on learning the pipeline.

### 8) Performance awareness

- Every extra pass costs GPU time (extra full-screen draws and texture reads).
- **`r3f-perf`** helps spot regressions when enabling bloom, multisampling, or several stacked effects.
- Simpler effects (single shader, few uniforms) are cheaper than multi-pass effects like bloom with blur pyramids.

## Run the project

```bash
npm install
npm run dev
```

## Credits

Part of the **Three.js Journey** course by Bruno Simon.
