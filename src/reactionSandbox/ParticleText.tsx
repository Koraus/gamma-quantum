import { css } from "@emotion/css";
import { Particle } from "./terms";
import { directionSymbol } from "./misc";

export function ParticleText({ particle: p }: { particle: Particle; }) {
    return <div>
        &nbsp;
        <span className={css({ color: p.color })}>@</span>
        &nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{p.mass}
        &nbsp;
    </div>;
}
