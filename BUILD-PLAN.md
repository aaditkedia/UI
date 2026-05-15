# BUILD PLAN — "MAIN" scroll-driven WebGL site

> **For:** Claude Code (agentic build). Work through this **phase by phase, top to bottom.**
> Each phase has an **acceptance gate** — do not start the next phase until the current one
> passes. Commit at the end of every phase.
>
> **Reference files in this repo (read them first):**
> - `website-recreation-spec.md` — design system, color/type tokens, per-section breakdown,
>   and code patterns for every effect. **This is the source of truth for *what it looks like*.**
> - `main-site.html` — a working vanilla three.js prototype of the whole thing. **This is the
>   source of truth for *how the effects behave*.** Port its logic into the React structure
>   below; don't reinvent it.
>
> This plan is the source of truth for **architecture, file layout, and sequencing.**

---

## 0. Goal & scope

Rebuild the prototype as a production React app: a single-page, scroll-as-narrative site.
8 full-viewport "acts", one persistent WebGL canvas, glass/chrome 3D objects that morph as you
scroll, bloom, golden glow, line-by-line text reveals.

**Non-goals:** CMS, routing, backend, auth, i18n. One page. Ship static.

---

## 1. Stack (locked — do not substitute)

```bash
npm create vite@latest . -- --template react-ts
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
npm i gsap @studio-freight/lenis split-type zustand
npm i -D @types/three
```

| Concern | Library |
|---|---|
| Smooth scroll | `@studio-freight/lenis` |
| Scroll timing / reveals | `gsap` + `ScrollTrigger` |
| WebGL | `three` + `@react-three/fiber` |
| Materials / loaders / helpers | `@react-three/drei` (`MeshTransmissionMaterial`, `Environment`, `useGLTF`, `RoundedBox`, `Points`) |
| Post FX | `@react-three/postprocessing` (`Bloom`, `Vignette`, `Noise`, `DepthOfField`) |
| Text splitting | `split-type` |
| Shared scroll state | `zustand` |

Pin versions in `package.json` after install. Node 18+.

---

## 2. Final file structure

```
src/
  main.tsx
  App.tsx
  styles/
    global.css            # tokens, atmospheric layers, section layout, nav
  lib/
    smoothScroll.ts        # Lenis + GSAP ticker wiring
    useScrollProgress.ts   # zustand store: { progress 0..1 }
    acts.ts                # ACTS config: index, range, copy
  components/
    Nav.tsx
    Cursor.tsx
    Glow.tsx               # CSS golden radial glow (fades past hero)
    Grain.tsx  Vignette.tsx  ProgressBar.tsx
    Section.tsx            # generic full-viewport section + copy slots
    RevealText.tsx         # SplitType + GSAP line reveal
  three/
    Scene.tsx              # the single <Canvas>, Environment, post FX, Rig
    Rig.tsx                # reads scroll progress, drives active act
    materials.ts           # shared glass / chrome / copper / tile materials
    acts/
      Act0Hero.tsx         # faint glass orb
      Act1Thesis.tsx       # empty (type-only)
      Act2GlassCube.tsx
      Act3GlassSphere.tsx
      Act4Ribbons.tsx      # interwoven chrome ribbons + icon tiles
      Act5Rings.tsx        # concentric rings + glowing core
      Act6IconField.tsx    # parallax dark app-icon tiles
      Act7ChromeHuman.tsx  # GLTF bust + particle burst
public/
  models/human.glb         # see Phase 5 — placeholder until asset exists
  hdri/  fonts/  icons/
```

---

## 3. Core contracts (build these so every act is consistent)

**Scroll store** — `useScrollProgress.ts`
```ts
import { create } from "zustand";
export const useScrollProgress = create<{progress:number; set:(p:number)=>void}>(
  (set) => ({ progress: 0, set: (progress) => set({ progress }) })
);
```

**Acts config** — `acts.ts` (the architecture spine — 8 acts, equal ranges)
```ts
export const NUM_ACTS = 8;
// act i is active across scroll range [i/8, (i+1)/8]
export const ACTS = [
  { i:0, key:"hero",      copy:"It's the unseen and invisible signals that make us *human*." },
  { i:1, key:"thesis",    copy:"From Artificial Intelligence to *Personal Intelligence*." },
  { i:2, key:"cube",      copy:"A shift from isolated models to a *shared consciousness*." },
  { i:3, key:"sphere",    copy:"Where intent becomes *signal*, and signal becomes understanding." },
  { i:4, key:"ribbons",   copy:"The world's first network for *human intent*." },
  { i:5, key:"rings",     copy:"It stops mimicking — and starts *mirroring*." },
  { i:6, key:"iconfield", copy:"Machines that could reason, but not *remember us*." },
  { i:7, key:"human",     copy:"Real intelligence isn't trained. It's *felt*." },
] as const;
```

**Act component contract** — every file in `three/acts/` exports a component that:
- accepts `{ local:number; visible:number }` props (`local` 0..1 within the act, `visible` 0..1 fade weight)
- scales itself by `visible`, returns `null` visual when `visible < 0.002`
- drives its own rotation/morph from `local` + `useFrame` clock
- never mounts/unmounts per scroll — it's always in the tree, just scaled

`Rig.tsx` computes `actF = progress * NUM_ACTS`, then for each act passes
`local = clamp01(actF - i)` and `visible = window01(actF - i)` (fade-in 0–0.22, hold, fade-out 0.80–1).
Copy the `window01`/`lerp`/`clamp01` helpers from `main-site.html`.

---

## 4. Phases

### Phase 0 — Scaffold ⛳
- [ ] Vite + React + TS project, deps installed, dev server runs.
- [ ] Folder structure from §2 created (empty files OK).
- [ ] `smoothScroll.ts`: Lenis instance, `lenis.on('scroll', ScrollTrigger.update)`, GSAP ticker
      drives `lenis.raf`, `lagSmoothing(0)`. Init once in `App.tsx` `useEffect`.
- [ ] `useScrollProgress` store + one body-spanning `ScrollTrigger` that writes `progress`.
- [ ] 8 empty `<section>`s at `min-height:140vh` render and scroll smoothly.
- **Gate:** page scrolls with momentum; `progress` logs 0→1 in console.

### Phase 1 — Design system + DOM shell (no 3D yet) 🎨
- [ ] `global.css`: port all tokens + atmospheric layers + section layout + nav styles from
      `main-site.html`. Load **Hanken Grotesk** (200/300/400/500/600).
- [ ] `Glow`, `Grain`, `Vignette`, `ProgressBar`, `Nav` ("MAIN" + pill), `Cursor` components.
- [ ] `Section.tsx` + `RevealText.tsx`: SplitType into lines, GSAP `from` blur+rise on
      `ScrollTrigger` `start:'top 82%'`. Bold-word emphasis via `*word*` → `<b>` parsing.
- [ ] Drop the real copy from `acts.ts` into all 8 sections + footer.
- **Gate:** site looks intentional and on-brand with **zero WebGL** — glow, grain, type reveals,
      nav, cursor all working. Screenshot it; compare mood to `website-recreation-spec.md` §2.

### Phase 2 — WebGL foundation 🧱
- [ ] `Scene.tsx`: one `<Canvas>` fixed, full-screen, `z-index:2`, `alpha`, `dpr={[1,1.8]}`,
      `ACESFilmic` tone mapping. Pointer-events none.
- [ ] `<Environment>` (warm preset or HDRI) for IBL; key + rim lights per spec.
- [ ] `materials.ts`: shared `glass` (`MeshTransmissionMaterial`), `chrome`, `copper`, `tile`.
- [ ] `<EffectComposer>`: `Bloom` (strength ~0.85, threshold ~0.55, `mipmapBlur`), `Vignette`,
      `Noise`. (`DepthOfField` added in Phase 3 with the icon field.)
- [ ] `Rig.tsx`: reads `progress`, computes `actF`, renders all 8 acts with `local`/`visible`.
- [ ] Put **one** placeholder mesh in `Act2GlassCube` to prove the pipeline.
- **Gate:** glass cube appears mid-page, rotates as you scroll through act 2's range, blooms.

### Phase 3 — Build the 8 acts 🛠️ (one at a time, commit each)
Port behavior from `main-site.html`; upgrade materials to drei where noted.
- [ ] **Act0 Hero** — faint glass orb, slow drift.
- [ ] **Act1 Thesis** — empty group (type-only scene).
- [ ] **Act2 GlassCube** — `RoundedBox` + `MeshTransmissionMaterial`, tumble + x-drift.
- [ ] **Act3 GlassSphere** — sphere + copper octahedron core.
- [ ] **Act4 Ribbons** — 4 crossed `torusGeometry` ribbons (chrome/copper) + small icon tiles
      riding the curves; whole group spins. *Stretch:* swap tori for `TubeGeometry` along
      `CatmullRomCurve3` for true ribbons.
- [ ] **Act5 Rings** — 4 nested thin tori counter-rotating + emissive glass diamond core.
- [ ] **Act6 IconField** — ~16 dark `RoundedBox` tiles scattered in a shallow volume, per-tile
      tumble, group parallax from scroll + pointer, camera pushes through on `local`. Add
      `DepthOfField` so foreground tiles blur. Map real logo textures from `public/icons/`.
- [ ] **Act7 ChromeHuman** — chrome `TorusKnot` placeholder now; particle burst (`THREE.Points`,
      ~2600 pts, seeded directions, expands with `local^1.4`, opacity fades). GLTF swap in Phase 5.
- **Gate:** full scroll-through plays all 8 scenes; objects cross-fade cleanly at boundaries;
      60fps on a normal laptop.

### Phase 4 — Choreography polish 🎬
- [ ] Tune each act's `range`/easing so transitions feel deliberate, not mechanical.
- [ ] Optional: `ScrollTrigger` `pin` on acts that need the scene to "play" before releasing
      (cube, ribbons, human) — see spec §5.3. Keep `progress` math consistent if you pin.
- [ ] Whole-scene pointer parallax on camera; hero glow fades out as act 0 ends.
- [ ] Cross-act continuity: object N can start morphing toward object N+1's pose near range end.
- **Gate:** scrolling feels cinematic and continuous, not like 8 separate demos.

### Phase 5 — Assets, fallback, perf 🧪
- [ ] Replace `Act7` placeholder with a real stylized human bust `.glb` (`useGLTF`), gold chrome
      material, warm env. Until the asset exists, keep the torus-knot — **don't block on it.**
- [ ] Real HDRI in `public/hdri/`; real logo PNGs in `public/icons/`.
- [ ] **Reduced motion:** if `prefers-reduced-motion`, disable Lenis smoothing + freeze scenes to
      a static representative pose; keep content fully readable.
- [ ] **Mobile:** below ~680px, drop `dpr` to `[1,1.3]`, reduce tile count, simplify or disable
      `DepthOfField`/`Noise`; verify layout (text max-widths) holds.
- [ ] Perf pass: keep `MeshTransmissionMaterial` `samples` low (4–6), only 1–2 transmission
      objects visible at once, early-return `useFrame` work for acts with `visible < 0.002`.
- **Gate:** Lighthouse perf ≥ 85 desktop; no jank scrolling; reduced-motion + mobile both sane.

### Phase 6 — QA / Definition of Done ✅
- [ ] All 8 acts render, animate, and cross-fade on scroll (up **and** down).
- [ ] Text reveals fire once, measure correctly after fonts load (`document.fonts.ready` →
      `ScrollTrigger.refresh()`).
- [ ] No console errors/warnings; no memory growth on repeated scroll.
- [ ] Resize handled (camera aspect, renderer + composer size, `ScrollTrigger.refresh()`).
- [ ] Custom cursor, nav, progress bar, glow, grain, vignette all present.
- [ ] `npm run build` succeeds; `npm run preview` matches dev.
- [ ] Deployed (Vercel/Netlify), loads clean on a fresh browser.

---

## 5. Gotchas for the agent

- **One canvas, ever.** Never mount a `<Canvas>` per section. Acts are always in the tree;
  scale them by `visible`.
- **Don't unmount acts on scroll** — that thrashes GPU. Scale to ~0 and skip their `useFrame` work.
- **Tone mapping:** with `EffectComposer` + `OutputPass`, let the output pass own tone mapping /
  color space — don't double-apply. (drei's `<EffectComposer>` handles this; just don't fight it.)
- **SplitType timing:** split + animate **after** webfonts load or lines measure wrong. Call
  `ScrollTrigger.refresh()` in `document.fonts.ready`.
- **Lenis + ScrollTrigger:** must share a ticker (see Phase 0). If scroll feels detached from
  animations, this wiring is wrong.
- **`MeshTransmissionMaterial` is expensive.** It's the #1 perf risk. Keep counts and `samples` low.
- **No browser storage** anywhere — not needed, don't add it.
- **Asset gaps don't block.** Missing `.glb`/HDRI/icons → keep the prototype's placeholders and
  move on; leave a `// TODO: real asset` comment.
- Keep the prototype's exact copy and the **one-bold-word-per-sentence** typographic move — it's
  the signature of the design.

---

## 6. Suggested commit sequence

`chore: scaffold` → `feat: design system + dom shell` → `feat: webgl foundation` →
`feat: act2 glass cube` → … → `feat: act7 chrome human` → `polish: choreography` →
`feat: assets + fallback + perf` → `chore: qa + deploy`.
