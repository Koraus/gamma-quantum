import { css } from "@emotion/css";
import { ParticleWithMomentum } from "./terms";
import { directionSymbol } from "./misc";

export function ParticleText({ particle: p }: { particle: ParticleWithMomentum; }) {
    return <div>
        &nbsp;
        <span className={css({ color: p.color })}>@</span>
        &nbsp;
        {p.velocity > 0 ? directionSymbol[p.direction] : "\u2219"}
        &nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{p.mass}
        &nbsp;
    </div>;
}
