import { v2 } from "../utils/v";
import * as hg from "../utils/hg";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { resolveConservation } from "./resolveConservation";
import { ReactionVariant } from "./ReactionVariant";

export function App({

}: {
    }) {

    const reagents: ParticleWithMomentum[][] = [[
        { direction: 0, velocity: 1, color: "red", mass: 1 },
        { direction: 0, velocity: 1, color: "blue", mass: 1 },
    ], [
        { direction: 0, velocity: 1, color: "red", mass: 1 },
        { direction: 1, velocity: 1, color: "blue", mass: 1 },
    ], [
        { direction: 0, velocity: 1, color: "red", mass: 1 },
        { direction: 2, velocity: 1, color: "blue", mass: 1 },
    ], [
        { direction: 0, velocity: 1, color: "red", mass: 1 },
        { direction: 0, velocity: 0, color: "blue", mass: 1 },
    ]];
    const products: Particle[] = [
        { color: "lime", mass: 1 },
    ];

    return <div className={css({
        padding: 10,
        fontFamily: "monospace",
    })}>
        {reagents.map((reagents, i) => <div key={i}>
            {[...resolveConservation({
                reagents,
                products,
                helperDiraction: hg.axialToCube(v2.zero())
            })].map(({
                reactionMomentumDirection,
                isReagentsMomentumAmbiguous,
                resolvedProducts,
            }, i) => <ReactionVariant
                    key={i}
                    className={css({ border: "1px solid white" })}
                    reagents={reagents}
                    resolvedProducts={resolvedProducts}
                    isReagentsMomentumAmbiguous={isReagentsMomentumAmbiguous}
                    reactionMomentumDirection={reactionMomentumDirection}
                />)}
            =============
        </div>)}


    </div >
}