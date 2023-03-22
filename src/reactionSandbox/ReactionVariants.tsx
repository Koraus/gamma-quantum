import { css } from "@emotion/css";
import { useState } from "react";
import { ReactionForDirections } from "./ReactionForDirections";
import { groupReactionVariantsBySymmetries } from "../puzzle/reactions/groupReactionVariantsBySymmetries";
import * as hax from "../utils/hax";
import { particles } from "./reactions";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle, particleMass } from "../puzzle/world/Particle";
import { tuple } from "../utils/tuple";
import { ResolvedReaction } from "../puzzle/reactions/Reaction";
import { v2 } from "../utils/v";

export const velocityVariants = [
    v2.zero(),
    ...hax.direction.flat60.itCwFromSouth,
];

function* enumerateReagentRequests(
    reagents: (ParticleKind | Particle)[],
): Generator<Particle[]> {
    if (reagents.length === 0) {
        yield [];
        return;
    }
    const [head, ...tail] = reagents;
    if ("velocity" in head) {
        for (const x of enumerateReagentRequests(tail)) {
            yield [head, ...x];
        }
    } else {
        for (const v of velocityVariants) {
            if (hax.len(v) === 0 && particleMass(head) === 0) {
                continue;
            }
            for (const x of enumerateReagentRequests(tail)) {
                yield [
                    { velocity: tuple(...v), ...head },
                    ...x,
                ];
            }
        }
    }
}

const prepareReactionRequests = (reagents: (ParticleKind | Particle)[]) =>
    groupReactionVariantsBySymmetries([...(
        enumerateReagentRequests([
            ...reagents,
            // particles.g,
            // particles.g
        ])[Symbol.iterator]()
            .map(reagents => ({
                reagents,
                products: [],
            }))
    )]).map(vars => vars[0].reagents);

export function ReactionVariants({
    title, reagents, setSelectedReactionVariant, showImpossibleReactions,
}: {
    title: string;
    reagents: (ParticleKind | Particle)[];
    setSelectedReactionVariant: (x: ResolvedReaction & {
        twins: Array<ResolvedReaction>;
    }) => void;
    showImpossibleReactions: boolean;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return <div>
        <div
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            <button>{isCollapsed ? ">" : "⌄"}</button>
            &nbsp;
            {title}
        </div>
        {!isCollapsed && <div className={css({ paddingLeft: 20 })}>
            {prepareReactionRequests(reagents)
                .map((reagents, i) => <ReactionForDirections
                    key={i}
                    reagents={reagents}
                    setSelectedReactionVariant={setSelectedReactionVariant}
                    showImpossibleReactions={showImpossibleReactions}
                />)}
        </div>}
    </div>;
}
