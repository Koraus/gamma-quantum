import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { ParticleText } from "./ParticleText";
import { particleEnegry, particleMomentum, ParticleWithMomentum } from "./terms";
import * as hg from "../utils/hg";
import { ReactionIcon } from "./ReactionIcon";

export function ReactionVariant({
    reagents,
    resolvedProducts,
    deltaMomentum,
    deltaEnergy,
    className,
    twins,
    ...props
}: {
    reagents: ParticleWithMomentum[];
    resolvedProducts: ParticleWithMomentum[];
    deltaMomentum: v3;
    deltaEnergy: number;
    twins: Array<{ reagents: ParticleWithMomentum[]; resolvedProducts: ParticleWithMomentum[]; }>
} & JSX.IntrinsicElements["div"]) {
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

            <div>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            <div>&nbsp;⇒&nbsp;</div>
            <div>
                {resolvedProducts.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            &nbsp;
            <div>
                ~p {JSON.stringify(deltaMomentum)}<br />
                ~p_len {hg.cubeLen(deltaMomentum)}<br />
                ~E {deltaEnergy}<br />
                {twins.length > 0 && <span className={css({ color: "yellow" })}>⚠&nbsp;</span>}
                tw {twins.length}
            </div>
        </div>
    </div>;
}
