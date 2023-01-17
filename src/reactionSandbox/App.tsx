import { v2 } from "../utils/v";
import * as hg from "../utils/hg";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { resolveReaction } from "./resolveConservation";
import { ReactionVariant } from "./ReactionVariant";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { DirectionId } from "../puzzle/terms";

export function App({

}: {
    }) {
        const reactions = [

            // m1 + m1 = m1
            ...[
                { direction: 0, velocity: 0 },
                { direction: 0, velocity: 1 },
                { direction: 1, velocity: 1 },
                { direction: 2, velocity: 1 },
                { direction: 3, velocity: 1 },
            ].map(v => ({
                reagents: [
                    { direction: 0, velocity: 1, color: "red", mass: 1 },
                    { ...v, color: "blue", mass: 1 },
                ],
                products: [
                    { color: "lime", mass: 1 },
                ]
            })),

            // m1 + m1 = m2
            ...[
                { direction: 0, velocity: 0 },
                { direction: 0, velocity: 1 },
                { direction: 1, velocity: 1 },
                { direction: 2, velocity: 1 },
                { direction: 3, velocity: 1 },
            ].map(v => ({
                reagents: [
                    { direction: 0, velocity: 1, color: "red", mass: 1 },
                    { ...v, color: "lime", mass: 1 },
                ],
                products: [
                    { color: "yellow", mass: 2 },
                ]
            })),
        ] as Array<{
            reagents: ParticleWithMomentum[];
            products: Particle[];
        }>;

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        reactionMomentumDirection: DirectionId;
        isReagentsMomentumAmbiguous: boolean;
    }>();

    return <div className={css({
        padding: 10,
        fontFamily: "monospace",
        position: "fixed",
        inset: 0,
    })}>
        <div className={css({
            display: "flex",
            flexDirection: "row",
            height: "100%",
        })}>
            <div className={css({
                overflow: "scroll",
                flexShrink: 0,
                height: "100%",
            })}>
                {reactions.map((reaction, i) => <div key={i}>
                    {[...resolveReaction({
                        reagents: reaction.reagents,
                        products: reaction.products,
                        helperDiraction: hg.axialToCube(v2.zero())
                    })].map(({
                        reactionMomentumDirection,
                        isReagentsMomentumAmbiguous,
                        resolvedProducts,
                    }, i) => <div
                        key={i}
                        className={css({
                            display: "flex",
                            flexDirection: "row",
                        })}
                    >
                            <ReactionVariant
                                className={css({ border: "1px solid #ffffff30" })}
                                reagents={reaction.reagents}
                                resolvedProducts={resolvedProducts}
                                isReagentsMomentumAmbiguous={isReagentsMomentumAmbiguous}
                                reactionMomentumDirection={reactionMomentumDirection}
                            />
                            <button
                                onClick={() => setSelectedReaction({
                                    reagents: reaction.reagents,
                                    products: resolvedProducts,
                                    isReagentsMomentumAmbiguous,
                                    reactionMomentumDirection,
                                })}
                            >&gt;</button>
                        </div>)}
                    =============
                </div>)}
            </div>
            {selectedReaction &&
                <ReactionMomentumGraph
                    className={css({
                        flex: 1,
                    })}
                    reagents={selectedReaction.reagents}
                    products={selectedReaction.products}
                    isReagentsMomentumAmbiguous={selectedReaction.isReagentsMomentumAmbiguous}
                    reactionMomentumDirection={selectedReaction.reactionMomentumDirection}
                />}
        </div>
    </div >
}