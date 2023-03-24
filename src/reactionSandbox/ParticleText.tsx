import { css } from "@emotion/css";
import * as hax from "../utils/hax";
import { v2 } from "../utils/v";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle, particleCount, particleMass } from "../puzzle/world/Particle";
import { DirectionId } from "../puzzle/world/direction";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { enumerateSubparticles } from "../puzzle/reactions/enumerateProductCombinations";

export const particleColor = (p: ParticleKind) => {
    if (p.content === "gamma") { return "white"; }
    const c = particleCount(p);
    if (c === 1) { return "#ff4040"; }
    if (c === 2) { return "#40FF40"; }
    if (c === 3) { return "#ff40ff"; }
    if (c === 4) { return "#ffff40"; }
    return "grey";
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
    css: cssProp,
    ...props
}: {
    particle: ParticleKind | Particle;
} & EmotionJSX.IntrinsicElements["div"]) {
    const velocitySymbol =
        ("velocity" in p)
            ? directionSymbolFor(p.velocity)
            : "?";
    return <div
        css={[{
            border: `1px solid ${particleColor(p)}`,
            padding: "1px 2px",
            borderRadius: 3,
            margin: "0px 3px",
            color: particleColor(p),
            minWidth: "1.2em",
            textAlign: "center",
        }, cssProp]}
        {...props}
    > {p.content === "gamma"
        ? <>{velocitySymbol}</>
        : <>{[...enumerateSubparticles(p)]
            .map(s => s === "gamma" ? "γ" : s[0])
            .sort()
            .join("")}
            &nbsp;
            {velocitySymbol}
            <span className={css({ opacity: 0.5 })}>{particleMass(p)}</span></>

        }</div>;
}
