import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { v2 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { cxy, xy1, xy2 } from "./misc";
import * as hax from "../utils/hax";
import { particleColor } from "./ParticleText";
import { Particle } from "../puzzle/world/Particle";


const circleRadius = 0.18;

function ReagentParticle({
    color, velocity,
}: {
    color: string;
    velocity: v2;
}) {
    return <g>
        {hax.len(velocity) !== 0 && <line
            className={cx(css`& {
                stroke-width: 0.1;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v2.negate(velocity))}
            {...xy2(v2.scale(velocity, -0.4))}
        />}
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
                stroke-width: 0.1;
                stroke: ${color};
                marker-end: url(#arrowHeadMarker-${color})
            }`)}
            {...xy1(v2.scale(velocity, 1.2))}
            {...xy2(v2.scale(velocity, 1.6))}
        />}
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

    const w = 3.5;
    return <svg
        css={{
            border: "1px solid #ffffff10",
        }}
        viewBox={`${-w / 2} ${-w / 2} ${w * 2.2} ${w}`}
        width={150}
    >

        {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

        <g>
            {[...hax.disc(2)].map((pos, i) =>
                <circle key={i} {...cxy(pos)} r=".02" fill="white" />)}
            {reagents.map((r, i) =>
                <ReagentParticle key={i} {...r} color={particleColor(r)} />)}
        </g>

        <text
            fill="white"
            fontSize={w / 5}
            x={w * 0.45}
            y={w * 0.05}
        >⇒</text>

        <g transform={`translate(${w * 1.1},0)`}>
            {[...hax.disc(2)].map((pos, i) =>
                <circle key={i} {...cxy(pos)} r=".02" fill="white" />)}
            {products.map((r, i) =>
                <ProductParticle key={i} {...r} color={particleColor(r)} />)}
        </g>


    </svg>;
}
