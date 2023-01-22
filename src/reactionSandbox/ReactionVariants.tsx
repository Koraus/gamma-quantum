import { v3 } from "../utils/v";
import { css } from "@emotion/css";
import { useState } from "react";
import { ReactionForDirections } from "./ReactionForDirections";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";
import * as hg from "../utils/hg";
import { particles } from "./particles";
import { velocityVariants4 } from "./resolveReaction";
import { ParticleKind, particleMass, Particle } from "../puzzle/terms";


const prepareReactionRequests = ({ reagents, products }: {
    reagents: ParticleKind[];
    products: ParticleKind[];
}) => groupReactionVariantsBySymmetries(velocityVariants4.map((vels) => ({
    reagents: [...reagents, particles.g].slice(0, 4)
        .map((p, i) => ({ velocity: vels[i], ...p }))
        .filter(p => particleMass(p) > 0 || hg.cubeLen(p.velocity) > 0),
    products: [],
}))).map(vars => ({
    ...vars[0],
    products,
}));

export function ReactionVariants({
    title, reaction, setSelectedReactionVariant,
}: {
    title: string;
    reaction: {
        reagents: ParticleKind[]; products: ParticleKind[];
    };
    setSelectedReactionVariant: (x: {
        reagents: Particle[];
        products: Particle[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>;
    }) => void;
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
            {prepareReactionRequests(reaction).map((reaction, i) => <ReactionForDirections
                key={i}
                {...reaction}
                setSelectedReactionVariant={setSelectedReactionVariant} />)}
        </div>}
    </div>;
}
