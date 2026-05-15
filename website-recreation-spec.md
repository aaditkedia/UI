# Website Recreation Spec — "MAIN" (scroll-driven WebGL landing page)

> Reverse-engineered from a 20s screen-recording. The capture is filmed off a monitor so
> exact hex values / fonts can't be pixel-confirmed — everything below is a best-read plus
> the libraries and code patterns you need to rebuild every effect. Treat color/type values
> as starting points, not gospel.

---

## 1. What this site actually is

A single-page, **scroll-as-narrative** site for an AI product. There is almost no "UI" in the
traditional sense — no big button grids, no feature tables. The whole page is a sequence of
**full-viewport scenes**, each with one **3D object** (chrome / frosted-glass material) floating
center-stage and a few lines of **large light-weight type** offset into a corner. As you scroll,
the camera and the 3D object morph from scene to scene, and text reveals line-by-line.

It's an "Awwwards / FWA" style build. The core stack is **React Three Fiber + GSAP ScrollTrigger
+ Lenis smooth scroll + heavy bloom post-processing.**

---

## 2. Design system

### Color
| Token | Value (approx) | Use |
|---|---|---|
| `--bg` | `#EAE7DE` → `#F3F0E8` (warm bone/cream, soft vertical gradient) | page background, every section |
| `--glow-core` | `#F2C98C` | center of the golden radial light |
| `--glow-mid` | `#D9A063` | mid falloff of the glow |
| `--copper` | `#C4733A` / `#A8552B` | iridescent edges on the 3D chrome objects |
| `--ink` | `#2A2722` | the rare dark text / tile bodies |
| `--text` | `#F4F2EC` at ~70–85% opacity | headline text (light, low-contrast on cream) |
| `--text-dim` | same, ~45% opacity | body paragraphs, captions |
| `--tile` | `#3A3732` semi-transparent | the dark rounded-square app-icon tiles |

The whole palette is **warm and desaturated**. No pure white, no pure black, no saturated accent.
Everything reads like sunlight through fog.

### Type
- One family, light + a bold weight only. It looks like a tight neo-grotesk — use **PP Neue
  Montreal**, **Aeonik**, **Söhne**, or free fallback **Inter** / **General Sans**.
- Headlines: large (clamp ~`2.5rem`–`4.5rem`), `font-weight: 300–400`, tight leading (~1.05),
  slight negative letter-spacing (`-0.02em`).
- **Emphasis = one or two words switched to `font-weight: 600`** mid-sentence ("make us **human**",
  "shared **consciousness**", "think **feel**", "two entirely **different** outputs"). This is the
  signature typographic move — copy it exactly.
- Body / captions: small (`0.8–0.95rem`), dimmed, max-width ~22ch, set in a column.
- Nav wordmark "MAIN" top-left, tiny tracking-wide uppercase.

### Layout
- Every section is `100vh`, `position: relative`, content centered with 3D canvas behind.
- Text never sits on the object — it's pushed to **bottom-left**, **right column**, or **dead-center**
  depending on the scene.
- Generous margins (`~6vw` side padding). Lots of empty space is the point.

### Lighting / mood
- A single huge **soft golden radial glow** sits behind the 3D object (think sun behind clouds).
- Strong **bloom** so highlights bloom out; mild **vignette**; subtle **film grain**.
- Objects are **chrome + frosted glass** with **copper iridescent rim light**.

### Chrome / UI bits
- Top-right: a small **pill button** (light, faint — likely "Sign up" / "Join").
- Possibly a custom **dot cursor**. Optional.

---

## 3. Section-by-section breakdown

Order is reconstructed from the recording (it loops, so exact sequencing is inferred).

| # | Scene | 3D object | Text (offset) | Notes |
|---|---|---|---|---|
| 1 | **Hero** | Soft golden glow orb only (no mesh, or a faint sphere) | bottom-left: "It's the unseen and invisible signals … that make us **human**" + "Scroll to explore" | Establishes palette + glow. Slow ambient drift. |
| 2 | **Thesis** | none — empty cream field | dead-center: "From Artificial Intelligence to Personal Intelligence." + tiny "Scroll to explore" | Pure-type breather scene. |
| 3 | **Glass cube** | translucent **frosted-glass cube**, slow tumble | right column: "AIs can now learn from one another, sharing human-aligned understanding across every domain. From isolated models to a **shared consciousness**." | `MeshTransmissionMaterial`, rounded edges. |
| 4 | **Glass sphere** | translucent **orb** with faint inner geometry / refraction | (minimal text) | Cube morphs → sphere as you scroll. |
| 5 | **Interwoven ribbons** | chrome **ribbon loops** crossing like an atom / "X", small **app-icon tiles embedded on the bands** | center: "The world's first network for human intent." | Continuously rotating. Icons are mapped onto the ribbon surface. |
| 6 | **Concentric rings** | rotating **torus rings** (3–4, nested) + a glowing **octahedron/diamond** core | left: "When AI learns from human signals, it stops mimicking and starts **mirroring**." + right body para | Rings counter-rotate at different speeds. |
| 7 | **Hyper-personalization** | two **portrait image cards** floating above small **glass chess-piece pedestals** | left: "Where intent equals **hyper-personalization**" · caption under cards: "Same prompt, two entirely **different** outputs." | Cards bob; pedestals are transmission-material. Card images: a violinist, a person at a desk, interior renders. |
| 8 | **Crowd statement** | foggy **silhouetted crowd** + same glass pedestals, deep haze | dead-center: "This is the next iteration of AI, where intelligence becomes personal." | Heavy depth fog. |
| 9 | **App-icon field** | many **dark rounded-square logo tiles** (Claude, OpenAI, Midjourney sail, Pi, "S.", etc.) scattered in 3D depth, depth-of-field blur, slow parallax drift | center: "We built machines that could reason but not remember us" → "They simulate intelligence but have never touched understanding" → "They know what we type, what we click, but nothing of who we are." | Tiles tumble slowly, parallax on scroll + mouse. Foreground tiles blurred. |
| 10 | **Chrome human** | **gold metallic human bust**; a **particle burst** erupts from the head; one shot is a top-down of the head with the burst | center: "Real intelligence isn't trained. It's felt." · earlier: "It's the moment before a decision, during a moment of emotion before a word. These were never captured. Until now." | The emotional climax. GLTF human + GPU particles. |

Sections 1–2 likely repeat as an outro before the loop.

---

## 4. Tech stack

```bash
npm create vite@latest main-site -- --template react-ts
cd main-site
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
npm i gsap @studio-freight/lenis
npm i split-type
# optional niceties
npm i leva maath
```

| Job | Library |
|---|---|
| Smooth / momentum scroll | **Lenis** (`@studio-freight/lenis`) |
| Scroll-driven animation, pinning, scrub | **GSAP** + **ScrollTrigger** |
| WebGL scene | **Three.js** + **React Three Fiber** |
| Glass material, helpers, GLTF loader, environment | **@react-three/drei** (`MeshTransmissionMaterial`, `useGLTF`, `Environment`, `Float`, `Image`) |
| Bloom / vignette / DOF / grain | **@react-three/postprocessing** |
| Line/word/char text splitting for reveals | **split-type** |
| Easing math, particle helpers (optional) | **maath** |

If you want to skip WebGL entirely, see §7 for a lighter fallback.

---

## 5. Core effects — code patterns

### 5.1 Lenis smooth scroll, driving GSAP

```js
// lib/smoothScroll.js
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```

### 5.2 Scroll progress → R3F (the spine of the whole site)

Share one scroll value with the canvas so the 3D object morphs as you scroll.

```jsx
// store.js
import { create } from "zustand";
export const useScroll = create((set) => ({ progress: 0, set }));
```

```jsx
// hook it once, e.g. in App
useEffect(() => {
  const st = ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => useScroll.getState().set({ progress: self.progress }),
  });
  return () => st.kill();
}, []);
```

```jsx
// inside a <Canvas> child
function Rig() {
  const ref = useRef();
  useFrame(() => {
    const p = useScroll.getState().progress; // 0..1 across whole page
    ref.current.rotation.y = p * Math.PI * 6;
    ref.current.position.y = Math.sin(p * Math.PI * 2) * 0.5;
  });
  return <group ref={ref}>{/* objects */}</group>;
}
```

### 5.3 Pinning a section while its scene plays

```js
ScrollTrigger.create({
  trigger: ".section-glass-cube",
  start: "top top",
  end: "+=150%",      // scroll this much while pinned
  pin: true,
  scrub: 1,
});
```

### 5.4 Frosted-glass object (cube / sphere / pedestals)

```jsx
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";

function GlassCube() {
  return (
    <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.12} smoothness={6}>
      <MeshTransmissionMaterial
        thickness={0.9}
        roughness={0.15}
        transmission={1}
        ior={1.4}
        chromaticAberration={0.25}   // gives the copper-ish edge fringe
        anisotropy={0.3}
        distortion={0.2}
        distortionScale={0.4}
        temporalDistortion={0.1}
        backside
      />
    </RoundedBox>
  );
}
```

Use the same material for the **sphere** (`<Sphere>`) and the **chess-piece pedestals**.
For the **chrome ribbons / rings**, swap to `meshStandardMaterial` with `metalness={1}
roughness={0.15}` and a warm `<Environment>` so they pick up the copper reflections.

### 5.5 Bloom + vignette + grain (the "glow" look)

```jsx
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";

<EffectComposer>
  <Bloom intensity={1.2} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
  <Vignette eskil={false} offset={0.3} darkness={0.6} />
  <Noise opacity={0.04} />
</EffectComposer>
```

### 5.6 The big golden radial glow

Cheapest version is pure CSS behind the canvas:

```css
.glow {
  position: absolute; inset: 0;
  background: radial-gradient(40% 40% at 50% 50%,
    rgba(242,201,140,0.9) 0%,
    rgba(217,160,99,0.45) 35%,
    rgba(234,231,222,0) 70%);
  filter: blur(40px);
  mix-blend-mode: screen;
}
```

For a WebGL version, render a soft sprite/plane with an additive radial texture and let Bloom eat it.

### 5.7 Scroll text reveal (line-by-line blur + clip)

```js
import SplitType from "split-type";

const split = new SplitType(".reveal", { types: "lines" });
gsap.from(split.lines, {
  yPercent: 120,
  opacity: 0,
  filter: "blur(12px)",
  stagger: 0.12,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".reveal", start: "top 80%" },
});
```

Wrap the emphasis words in `<b>` in the markup so the bold weight just works.

### 5.8 Interwoven ribbons with embedded icons

- Build each ribbon as a `TubeGeometry` along a closed 3D curve (`CatmullRomCurve3`), or extrude a
  thin flat strip along the curve, several curves crossed at different orientations.
- Material: chrome `meshStandardMaterial` + `<Environment preset="sunset">` for the warm reflections.
- Embed icons by placing small `<RoundedBox>` "tiles" (or textured planes) at sampled points along
  the curve via `curve.getPointAt(t)` and orienting them to the curve tangent.
- Rotate the whole `<group>` continuously in `useFrame`.

### 5.9 Concentric rings + diamond core

```jsx
function Rings() {
  const g = useRef();
  useFrame((_, dt) => {
    g.current.children.forEach((ring, i) => {
      ring.rotation.x += dt * (0.2 + i * 0.15);
      ring.rotation.y += dt * (0.1 + i * 0.1);
    });
  });
  return (
    <group ref={g}>
      {[1, 1.4, 1.8].map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.04, 16, 120]} />
          <meshStandardMaterial metalness={1} roughness={0.2} />
        </mesh>
      ))}
      <mesh>
        <octahedronGeometry args={[0.45]} />
        <meshStandardMaterial emissive="#F2C98C" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
```

### 5.10 Floating app-icon tile field

- ~12–18 `<RoundedBox>` tiles, dark semi-transparent material, each with a logo texture on the
  front face (`<Image>` from drei, or a `meshBasicMaterial` with a `useTexture`).
- Random positions in a shallow box volume; vary z so some are near camera.
- Slow per-tile tumble in `useFrame`; whole group gets **parallax from scroll + mouse**:
  ```js
  group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, mouse.x * 0.3, 0.05);
  group.position.z = scrollProgress * 4; // pushes camera "through" the field
  ```
- Add `<DepthOfField>` from postprocessing so foreground tiles blur out.

### 5.11 Chrome human + particle burst

- Load a stylized human bust GLTF (`useGLTF`), apply a gold chrome `meshStandardMaterial`
  (`metalness: 1, roughness: 0.25`, warm env map).
- Particle burst: `THREE.Points` with a few thousand vertices seeded at the head position,
  given outward velocities; animate position in `useFrame` (or a small GPGPU shader if you want
  it fancy). Fade opacity over life. Trigger/scrub the burst with that section's ScrollTrigger.
- The top-down shot is just a second camera angle keyed to scroll within the pinned section.

---

## 6. Build order (so you don't drown)

1. **Scaffold + scroll.** Vite + React, Lenis + GSAP wired, 10 empty `100vh` sections, the
   shared `scrollProgress` store. Get smooth scroll feeling right *first*.
2. **Background + type system.** Cream gradient bg, CSS golden glow, font loaded, headline +
   body components with the `<b>` emphasis pattern, the SplitType reveal. The site should already
   look good with zero 3D.
3. **One `<Canvas>`, fixed, full-screen, behind content.** Add `<Environment>` + bloom. Drop in
   the **glass cube**. Wire it to `scrollProgress`.
4. Add scenes one at a time in narrative order: sphere → ribbons → rings → pedestals/cards →
   icon field → chrome human. Each is just another object swapped/positioned by scroll range.
5. **Transitions.** Cross-fade or morph objects at section boundaries; pin sections that need
   the scene to "play" before releasing.
6. **Polish.** DOF on the icon field, grain, vignette, custom cursor, the pill nav button,
   "Scroll to explore" hint, mobile fallback.

---

## 7. Lighter fallback (no WebGL)

If R3F is too heavy or you need it shippable fast:

- Keep **Lenis + GSAP + SplitType** — they carry 70% of the feel.
- Replace 3D objects with **pre-rendered transparent PNG/WebM sequences** (render the cube/sphere/
  ribbons once in Blender, export a frame sequence, scrub it with ScrollTrigger) or with
  **CSS 3D transforms** (`transform-style: preserve-3d`, rotating `<div>`s) for the cube, rings,
  and tile field.
- The golden glow, grain, vignette, gradient bg, and all text reveals are pure CSS and identical.
- You lose real refraction/bloom but keep the scroll choreography, which is what sells it.

---

## 8. Asset checklist

- [ ] Font files (PP Neue Montreal / Aeonik / or Inter + General Sans)
- [ ] Human bust GLTF (stylized, low-ish poly) for the chrome figure
- [ ] HDRI / `Environment` map, warm "sunset" tone, for chrome reflections
- [ ] Logo textures for the icon-field tiles (square, on transparent or dark)
- [ ] Card images for the hyper-personalization section (portraits / interior renders)
- [ ] Optional: radial glow sprite texture, grain texture

---

## 9. Performance notes

- One `<Canvas>` for the whole page, objects toggled by scroll range — never mount a canvas per section.
- `dpr={[1, 1.75]}`, `frameloop="demand"` won't work with constant scroll anim, so instead keep
  scenes cheap: low-poly, `mipmapBlur` bloom, cap DOF samples.
- Pause `useFrame` work for sections that are off-screen (check scroll range, early-return).
- `MeshTransmissionMaterial` is expensive — keep `samples` low (4–6) and only one or two transmission
  objects visible at once.
- Respect `prefers-reduced-motion`: disable Lenis smoothing + freeze scenes to a static pose.

---

## 10. Quick reference — the five things that *make* this look

1. Warm cream bg + one soft golden radial glow + heavy bloom. Never pure white/black.
2. Chrome + frosted-glass objects with copper iridescent edges (`MeshTransmissionMaterial` +
   `chromaticAberration`, or chrome `meshStandardMaterial` + warm env map).
3. One object center, big light type shoved into a corner, tons of negative space.
4. Bold-weight emphasis on one or two words per sentence.
5. Everything choreographed to scroll — Lenis for feel, ScrollTrigger for timing, line-by-line
   blur reveals for text.
