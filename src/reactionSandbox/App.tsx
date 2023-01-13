import { hgDiscDots } from "../MainScene";
import { v2, v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { css, cx } from "@emotion/css";
import { directionVector } from "../puzzle/stepInPlace";
import { IntRange_0Inc_5Inc } from "../puzzle/terms";
import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { ReagentParticle } from "./ReagentParticle";
import { ProductParticle } from "./ProductParticle";
import { ParticleText } from "./ParticleText";
import { cxy, xy1, xy2 } from "./misc";

export const directionSymbol = [
    "\u2193", // y is flipped
    "\u2199",
    "\u2196",
    "\u2191",
    "\u2197",
    "\u2198",
] as Record<IntRange_0Inc_5Inc, string>;

export type Particle = {
    direction: IntRange_0Inc_5Inc,
    velocity: 0 | 1,
    mass: number,
    color: string,
};

const particleMomentum = (p: Particle) =>
    v3.scale(directionVector[p.direction], (p.mass || 1) * p.velocity);

const particleEnegry = (p: Particle) =>
    p.mass + hg.cubeLen(particleMomentum(p));

function resolveConservation({
    reagents,
    products,
}: {
    reagents: Particle[],
    products: Particle[],
}) {
    if (products.length === 1) {

        const reagentsMomentum = reagents
            .map(particleMomentum)
            .reduce(v3.add, v3.zero());

        // reaction should not happen in case of unambiguity
        // unambiguity can originate from zero reagentsMomentum
        // or reagentsMomentum direction right between closest neighbours direction
        const isReagentsMomentumAmbiguous = ((v) =>
            (v[0] === v[1]) || (v[0] === v[2]) || (v[1] === v[2])
        )(reagentsMomentum);

        const reactionMomentumDirection = ((v) => {
            const [x, y] = hg.axialToFlatCart(v);
            const { PI } = Math;
            const a = Math.atan2(y, x) - PI / 2;
            const a1 = (a + PI * 2) % (2 * PI); // [0..2PI)
            const d = a1 / (PI * 2) * 6;
            const d1 = Math.round(d);
            return d1 as IntRange_0Inc_5Inc;
        })(reagentsMomentum);

        return {
            reagents,
            reagentsMomentum,
            reactionMomentumDirection,
            isReagentsMomentumAmbiguous,

            products,
        }
    }

    throw "not implemented";
}

export function App({

}: {
    }) {

    const reagents: Particle[] = [
        { direction: 0, velocity: 1, color: "red", mass: 1 },
        { direction: 2, velocity: 1, color: "blue", mass: 1 },
    ];
    const products: Particle[] = [
        { direction: 1, velocity: 1, color: "lime", mass: 1 },
    ];

    const {
        reagentsMomentum,
        reactionMomentumDirection,
        isReagentsMomentumAmbiguous,
    } = resolveConservation({ reagents, products });

    const productsMomentum = products
        .map(particleMomentum)
        .reduce((acc, v) => v3.add(acc, v), v3.zero());

    const reagentsEnergy = reagents
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);
    const productsEnergy = products
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    return <div className={css({ padding: 10 })}>
        <div>
            Reagents: {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            <span className={css({ opacity: 0.4 })}>&#x03A3;p</span>
            &nbsp;
            {isReagentsMomentumAmbiguous ? "~" : ""}
            {directionSymbol[reactionMomentumDirection]}
            &nbsp;
            <span className={css({ opacity: 0.4 })}>{JSON.stringify(reagentsMomentum)}</span>
            <br />
            <span className={css({ opacity: 0.4 })}>&#x03A3;E</span>
            &nbsp;
            {reagentsEnergy}
        </div>

        <br />

        <div>
            Products: {products.map((p, i) => <ParticleText key={i} particle={p} />)}
        </div>

        <br />Momentum:
        <br />products: {JSON.stringify(productsMomentum)}
        <br />diff: {JSON.stringify(v3.sub(productsMomentum, reagentsMomentum))}
        <br />Energy:
        <br />products: {JSON.stringify(productsEnergy)}
        <br />diff: {JSON.stringify(productsEnergy - reagentsEnergy)}

        <br />
        <svg viewBox="-1.5 -1.5 3 3" width={120}>
            <ArrowHeadMarker color="red" />
            <ArrowHeadMarker color="blue" />
            <ArrowHeadMarker color="lime" />
            <ArrowHeadMarker color="white" />
            {[...hgDiscDots(2)].map(pos => <circle {...cxy(pos)} r=".03" fill="white" />)}

            {reagents.map((r, i) => <ReagentParticle key={i} {...r} />)}
            {products.map((r, i) => <ProductParticle key={i} {...r} />)}
        </svg>
        <br />

        <svg viewBox="-5 -5 10 10" width={360}>
            <ArrowHeadMarker color="red" />
            <ArrowHeadMarker color="blue" />
            <ArrowHeadMarker color="lime" />
            <ArrowHeadMarker color="white" />

            {[...hgDiscDots(5)].map(pos => <circle {...cxy(pos)} r=".03" fill="white" />)}

            {reagents
                .map(r => ({
                    v: v3.scale(directionVector[r.direction], (r.mass || 1) * r.velocity),
                    particle: r,
                }))
                .map(((offset: v3) => ({ v, particle }) => {
                    const ret = { offset, v, particle };
                    offset = v3.add(offset, v);
                    return ret;
                })(v3.zero()))
                .map(({ offset, v, particle }, i) => <g key={i}>
                    <line
                        className={cx(css`& {
                        stroke-width: 0.1;
                        stroke: white;
                        marker-end: url(#arrowHeadMarker-${particle.color})
                    }`)}
                        {...xy1(offset)}
                        {...xy2(v3.add(offset, v))}
                    />
                </g>)}

            {products
                .map(r => ({
                    v: v3.scale(directionVector[r.direction], (r.mass || 1) * r.velocity),
                    particle: r,
                }))
                .map(((offset: v3) => ({ v, particle }) => {
                    const ret = { offset, v, particle };
                    offset = v3.add(offset, v);
                    return ret;
                })(v3.zero()))
                .map(({ offset, v, particle }, i) => <g key={i}>
                    <line
                        className={cx(css`& {
                        stroke-width: 0.1;
                        stroke: grey;
                        marker-end: url(#arrowHeadMarker-${particle.color})
                    }`)}
                        {...xy1(offset)}
                        {...xy2(v3.add(offset, v))}
                    />
                </g>)}
        </svg>
    </div>
}