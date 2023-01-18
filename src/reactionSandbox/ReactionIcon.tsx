import { hgDiscDots } from "../MainScene";
import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { ParticleWithMomentum } from "./terms";
import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { cxy, xy1, xy2 } from "./misc";
import * as hg from "../utils/hg";


const circleRadius = 0.2;

function ReagentParticle({
    color, velocity,
}: {
    color: string;
    velocity: v3;
}) {
    return <g>
        {hg.cubeLen(velocity) !== 0 && <line
            className={cx(css`& {
                stroke-width: 0.15;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v3.negate(velocity))}
            {...xy2(v3.zero())}
        />}
        <circle {...cxy(v3.negate(velocity))} r={circleRadius * 1.3} fill="white" />
        <circle {...cxy(v3.negate(velocity))} r={circleRadius} fill={color} />
    </g>;
}

function ProductParticle({
    color, velocity,
}: {
    color: string;
    velocity: v3;
}) {
    return <g>
        {hg.cubeLen(velocity) !== 0 && <line
            className={cx(css`& {
                stroke-width: 0.15;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v3.zero())}
            {...xy2(velocity)}
        />}
        <circle {...cxy(velocity)} r={circleRadius * 1.3} fill="white" />
        <circle {...cxy(velocity)} r={circleRadius} fill={color} />
    </g>;
}

export function ReactionIcon({
    reagents, products,
}: {
    reagents: ParticleWithMomentum[];
    products: ParticleWithMomentum[];
}) {
    const colors = [
        ...reagents.map(p => p.color),
        ...products.map(p => p.color),
    ];

    return <svg viewBox="-1.4 -1.4 2.8 2.8" width={60}>
        {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

        {[...hgDiscDots(2)].map((pos, i) => <circle key={i} {...cxy(pos)} r=".05" fill="white" />)}

        {reagents.map((r, i) => <ReagentParticle key={i} {...r} />)}
        {products.map((r, i) => <ProductParticle key={i} {...r} />)}
    </svg>;
}
