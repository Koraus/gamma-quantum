import { css } from "@emotion/css";
import { Particle } from "./terms";
import { directionSymbol } from "./misc";

export function ParticleText({ particle: p }: { particle: Particle; }) {
    return <div className={css({
        border: `2px solid ${p.color}`,
        padding: "1px 2px",
        borderRadius: 6,
        margin: "0px 2px",
        color: p.color,
    })}>
        ?&nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{p.mass}
    </div>;
}
