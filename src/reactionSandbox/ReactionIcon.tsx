import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { v2 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { cxy, xy1, xy2 } from "./misc";
import * as hax from "../utils/hax";
import { particleColor } from "./ParticleText";
import { Particle } from "../puzzle/world/Particle";


const circleRadius = 0.2;

function ReagentParticle({
    color, velocity,
}: {
    color: string;
    velocity: v2;
}) {
    return <g>
        {hax.len(velocity) !== 0 && <line
            className={cx(css`& {
                stroke-width: 0.15;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v2.negate(velocity))}
            {...xy2(v2.zero())}
        />}
        <circle
            {...cxy(v2.negate(velocity))}
            r={circleRadius * 1.3}
            fill="white" />
        <circle {...cxy(v2.negate(velocity))} r={circleRadius} fill={color} />
    </g>;
}

function ProductParticle({
    color, velocity,
}: {
    color: string;
    velocity: v2;
}) {
    return <g>
        {hax.len(velocity) !== 0 && <line
            className={cx(css`& {
                stroke-width: 0.15;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v2.zero())}
            {...xy2(velocity)}
        />}
        <circle {...cxy(velocity)} r={circleRadius * 1.3} fill="white" />
        <circle {...cxy(velocity)} r={circleRadius} fill={color} />
    </g>;
}

export function ReactionIcon({
    reagents, products,
}: {
    reagents: Particle[];
    products: Particle[];
}) {
    const colors = [
        ...reagents.map(particleColor),
        ...products.map(particleColor),
    ];

    return <svg viewBox="-1.4 -1.4 2.8 2.8" width={60}>
        {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

        {[...hax.disc(2)].map((pos, i) =>
            <circle key={i} {...cxy(pos)} r=".05" fill="white" />)}

        {reagents.map((r, i) =>
            <ReagentParticle key={i} {...r} color={particleColor(r)} />)}
        {products.map((r, i) =>
            <ProductParticle key={i} {...r} color={particleColor(r)} />)}
    </svg>;
}
