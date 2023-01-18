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

const ms = tuple(
    ([q, r, s]: v3) => [-q, -s, -r] as v3,
    ([q, r, s]: v3) => [s, r, q] as v3,
    ([q, r, s]: v3) => [-s, -r, -q] as v3,
    ([q, r, s]: v3) => [r, q, s] as v3,
    ([q, r, s]: v3) => [-r, -q, -s] as v3,
    ([q, r, s]: v3) => [q, s, r] as v3,
);

const areInvariant = (
    variant1: ParticleWithMomentum[],
    variant2: ParticleWithMomentum[],
) => {
    const pt = (p: ParticleWithMomentum) =>
        JSON.stringify({ mass: p.mass, velocity: p.velocity });
    return JSON.stringify(variant1.map(pt).sort())
        === JSON.stringify(variant2.map(pt).sort());
}

export function ReactionForDirections({
    reagents, products, setSelectedReactionVariant,
}: {
    reagents: ParticleWithMomentum[];
    products: Particle[];
    setSelectedReactionVariant: (x: {
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: ParticleWithMomentum[]; resolvedProducts: ParticleWithMomentum[]; }>
    }) => void;
}) {

    const variants = [...resolveReaction({ reagents, products })];

    const variants1 = variants.map(variant => {
        const twins = ms.flatMap(m => {
            const mirroredVariant = {
                reagents: variant.reagents.map(p => ({ ...p, velocity: m(p.velocity) })),
                resolvedProducts: variant.resolvedProducts.map(p => ({ ...p, velocity: m(p.velocity) })),
            }
            return variants.filter(var2 => {
                if (var2 === variant) { return false; }
                return areInvariant(mirroredVariant.reagents, var2.reagents)
                    && areInvariant(mirroredVariant.resolvedProducts, var2.resolvedProducts);
            })
        });
        return ({
            ...variant,
            twins,
        });
    })

    const grouppedVariants = Object.entries(_.groupBy(variants1, vr => -100 * vr.deltaEnergy
        + hg.cubeLen(vr.deltaMomentum)));
    grouppedVariants.sort((g1, g2) => +g1[0] - +g2[0]);

    const variants2 = variants1.filter(v => v.twins.length === 0);

    const grouppedVariants2 = Object.entries(_.groupBy(variants2, vr => -100 * vr.deltaEnergy
        + hg.cubeLen(vr.deltaMomentum)));
    grouppedVariants2.sort((g1, g2) => +g1[0] - +g2[0]);

    const selectedVariant = grouppedVariants2[0]?.[1].length === 1
        ? grouppedVariants2[0][1][0]
        : undefined;

    const noVariants = (variants2.length === 0);

    const isResolved = noVariants || !!selectedVariant;

    const [isCollapsed, setIsCollapsed] = useState(isResolved);

    const header = (() => {
        if (selectedVariant) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;⇒&nbsp;
                {selectedVariant.resolvedProducts.map((p, i) => <ParticleText key={i} particle={p} />)}
            </>
        }

        if (noVariants) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;<span className={css({ color: "crimson" })}>⇏</span>&nbsp;
                {products.map((p, i) => <ParticleText key={i} particle={p} />)}
            </>
        }

        return <>
            <span className={css({ color: "yellow" })}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            &nbsp;⇒&nbsp;
            {products.map((p, i) => <ParticleText key={i} particle={p} />)}
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
            {grouppedVariants.map(([key, variants], i) => <div key={i}>
                ~-E ~p_len= {key}
                {variants.map((variant, i) => {
                    const {
                        resolvedProducts, deltaEnergy, deltaMomentum, twins
                    } = variant;
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
                            resolvedProducts={resolvedProducts}
                            deltaEnergy={deltaEnergy}
                            deltaMomentum={deltaMomentum}
                            twins={twins} />
                        <button
                            onClick={() => setSelectedReactionVariant({
                                reagents: reagents,
                                products: resolvedProducts,
                                deltaEnergy,
                                deltaMomentum,
                                twins,
                            })}
                        >&gt;</button>
                    </div>;
                })}
            </div>)}

            <br />
        </>}
    </div>;
}
