import type { Act } from "../lib/acts";
import { RevealText } from "./RevealText";

type Props = {
  act: Act;
};

export function Section({ act }: Props) {
  const align = act.align ?? "center";
  return (
    <section
      className={`section section--${align}`}
      data-act={act.i}
      data-key={act.key}
      id={`act-${act.i}`}
    >
      <div className="section__inner">
        <div className="section__copy">
          <RevealText>{act.copy}</RevealText>
          {act.small && (
            <div className="section__copy--small">
              <RevealText delay={0.45}>{act.small}</RevealText>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
