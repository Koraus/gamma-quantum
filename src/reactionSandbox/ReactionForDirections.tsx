import { v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { resolveReaction } from "./resolveReaction";
import { ReactionVariant } from "./ReactionVariant";
import { ParticleWithMomentumText } from "./ParticleWithMomentumText";
import { ParticleText } from "./ParticleText";
import _ from "lodash";
import { useState } from "react";


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
    }) => void;
}) {

    const variants = [...resolveReaction({ reagents, products })];
    // variants.sort((var1, var2) => hg.cubeLen(var1.deltaMomentum) - hg.cubeLen(var2.deltaMomentum))
    const grouppedVariants = Object.entries(_.groupBy(variants, vr => -100 * vr.deltaEnergy
        + hg.cubeLen(vr.deltaMomentum)));
    grouppedVariants.sort((g1, g2) => +g1[0] - +g2[0]);

    const selectedVariant = grouppedVariants[0]?.[1].length === 1
        ? grouppedVariants[0][1][0]
        : undefined;

    const isResolved = (variants.length === 0)
        || !!selectedVariant;

    const [isCollapsed, setIsCollapsed] = useState(isResolved);

    const header = (() => {
        if (selectedVariant) {
            return <>
                {reagents.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
                &nbsp;⇒&nbsp;
                {selectedVariant.resolvedProducts.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
            </>
        }

        if (variants.length === 0) {
            return <>
                {reagents.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
                &nbsp;<span className={css({ color: "crimson" })}>⇏</span>&nbsp;
                {products.map((p, i) => <ParticleText key={i} particle={p} />)}
            </>
        }

        return <>
            <span className={css({ color: "yellow" })}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleWithMomentumText key={i} particle={p} />)}
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
                {variants.map(({
                    resolvedProducts, deltaEnergy, deltaMomentum
                }, i) => <div
                    key={i}
                    className={css({
                        display: "flex",
                        flexDirection: "row",
                    })}
                >
                        <ReactionVariant
                            className={css({
                                border: "1px solid",
                                borderColor: "#ffffff30",
                            })}
                            reagents={reagents}
                            resolvedProducts={resolvedProducts}
                            deltaEnergy={deltaEnergy}
                            deltaMomentum={deltaMomentum} />
                        <button
                            onClick={() => setSelectedReactionVariant({
                                reagents: reagents,
                                products: resolvedProducts,
                                deltaEnergy,
                                deltaMomentum,
                            })}
                        >&gt;</button>
                    </div>)}
            </div>)}

            <br />
        </>}
    </div>;
}
