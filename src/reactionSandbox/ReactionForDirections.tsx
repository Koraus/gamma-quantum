import { v2 } from "../utils/v";
import { css } from "@emotion/css";
import { generateReactionVariants } from "../puzzle/reactions/generateReactionVariants";
import { ReactionVariant } from "./ReactionVariant";
import { ParticleText } from "./ParticleText";
import { useState } from "react";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { particlesMomentum, particlesEnergy } from "../puzzle/world/Particle";
import { Particle } from "../puzzle/world/Particle";
import { selectReactionVariant } from "../puzzle/reactions/selectReactionVariant";

export function ReactionForDirections({
    reagents, products, setSelectedReactionVariant, showImpossibleReactions,
}: {
    reagents: Particle[];
    products: ParticleKind[];
    setSelectedReactionVariant: (x: {
        reagents: Particle[];
        products: Particle[];
        deltaMomentum: v2;
        deltaEnergy: number;
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }) => void;
    showImpossibleReactions: boolean;
}) {
    const reagentsMomentum = particlesMomentum(reagents);
    const reagentsEnergy = particlesEnergy(reagents);

    const variants = [...generateReactionVariants({ reagents, products })];

    const {
        allGrouppedVariants,
        selectedVariant,
        noVariants,
    } = selectReactionVariant({
        requestedReaction: { reagents, products },
        variants,
    });

    if (noVariants && !showImpossibleReactions) { return null; }

    const [isCollapsed, setIsCollapsed] = useState(true);

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

                        const productsMomentum = 
                            particlesMomentum(mainProducts);
                        const productsEnergy = particlesEnergy(mainProducts);

                        const deltaMomentum = v2.sub(productsMomentum, reagentsMomentum);
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
