import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { ParticleWithMomentumText } from "./ParticleWithMomentumText";
import { particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import * as hg from "../utils/hg";
import { ReactionIcon } from "./ReactionIcon";

export function ReactionVariant({
    reagents,
    resolvedProducts,
    deltaMomentum,
    deltaEnergy,
    className,
    ...props
}: {
    reagents: ParticleWithMomentum[];
    resolvedProducts: ParticleWithMomentum[];
    deltaMomentum: v3;
    deltaEnergy: number;
} & JSX.IntrinsicElements["div"]) {

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
            <ReactionIcon 
                reagents={reagents}
                products={resolvedProducts} />

            <div className={css({
                border: "1px solid grey",
            })}>
                {reagents.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
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
                {resolvedProducts.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
            </div>
            &nbsp;
            <div>
                ~p {JSON.stringify(deltaMomentum)}<br />
                ~p_len {hg.cubeLen(deltaMomentum)}<br />
                ~E {deltaEnergy}
            </div>
        </div>
    </div>;
}
