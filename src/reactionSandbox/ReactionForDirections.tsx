import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { resolveReaction } from "./resolveReaction";
import { ReactionVariant } from "./ReactionVariant";
import { ParticleText } from "./ParticleText";
import _ from "lodash";
import { useState } from "react";
import { tuple } from "../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";


export function ReactionForDirections({
    reagents, products: requestedProducts, setSelectedReactionVariant,
}: {
    reagents: ParticleWithMomentum[];
    products: Particle[];
    setSelectedReactionVariant: (x: {
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: ParticleWithMomentum[]; products: ParticleWithMomentum[]; }>
    }) => void;
}) {

    const variants = [...resolveReaction({ reagents, products: requestedProducts })];

    const allGrouppedVariants = Object.entries(_.groupBy(variants, vr => -100 * vr.deltaEnergy + hg.cubeLen(vr.deltaMomentum)))
        .map(([k, v]) => tuple(k, groupReactionVariantsBySymmetries(v)));

    allGrouppedVariants.sort((g1, g2) => +g1[0] - +g2[0]);

    const filteredGrouppedVariants = allGrouppedVariants
        .map(([k, v]) => tuple(k, v.filter(v => v.length === 1)))
        .filter(([, v]) => v.length > 0);

    const selectedVariant = filteredGrouppedVariants[0]?.[1].length === 1
        ? filteredGrouppedVariants[0][1][0][0]
        : undefined;

    const noVariants = filteredGrouppedVariants.length === 0;

    const isResolved = noVariants || !!selectedVariant;

    const [isCollapsed, setIsCollapsed] = useState(isResolved);

    const header = (() => {
        if (selectedVariant) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;⇒&nbsp;
                {selectedVariant.products.map((p, i) => <ParticleText key={i} particle={p} />)}
            </>
        }

        if (noVariants) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;<span className={css({ color: "crimson" })}>⇏</span>&nbsp;
                {requestedProducts.length > 0
                    ? requestedProducts.map((p, i) => <ParticleText key={i} particle={p} />)
                    : <ParticleText particle={{color: "white", mass: 0}} />
                }
            </>
        }

        return <>
            <span className={css({ color: "yellow" })}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            &nbsp;⇒&nbsp;
            {requestedProducts.length > 0
                ? requestedProducts.map((p, i) => <ParticleText key={i} particle={p} />)
                : <ParticleText particle={{color: "white", mass: 0}} />
            }
        </>
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
                            products, deltaEnergy, deltaMomentum
                        } = variant;
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
