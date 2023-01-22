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
import { directionOf } from "./resolveReaction";
import { ReactionIcon } from "./ReactionIcon";


export function ReactionMomentumGraph({
    reagents,
    products,
    deltaMomentum,
    deltaEnergy,
    twins,
    ...props
}: {
    reagents: ParticleWithMomentum[];
    products: ParticleWithMomentum[];
    deltaMomentum: v3;
    deltaEnergy: number;
    twins: Array<{ reagents: ParticleWithMomentum[]; products: ParticleWithMomentum[]; }>
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
            <ReactionIcon reagents={reagents} products={products} />

            <div className={css({
                border: "1px solid grey",
            })}>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                <br />
                &nbsp;
                <span className={css({ opacity: 0.4 })}>Σp</span>
                &nbsp;
                {directionOf(productsMomentum).map((d, i) => <span key={i}>{directionSymbol[d]}</span>)}
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

        {twins.length > 0 && <div>
            Twins:
            {twins.map((t, i) => <ReactionIcon
                key={i}
                reagents={t.reagents}
                products={t.products}
            />)}
        </div>
        }

        <svg viewBox="-5 -5 10 10" width={300}>
            {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

            {[...hgDiscDots(5)].map((pos, i) => <circle key={i} {...cxy(pos)} r=".03" fill="white" />)}

            {reagents
                .map(((offset: v3) => particle => {
                    const v = particleMomentum(particle);
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
                .map(((offset: v3) => particle => {
                    const v = particleMomentum(particle);
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
