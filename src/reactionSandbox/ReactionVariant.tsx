import { hgDiscDots } from "../MainScene";
import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { directionVector } from "../puzzle/stepInPlace";
import { DirectionId } from "../puzzle/terms";
import { ArrowHeadMarker } from "./ArrowHeadMarker";
import { ReagentParticle } from "./ReagentParticle";
import { ProductParticle } from "./ProductParticle";
import { ParticleText } from "./ParticleText";
import { cxy, directionSymbol, xy1, xy2 } from "./misc";
import { particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import * as hg from "../utils/hg";

export function ReactionVariant({
    reagents,
    resolvedProducts,
    reactionMomentumDirection,
    isReagentsMomentumAmbiguous,
    className,
    ...props
}: {
    reagents: ParticleWithMomentum[];
    resolvedProducts: ParticleWithMomentum[];
    reactionMomentumDirection: DirectionId;
    isReagentsMomentumAmbiguous: boolean;
} & JSX.IntrinsicElements["div"]) {
    const colors = [
        ...reagents.map(p => p.color),
        ...resolvedProducts.map(p => p.color),
    ];

    const reagentsMomentum = reagents
        .map(particleMomentum)
        .reduce((acc, v) => v3.add(acc, v), v3.zero());

    const reagentsEnergy = reagents
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    const productsMomentum = resolvedProducts
        .map(particleMomentum)
        .reduce((acc, v) => v3.add(acc, v), v3.zero());

    const productsEnergy = resolvedProducts
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    const notConservative =
        (hg.cubeLen(v3.sub(productsMomentum, reagentsMomentum)) !== 0)
        || (productsEnergy - reagentsEnergy !== 0);

    return <div
        className={cx(
            css({}),
            className
        )}
        {...props}
    >
        <div className={css({
            display: "flex",
            flexDirection: "row"
        })}>
            <svg viewBox="-1.3 -1.3 2.6 2.6" width={70}>
                {colors.map((color, i) => <ArrowHeadMarker key={i} color={color} />)}

                {[...hgDiscDots(2)].map((pos, i) => <circle key={i} {...cxy(pos)} r=".03" fill="white" />)}

                {reagents.map((r, i) => <ReagentParticle key={i} {...r} />)}
                {resolvedProducts.map((r, i) => <ProductParticle key={i} {...r} />)}
            </svg>

            <div className={css({
                border: "1px solid grey",
            })}>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            <div>
                &nbsp;⇒&nbsp;
                {notConservative && <>
                    <br />&nbsp;
                    <span className={css({ color: "yellow" })}>⚠</span>
                    &nbsp;
                </>}

            </div>
            <div className={css({
                border: "1px solid grey",
            })}>
                {resolvedProducts.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
        </div>
    </div>;
}
