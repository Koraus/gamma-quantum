import { hgDiscDots } from "../MainScene";
import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { directionVector } from "../puzzle/stepInPlace";
import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { cxy, directionSymbol, xy1, xy2 } from "./misc";
import { particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import { DirectionId } from "../puzzle/terms";
import { ParticleText } from "./ParticleText";
import * as hg from "../utils/hg";
import { ReagentParticle } from "./ReagentParticle";
import { ProductParticle } from "./ProductParticle";


export function ReactionMomentumGraph({
    reagents,
    products,
    reactionMomentumDirection,
    isReagentsMomentumAmbiguous,
    ...props
}: {
    reagents: ParticleWithMomentum[];
    products: ParticleWithMomentum[];
    reactionMomentumDirection: DirectionId;
    isReagentsMomentumAmbiguous: boolean;
} & JSX.IntrinsicElements["div"]) {
    const colors = [
        ...reagents.map(p => p.color),
        ...products.map(p => p.color),
    ];

    const reagentsMomentum = reagents
        .map(particleMomentum)
        .reduce((acc, v) => v3.add(acc, v), v3.zero());

    const reagentsEnergy = reagents
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    const productsMomentum = products
        .map(particleMomentum)
        .reduce((acc, v) => v3.add(acc, v), v3.zero());

    const productsEnergy = products
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    return <div {...props}>

        <div className={css({
            display: "flex",
            flexDirection: "row"
        })}>
            <svg viewBox="-1.3 -1.3 2.6 2.6" width={70}>
                {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

                {[...hgDiscDots(2)].map((pos, i) => <circle key={i} {...cxy(pos)} r=".03" fill="white" />)}

                {reagents.map((r, i) => <ReagentParticle key={i} {...r} />)}
                {products.map((r, i) => <ProductParticle key={i} {...r} />)}
            </svg>

            <div className={css({
                border: "1px solid grey",
            })}>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                <br />
                &nbsp;
                <span className={css({ opacity: 0.4 })}>Σp</span>
                &nbsp;
                {isReagentsMomentumAmbiguous ? "~" : ""}
                {directionSymbol[reactionMomentumDirection]}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>{JSON.stringify(reagentsMomentum)}</span>
                &nbsp;
                <br />
                &nbsp;
                <span className={css({ opacity: 0.4 })}>ΣE</span>
                &nbsp;
                {reagentsEnergy}
                &nbsp;
            </div>
            <div>&nbsp;⇒&nbsp;</div>
            <div className={css({
                border: "1px solid grey",
            })}>
                {products.map((p, i) => <ParticleText key={i} particle={p} />)}
                <br />
                &nbsp;
                <span className={css({ opacity: 0.4 })}>Σp</span>
                &nbsp;
                <span className={css({ opacity: 0.4 })}>{JSON.stringify(productsMomentum)}</span>
                &nbsp;
                <br />
                &nbsp;
                <span className={css({ opacity: 0.4 })}>ΣE</span>
                &nbsp;
                {productsEnergy}
                &nbsp;

            </div>

            <div>&nbsp;</div>

            <div>
                {(hg.cubeLen(v3.sub(productsMomentum, reagentsMomentum)) !== 0) && <span className={css({ color: "yellow" })}>⚠</span>}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>Δp</span>
                &nbsp;
                {hg.cubeLen(v3.sub(productsMomentum, reagentsMomentum))}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>{JSON.stringify(v3.sub(productsMomentum, reagentsMomentum))}</span>
                <br />
                {(productsEnergy - reagentsEnergy !== 0) && <span className={css({ color: "yellow" })}>⚠</span>}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>ΔE</span>
                &nbsp;
                {productsEnergy - reagentsEnergy}
                &nbsp;
            </div>

        </div>

        <svg viewBox="-5 -5 10 10">
            {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

            {[...hgDiscDots(5)].map((pos, i) => <circle key={i} {...cxy(pos)} r=".03" fill="white" />)}

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
                        {...xy2(v3.add(offset, v))} />
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
                        {...xy2(v3.add(offset, v))} />
                </g>)}
        </svg>
    </div>;
}
