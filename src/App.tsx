import { useEffect } from "react";
import { initSmoothScroll, destroySmoothScroll } from "./lib/smoothScroll";
import { ACTS } from "./lib/acts";
import { Nav } from "./components/Nav";
import { Glow } from "./components/Glow";
import { Vignette } from "./components/Vignette";
import { Grain } from "./components/Grain";
import { ProgressBar } from "./components/ProgressBar";
import { Cursor } from "./components/Cursor";
import { Section } from "./components/Section";
import { Scene } from "./three/Scene";

function App() {
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  return (
    <>
      <ProgressBar />
      <Nav />
      <Glow />
      <Scene />
      <main className="sections">
        {ACTS.map((act) => (
          <Section key={act.key} act={act} />
        ))}
      </main>
      <footer className="footer">MAIN — Personal Intelligence</footer>
      <Vignette />
      <Grain />
      <Cursor />
    </>
  );
}

export default App;
