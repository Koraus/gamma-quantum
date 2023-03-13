import { css } from "@emotion/css";
import { useState } from "react";
import { ReactionForDirections } from "./ReactionForDirections";
import { groupReactionVariantsBySymmetries } from "../puzzle/reactions/groupReactionVariantsBySymmetries";
import * as hax from "../utils/hax";
import { particles } from "./reactions";
import { velocityVariants4 } from "../puzzle/reactions/enumerateProductVelocities";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle, particleMass } from "../puzzle/world/Particle";
import { tuple } from "../utils/tuple";
import { ResolvedReaction } from "../puzzle/reactions/Reaction";


const prepareReactionRequests = ({ reagents, products }: {
    reagents: ParticleKind[];
    products: ParticleKind[];
}) => groupReactionVariantsBySymmetries(velocityVariants4.map((vels) => ({
    reagents: [
        ...reagents,
        // particles.g,
        // particles.g
    ].slice(0, 4)
        .map((p, i) => ({ velocity: tuple(...vels[i]), ...p }))
        .filter(p => particleMass(p) > 0 || hax.len(p.velocity) > 0),
    products: [],
}))).map(vars => ({
    ...vars[0],
    products,
}));

export function ReactionVariants({
    title, reaction, setSelectedReactionVariant, showImpossibleReactions,
}: {
    title: string;
    reaction: {
        reagents: ParticleKind[]; products: ParticleKind[];
    };
    setSelectedReactionVariant: (x: ResolvedReaction & {
        twins: Array<ResolvedReaction>;
    }) => void;
    showImpossibleReactions: boolean;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return <div>
        <div
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            <button>{isCollapsed ? ">" : "⌄"}</button>
            &nbsp;
            {title}
        </div>
        {!isCollapsed && <div className={css({ paddingLeft: 20 })}>
            {prepareReactionRequests(reaction)
                .map((reaction, i) => <ReactionForDirections
                    key={i}
                    {...reaction}
                    setSelectedReactionVariant={setSelectedReactionVariant}
                    showImpossibleReactions={showImpossibleReactions}
                />)}
        </div>}
    </div>;
}
