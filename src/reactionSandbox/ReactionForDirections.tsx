import { v3 } from "../utils/v";
import { css } from "@emotion/css";
import { generateReactionVariants } from "../puzzle/generateReactionVariants";
import { ReactionVariant } from "./ReactionVariant";
import { ParticleText } from "./ParticleText";
import { useState } from "react";
import { ParticleKind, particleMomentum, particleEnegry } from "../puzzle/Particle";
import { Particle } from "../puzzle/Particle";
import { selectReactionVariant } from "../puzzle/selectReactionVariant";

export function ReactionForDirections({
    reagents, products, setSelectedReactionVariant,
}: {
    reagents: Particle[];
    products: ParticleKind[];
    setSelectedReactionVariant: (x: {
        reagents: Particle[];
        products: Particle[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }) => void;
}) {
    const reagentsMomentum = reagents
        .map(particleMomentum)
        .reduce(v3.add, v3.zero());
    const reagentsEnergy = reagents
        .map(particleEnegry)
        .reduce((acc, v) => acc + v, 0);

    const variants = [...generateReactionVariants({ reagents, products })];

    const {
        allGrouppedVariants,
        selectedVariant,
        noVariants,
        isResolved,
    } = selectReactionVariant({
        requestedReaction: { reagents, products },
        variants,
    });

    const [isCollapsed, setIsCollapsed] = useState(isResolved);

    const header = (() => {
        if (selectedVariant) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;⇒&nbsp;
                {selectedVariant.products.map((p, i) =>
                    <ParticleText key={i} particle={p} />)}
            </>;
        }

        if (noVariants) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;<span className={css({ color: "crimson" })}>⇏</span>&nbsp;
                {products.length > 0
                    ? products.map((p, i) =>
                        <ParticleText key={i} particle={p} />)
                    : <ParticleText particle={{ content: "gamma" }} />
                }
            </>;
        }

        return <>
            <span className={css({ color: "yellow" })}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            &nbsp;⇒&nbsp;
            {products.length > 0
                ? products.map((p, i) => <ParticleText key={i} particle={p} />)
                : <ParticleText particle={{ content: "gamma" }} />
            }
        </>;
    })();

    return <div>
        <br />
        <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={css({ display: "flex", flexDirection: "row" })}
        >
            <button>{isCollapsed ? ">" : "⌄"}</button>
            &nbsp;
            {header}
        </div>
        {!isCollapsed && <>
            <br />
            {allGrouppedVariants.map(([key, variants], i) => <div key={i}>
                # priority group ~-E ~p_len= {key}
                {variants.map((symGroup, i) => <div key={i}>
                    ## sym group, size {symGroup.length}
                    {symGroup.map((variant, i) => {
                        const {
                            products,
                        } = variant;
                        const mainProducts = products.slice(0, products.length);

                        const productsMomentum = mainProducts
                            .map(particleMomentum)
                            .reduce(v3.add, v3.zero());
                        const productsEnergy = mainProducts
                            .map(particleEnegry)
                            .reduce((acc, v) => acc + v, 0);

                        const deltaMomentum = v3.sub(productsMomentum, reagentsMomentum);
                        const deltaEnergy = productsEnergy - reagentsEnergy;

                        const twins = symGroup.filter(v => v !== variant);
                        return <div
                            key={i}
                            className={css({
                                display: "flex",
                                flexDirection: "row",
                            })}
                        >
                            <ReactionVariant
                                className={css({
                                    border: "1px solid",
                                    borderColor:
                                        variant === selectedVariant
                                            ? "#ffffff"
                                            : "#ffffff30",
                                })}
                                reagents={reagents}
                                products={products}
                                deltaEnergy={deltaEnergy}
                                deltaMomentum={deltaMomentum}
                                twins={twins} />
                            <button
                                onClick={() => setSelectedReactionVariant({
                                    reagents: reagents,
                                    products: products,
                                    deltaEnergy,
                                    deltaMomentum,
                                    twins,
                                })}
                            >&gt;</button>
                        </div>;
                    })}
                </div>)}
            </div>)}

            <br />
        </>}
    </div>;
}
