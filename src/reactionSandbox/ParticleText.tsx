import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { directionSymbol } from "./misc";
import * as hg from "../utils/hg";
import { directionOf } from "./resolveReaction";

export function ParticleText({
    particle: p
}: {
    particle: Particle | ParticleWithMomentum;
}) {
    const velocitySymbol =
        ("velocity" in p)
            ? (hg.cubeLen(p.velocity) > 0)
                ? directionSymbol[directionOf(p.velocity)[0]]
                : "\u2219"
            : "?";
    return <div className={css({
        border: `2px solid ${p.color}`,
        padding: "1px 2px",
        borderRadius: 6,
        margin: "0px 2px",
        color: p.color,
    })}>
        {velocitySymbol}
        &nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{p.mass}
    </div>;
}
