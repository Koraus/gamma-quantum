import { v2 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { ParticleText } from "./ParticleText";
import * as hax from "../utils/hax";
import { ReactionIcon } from "./ReactionIcon";
import { Particle } from "../puzzle/world/Particle";

export function ReactionVariant({
    reagents,
    products,
    deltaMomentum,
    deltaEnergy,
    className,
    twins,
    ...props
}: {
    reagents: Particle[];
    products: Particle[];
    deltaMomentum: v2;
    deltaEnergy: number;
    twins: Array<{ reagents: Particle[]; products: Particle[]; }>
} & JSX.IntrinsicElements["div"]) {
    return <div
        className={cx(
            css({}),
            className,
        )}
        {...props}
    >
        <div className={css({
            display: "flex",
            flexDirection: "row",
        })}>
            <ReactionIcon
                reagents={reagents}
                products={products} />

            <div>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            <div>&nbsp;⇒&nbsp;</div>
            <div>
                {products.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            &nbsp;
            <div>
                ~p {JSON.stringify(deltaMomentum)}<br />
                ~p_len {hax.len(deltaMomentum)}<br />
                ~E {deltaEnergy}<br />
                {twins.length > 0
                    && <span className={css({ color: "yellow" })}>
                        ⚠&nbsp;
                    </span>}
                tw {twins.length}
            </div>
        </div>
    </div>;
}
