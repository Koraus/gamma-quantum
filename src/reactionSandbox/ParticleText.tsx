import { css } from "@emotion/css";
import { Particle, directionSymbol } from "./App";

export function ParticleText({ particle: p }: { particle: Particle; }) {
    return <div>
        <span className={css({ color: p.color })}>@</span>
        &nbsp;
        {p.velocity > 0 ? directionSymbol[p.direction] : " \u2219 "}
        &nbsp;
        <span className={css({ opacity: 0.4 })}>m=</span>{p.mass}
        &nbsp;
        <span className={css({ opacity: 0.4 })}>v=</span>{p.velocity}
    </div>;
}
