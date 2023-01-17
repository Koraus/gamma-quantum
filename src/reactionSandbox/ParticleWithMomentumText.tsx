import { css } from "@emotion/css";
import { ParticleWithMomentum } from "./terms";
import { directionSymbol } from "./misc";

export function ParticleWithMomentumText({ particle: p }: { particle: ParticleWithMomentum; }) {
    return <div className={css({
        border: `2px solid ${p.color}`,
        padding: "1px 2px",
        borderRadius: 6,
        margin: "0px 2px",
        color: p.color,
    })}>
        {p.velocity > 0 ? directionSymbol[p.direction] : "\u2219"}
        &nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{p.mass}
    </div>;
}
