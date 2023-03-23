import { v2 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { cxy, xy1, xy2 } from "./misc";
import { particlesEnergy, particleMomentum, particlesMomentum } from "../puzzle/world/Particle";
import { Particle } from "../puzzle/world/Particle";
import { directionOf, directionSymbol, particleColor, ParticleText } from "./ParticleText";
import * as hax from "../utils/hax";
import { ReactionIcon } from "./ReactionIcon";


export function ReactionMomentumGraph({
    reagents,
    products,
    twins,
    ...props
}: {
    reagents: Particle[];
    products: Particle[];
    twins: Array<{ reagents: Particle[]; products: Particle[]; }>
} & JSX.IntrinsicElements["div"]) {
    const colors = [
        ...reagents.map(particleColor),
        ...products.map(particleColor),
    ];

    const reagentsMomentum = particlesMomentum(reagents);
    const reagentsEnergy = particlesEnergy(reagents);
    const productsMomentum = particlesMomentum(products);
    const productsEnergy = particlesEnergy(products);

    return <div {...props}>

        <div className={css({
            display: "flex",
            flexDirection: "row",
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
                {directionOf(productsMomentum)
                    .map((d, i) => <span key={i}>{directionSymbol[d]}</span>)}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>{
                    JSON.stringify(reagentsMomentum)
                }</span>
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
                <span className={css({ opacity: 0.4 })}>{
                    JSON.stringify(productsMomentum)
                }</span>
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
                {(hax.len(v2.sub(productsMomentum, reagentsMomentum)) !== 0)
                    && <span className={css({ color: "yellow" })}>⚠</span>}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>Δp</span>
                &nbsp;
                {hax.len(v2.sub(productsMomentum, reagentsMomentum))}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>{
                    JSON.stringify(v2.sub(productsMomentum, reagentsMomentum))
                }</span>
                <br />
                {(productsEnergy - reagentsEnergy !== 0)
                    && <span className={css({ color: "yellow" })}>⚠</span>}
                &nbsp;
                <span className={css({ opacity: 0.4 })}>ΔE</span>
                &nbsp;
                {productsEnergy - reagentsEnergy}
                &nbsp;
            </div>

        </div>

        <svg viewBox="-5 -5 10 10" width={300}>
            {colors.map((color, i) =>
                <ArrowHeadMarker key={i} color={color} />)}

            {[...hax.disc(5)].map((pos, i) =>
                <circle key={i} {...cxy(pos)} r=".03" fill="white" />)}

            {reagents
                .map(((offset: v2) => particle => {
                    const v = particleMomentum(particle);
                    const ret = { offset, v, particle };
                    offset = v2.add(offset, v);
                    return ret;
                })(v2.zero()))
                .map(({ offset, v, particle }, i) => <g key={i}>
                    <line
                        className={cx(css`& {
                        stroke-width: 0.1;
                        stroke: white;
                        marker-end: 
                            url(#arrowHeadMarker-${particleColor(particle)})
                    }`)}
                        {...xy1(offset)}
                        {...xy2(v2.add(offset, v))} />
                </g>)}

            {products
                .map(((offset: v2) => particle => {
                    const v = particleMomentum(particle);
                    const ret = { offset, v, particle };
                    offset = v2.add(offset, v);
                    return ret;
                })(v2.zero()))
                .map(({ offset, v, particle }, i) => <g key={i}>
                    <line
                        className={cx(css`& {
                        stroke-width: 0.1;
                        stroke: grey;
                        marker-end: 
                            url(#arrowHeadMarker-${particleColor(particle)})
                    }`)}
                        {...xy1(offset)}
                        {...xy2(v2.add(offset, v))} />
                </g>)}
        </svg>

        {twins.length > 0 && <div>
            Twins:
            {twins.map((t, i) => <div>
                <ReactionIcon
                    key={i}
                    reagents={t.reagents}
                    products={t.products}
                />

                <div css={{ display: "flex", flexDirection: "row" }} >
                    {t.reagents
                        .map((p, i) => <ParticleText key={i} particle={p} />)}
                    &nbsp;⇒&nbsp;
                    {t.products
                        .map((p, i) => <ParticleText key={i} particle={p} />)}
                </div>
            </div>)}
        </div>
        }
    </div>;
}
