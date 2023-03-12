import { ParticleText } from "./ParticleText";
import { ReactionIcon } from "./ReactionIcon";
import { Particle } from "../puzzle/world/Particle";

export function ReactionVariant({
    reagents,
    products,
    twins,
    ...props
}: {
    reagents: Particle[];
    products: Particle[];
    twins: Array<{ reagents: Particle[]; products: Particle[]; }>
} & JSX.IntrinsicElements["div"]) {
    return <div
        {...props}
    >
        <div css={{
            display: "flex",
            flexDirection: "row",
        }}>
            <ReactionIcon reagents={reagents} products={products} />
            <div>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>
            <div>&nbsp;⇒&nbsp;</div>
            <div>
                {products.map((p, i) => <ParticleText key={i} particle={p} />)}
            </div>

            <div css={{ border: "1px solid grey" }}></div>
            <div>
                {twins.map((t, i) => <ReactionIcon
                    key={i}
                    reagents={t.reagents}
                    products={t.products} />)}
            </div>
        </div>
    </div>;
}
