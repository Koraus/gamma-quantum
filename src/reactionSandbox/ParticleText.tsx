import { css } from "@emotion/css";
import * as hax from "../utils/hax";
import { v2 } from "../utils/v";

import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle, particleMass } from "../puzzle/world/Particle";
import { DirectionId } from "../puzzle/world/direction";

export const particleColor = (p: ParticleKind) => {
    if (p.content === "gamma") { return "white"; }
    if (!Array.isArray(p.content)) { return "red"; }
    if (p.content.length === 2) { return "lime"; }
    if (p.content.length === 3) { return "purple"; }
    if (p.content.length === 4) { return "orange"; }
    throw "unexpected particle content";
};

export function directionOf(h: v2) {
    const [x, y] = hax.toFlatCart(h);
    const { PI } = Math;
    const a = Math.atan2(y, x) - PI / 2;
    const a1 = (a + PI * 2) % (2 * PI); // [0..2PI)
    const d = a1 / (PI * 2) * 6;

    const isAmbiguous = ((h) =>
        (hax.q(h) === hax.r(h)) 
        || (hax.q(h) === hax.s(h)) 
        || (hax.r(h) === hax.s(h))
    )(h);

    return (isAmbiguous
        ? [Math.floor(d), Math.ceil(d) % 6]
        : [Math.round(d) % 6]
    ) as DirectionId[];
}

export const directionSymbol = [
    "\u2193", // y is flipped
    "\u2199",
    "\u2196",
    "\u2191",
    "\u2197",
    "\u2198",
] as Record<DirectionId, string>;

export const directionSymbolFor = (h: v2) =>
    (hax.len(h) > 0)
        ? directionSymbol[directionOf(h)[0]]
        : "\u2219";

export function ParticleText({
    particle: p,
}: {
    particle: ParticleKind | Particle;
}) {
    const velocitySymbol =
        ("velocity" in p)
            ? directionSymbolFor(p.velocity)
            : "?";
    return <div className={css({
        border: `2px solid ${particleColor(p)}`,
        padding: "1px 2px",
        borderRadius: 6,
        margin: "0px 2px",
        color: particleColor(p),
    })}>
        {velocitySymbol}
        &nbsp;
        <span className={css({ opacity: 0.3 })}>m</span>{particleMass(p)}
    </div>;
}
